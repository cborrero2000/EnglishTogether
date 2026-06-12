import { getItem, setItem } from "./storage";

/**
 * Spaced-repetition progress for every phrase, using simple Leitner "boxes".
 * A higher box = better known = longer until it needs review again.
 * This powers Recall (active retrieval) and Daily Review (exposure maintenance).
 */

export type PhraseProgress = {
  id: string;
  box: number; // 0..6
  due: number; // timestamp (ms) when it should be reviewed again
  seen: number; // total times practiced
  correct: number; // total correct
  lastSeen: number;
};

type DB = Record<string, PhraseProgress>;

const KEY = "et_progress_v1";
const DAY = 24 * 60 * 60 * 1000;

// Days until the next review for each box.
const INTERVALS = [0, 1, 2, 4, 9, 18, 35];
const MAX_BOX = INTERVALS.length - 1;

let db: DB = {};
let loaded = false;

export async function initProgress(): Promise<void> {
  if (loaded) return;
  try {
    const raw = await getItem(KEY);
    db = raw ? (JSON.parse(raw) as DB) : {};
  } catch {
    db = {};
  }
  loaded = true;
}

async function persist() {
  try {
    await setItem(KEY, JSON.stringify(db));
  } catch {}
}

function intervalFor(box: number): number {
  const b = Math.max(0, Math.min(MAX_BOX, box));
  return INTERVALS[b] * DAY;
}

export function isLearned(id: string): boolean {
  return !!db[id];
}

export function getProgress(id: string): PhraseProgress | undefined {
  return db[id];
}

/** IDs the learner has never studied yet (in the given order). */
export function newIds(allIds: string[]): string[] {
  return allIds.filter((id) => !db[id]);
}

/** Learned IDs that are due for review now (most overdue first). */
export function dueIds(allIds: string[], at: number = Date.now()): string[] {
  return allIds
    .filter((id) => db[id] && db[id].due <= at)
    .sort((a, b) => db[a].due - db[b].due);
}

export function learnedCount(): number {
  return Object.keys(db).length;
}

export function dueCount(allIds: string[], at: number = Date.now()): number {
  return dueIds(allIds, at).length;
}

/** Record a practice result and schedule the next review. */
export async function recordResult(id: string, correct: boolean): Promise<void> {
  const now = Date.now();
  const prev = db[id];
  const box = prev
    ? correct
      ? Math.min(MAX_BOX, prev.box + 1)
      : Math.max(0, prev.box - 1)
    : correct
    ? 1
    : 0;
  db[id] = {
    id,
    box,
    due: now + intervalFor(box),
    seen: (prev?.seen ?? 0) + 1,
    correct: (prev?.correct ?? 0) + (correct ? 1 : 0),
    lastSeen: now,
  };
  await persist();
}

/** Mark a phrase as introduced (used by the Learn flow on completion). */
export async function markLearned(id: string, correct = true): Promise<void> {
  await recordResult(id, correct);
}

export async function resetProgress(): Promise<void> {
  db = {};
  await persist();
}

/** All progress entries currently in the database. */
export function allProgress(): PhraseProgress[] {
  return Object.values(db);
}

/** Overall accuracy across all practiced phrases, 0..1 (null if nothing practiced yet). */
export function overallAccuracy(): number | null {
  const entries = allProgress();
  const seen = entries.reduce((sum, e) => sum + e.seen, 0);
  if (seen === 0) return null;
  const correct = entries.reduce((sum, e) => sum + e.correct, 0);
  return correct / seen;
}

function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * Number of consecutive days (ending today) with at least one practiced phrase.
 * Counts from `lastSeen` timestamps; a gap of a day or more ends the streak.
 */
export function streakDays(at: number = Date.now()): number {
  const days = new Set(allProgress().map((e) => startOfDay(e.lastSeen)));
  if (days.size === 0) return 0;
  const DAY = 24 * 60 * 60 * 1000;
  let day = startOfDay(at);
  // If nothing was practiced today yet, the streak still counts up to yesterday.
  if (!days.has(day)) day -= DAY;
  let streak = 0;
  while (days.has(day)) {
    streak++;
    day -= DAY;
  }
  return streak;
}
