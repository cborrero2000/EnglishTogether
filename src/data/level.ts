/**
 * Lightweight content leveling.
 *
 * Rather than hand-tagging every item in src/data, we classify each piece of
 * English text at runtime by length and vocabulary complexity. This gives a
 * "Beginner" / "Intermediate" split that practice screens can filter on,
 * without touching the existing content files.
 */

export type Level = "beginner" | "intermediate";

// Common short words that don't make a sentence harder, even if the
// sentence itself is long (articles, pronouns, basic verbs, etc.).
const SIMPLE_WORDS = new Set([
  "i", "you", "he", "she", "it", "we", "they", "a", "an", "the", "is", "are",
  "am", "was", "were", "do", "does", "did", "have", "has", "had", "to", "of",
  "in", "on", "at", "for", "and", "or", "but", "not", "this", "that", "my",
  "your", "his", "her", "its", "our", "their", "can", "will", "would", "go",
  "going", "want", "like", "good", "please", "thank", "thanks", "yes", "no",
  "hi", "hello", "how", "what", "where", "when", "who", "why",
]);

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"'’“”\-]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Classify a sentence/phrase as "beginner" or "intermediate".
 * Heuristic: short sentences made mostly of common words are beginner;
 * longer sentences, or ones using less common/longer words, are intermediate.
 */
export function classifyLevel(text: string): Level {
  const w = words(text);
  if (w.length === 0) return "beginner";

  const longWords = w.filter((word) => word.length >= 7).length;
  const unfamiliar = w.filter((word) => !SIMPLE_WORDS.has(word) && word.length > 4).length;

  if (w.length > 12 || longWords >= 2 || unfamiliar >= 4) return "intermediate";
  return "beginner";
}

/** Classify a whole item by the longest/most representative text it contains. */
export function classifyByLongestText(texts: string[]): Level {
  const nonEmpty = texts.filter(Boolean);
  if (nonEmpty.length === 0) return "beginner";
  // If any individual line is intermediate, treat the whole item as intermediate.
  return nonEmpty.some((t) => classifyLevel(t) === "intermediate") ? "intermediate" : "beginner";
}

export type LevelFilter = Level | "all";

export function matchesLevel(itemLevel: Level, filter: LevelFilter): boolean {
  return filter === "all" || filter === itemLevel;
}

/**
 * Filter a content array to the chosen difficulty level.
 * If the filter would leave too few items for a session, falls back to the
 * full list so practice sessions are never empty.
 */
export function filterByLevel<T>(items: T[], getTexts: (item: T) => string[], filter: LevelFilter, minCount = 4): T[] {
  if (filter === "all") return items;
  const filtered = items.filter((item) => matchesLevel(classifyByLongestText(getTexts(item)), filter));
  return filtered.length >= minCount ? filtered : items;
}
