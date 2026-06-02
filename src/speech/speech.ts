import { Platform } from "react-native";
import * as Speech from "expo-speech";

/* ================================================================== */
/*  TEXT TO SPEECH                                                     */
/*  Goal: sound as natural as the device allows by choosing the best   */
/*  available "neural / natural" voice instead of the robotic default. */
/* ================================================================== */

export type VoiceInfo = {
  id: string; // identifier we pass back to speak()
  name: string; // friendly name shown in the picker
  lang: string;
  natural: boolean; // true for neural / enhanced / online voices
};

let webVoices: SpeechSynthesisVoice[] = [];
let nativeVoices: Speech.Voice[] = [];
let autoVoiceA: string | null = null; // best voice (primary)
let autoVoiceB: string | null = null; // a different voice, for dialog variety
let userVoiceId: string | null = null; // manual override (null = automatic)
let ready = false;

const NEURAL = /natural|neural|enhanced|premium|online/i;
const NICE = /google|siri|aria|jenny|guy|davis|libby|sonia|emma|ava|michelle|christopher|eric|jane|nancy|samantha|alex|daniel|karen|tessa|fiona|moira/i;
const FEMALE = /aria|jenny|zira|libby|sonia|emma|ava|michelle|samantha|karen|tessa|fiona|moira|nancy|jane|hazel|susan|female|woman|\bf\b/i;
const MALE = /guy|davis|david|mark|christopher|eric|tony|brian|james|george|daniel|alex|male|\bman\b/i;

/* ---------- web voice handling ---------- */

function scoreWeb(v: SpeechSynthesisVoice): number {
  let s = 0;
  const n = v.name.toLowerCase();
  if (NEURAL.test(n)) s += 200;
  if (/google/.test(n)) s += 90;
  if (v.localService === false) s += 70;
  if (NICE.test(n)) s += 40;
  if (/en[-_]us/i.test(v.lang)) s += 15;
  if (/^en/i.test(v.lang)) s += 10;
  if (/david|mark/.test(n)) s -= 8; // the classic robotic defaults
  return s;
}

function gender(name: string): "f" | "m" | "?" {
  if (FEMALE.test(name)) return "f";
  if (MALE.test(name)) return "m";
  return "?";
}

function autoPickWeb() {
  const english = webVoices.filter((v) => /^en/i.test(v.lang));
  const pool = (english.length ? english : webVoices).slice();
  pool.sort((a, b) => scoreWeb(b) - scoreWeb(a));
  if (pool.length === 0) return;
  autoVoiceA = pool[0].voiceURI;
  // Pick B: prefer a different gender than A for natural-sounding dialogs.
  const gA = gender(pool[0].name);
  const diff = pool.find((v) => v.voiceURI !== autoVoiceA && gender(v.name) !== gA && gender(v.name) !== "?");
  autoVoiceB = (diff || pool[1] || pool[0]).voiceURI;
}

function loadWebVoices(): Promise<void> {
  return new Promise((resolve) => {
    const synth = (globalThis as any).speechSynthesis as SpeechSynthesis | undefined;
    if (!synth) return resolve();
    const grab = () => {
      const v = synth.getVoices();
      if (v.length) {
        webVoices = v;
        autoPickWeb();
        resolve();
      }
    };
    const existing = synth.getVoices();
    if (existing.length) {
      webVoices = existing;
      autoPickWeb();
      return resolve();
    }
    synth.onvoiceschanged = grab;
    setTimeout(grab, 1200); // safety net if the event never fires
  });
}

/* ---------- native voice handling ---------- */

async function loadNativeVoices() {
  try {
    nativeVoices = await Speech.getAvailableVoicesAsync();
  } catch {
    nativeVoices = [];
  }
  const english = nativeVoices.filter((v) => (v.language || "").toLowerCase().startsWith("en"));
  const score = (v: Speech.Voice) => {
    let s = 0;
    if (v.quality === Speech.VoiceQuality.Enhanced) s += 100;
    if (NEURAL.test(v.name || "") || NEURAL.test(v.identifier || "")) s += 120;
    if (NICE.test(v.name || "")) s += 30;
    if ((v.language || "").toLowerCase().startsWith("en-us")) s += 10;
    return s;
  };
  const pool = english.slice().sort((a, b) => score(b) - score(a));
  if (pool.length) {
    autoVoiceA = pool[0].identifier;
    const gA = gender(pool[0].name || pool[0].identifier);
    const diff = pool.find(
      (v) => v.identifier !== autoVoiceA && gender(v.name || v.identifier) !== gA && gender(v.name || v.identifier) !== "?"
    );
    autoVoiceB = (diff || pool[1] || pool[0]).identifier;
  }
}

/* ---------- public init + voice selection ---------- */

export async function initSpeech(): Promise<void> {
  if (ready) return;
  // restore saved choice (web only — localStorage)
  try {
    if (Platform.OS === "web") {
      userVoiceId = (globalThis as any).localStorage?.getItem("et_voice") || null;
    }
  } catch {}
  if (Platform.OS === "web") await loadWebVoices();
  else await loadNativeVoices();
  ready = true;
}

/** English voices available on this device, for the picker UI. */
export function listVoices(): VoiceInfo[] {
  if (Platform.OS === "web") {
    return webVoices
      .filter((v) => /^en/i.test(v.lang))
      .map((v) => ({ id: v.voiceURI, name: v.name, lang: v.lang, natural: NEURAL.test(v.name) || v.localService === false }))
      .sort((a, b) => Number(b.natural) - Number(a.natural) || a.name.localeCompare(b.name));
  }
  return nativeVoices
    .filter((v) => (v.language || "").toLowerCase().startsWith("en"))
    .map((v) => ({
      id: v.identifier,
      name: v.name || v.identifier,
      lang: v.language || "en",
      natural: v.quality === Speech.VoiceQuality.Enhanced || NEURAL.test(v.name || ""),
    }))
    .sort((a, b) => Number(b.natural) - Number(a.natural) || a.name.localeCompare(b.name));
}

export function getPreferredVoiceId(): string | null {
  return userVoiceId; // null means "automatic best"
}

export function setPreferredVoiceId(id: string | null) {
  userVoiceId = id;
  try {
    if (Platform.OS === "web") {
      const ls = (globalThis as any).localStorage;
      if (id) ls?.setItem("et_voice", id);
      else ls?.removeItem("et_voice");
    }
  } catch {}
}

/** Whether this device offers at least one genuinely natural voice. */
export function hasNaturalVoice(): boolean {
  return listVoices().some((v) => v.natural);
}

function resolveVoiceId(which: "a" | "b" | undefined): string | null {
  if (userVoiceId) {
    // Honor the user's pick for the main speaker; keep variety for "b".
    if (which === "b") return autoVoiceB && autoVoiceB !== userVoiceId ? autoVoiceB : userVoiceId;
    return userVoiceId;
  }
  return which === "b" ? autoVoiceB ?? autoVoiceA : autoVoiceA;
}

/* ---------- speak ---------- */

export type SpeakOpts = {
  rate?: number;
  voice?: "a" | "b"; // "a" = main speaker, "b" = the other person in a dialog
  voiceId?: string; // explicit voice (used by the picker's "Try it")
  onDone?: () => void;
  onStart?: () => void;
};

export function speak(text: string, opts?: SpeakOpts) {
  if (Platform.OS === "web") speakWeb(text, opts);
  else speakNative(text, opts);
}

function speakWeb(text: string, opts?: SpeakOpts) {
  const synth = (globalThis as any).speechSynthesis as SpeechSynthesis | undefined;
  if (!synth) return;
  synth.cancel();
  const u = new (globalThis as any).SpeechSynthesisUtterance(text) as SpeechSynthesisUtterance;
  const id = opts?.voiceId ?? resolveVoiceId(opts?.voice);
  const v = id ? webVoices.find((x) => x.voiceURI === id) : null;
  if (v) {
    u.voice = v;
    u.lang = v.lang;
  } else {
    u.lang = "en-US";
  }
  u.rate = opts?.rate ?? 0.97; // close to natural; the "Slower" button passes a lower value
  u.pitch = 1.0;
  if (opts?.onStart) u.onstart = opts.onStart;
  u.onend = () => opts?.onDone?.();
  u.onerror = () => opts?.onDone?.();
  synth.speak(u);
}

function speakNative(text: string, opts?: SpeakOpts) {
  Speech.stop();
  const id = opts?.voiceId ?? resolveVoiceId(opts?.voice);
  Speech.speak(text, {
    language: "en-US",
    voice: id ?? undefined,
    rate: opts?.rate ?? 0.97,
    pitch: 1.0,
    onStart: opts?.onStart,
    onDone: opts?.onDone,
    onStopped: opts?.onDone,
    onError: opts?.onDone,
  });
}

export function stopSpeaking() {
  if (Platform.OS === "web") (globalThis as any).speechSynthesis?.cancel();
  else Speech.stop();
}

/* ================================================================== */
/*  SPEECH TO TEXT  (unchanged: browser Web Speech API; native falls   */
/*  back to typed input in the screens that use it)                    */
/* ================================================================== */

export type RecognitionHandle = { stop: () => void };

export type RecognitionHandlers = {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (message: string) => void;
  onEnd?: () => void;
};

// Lazily load the native module so web bundling is never affected.
function nativeModule(): any | null {
  if (Platform.OS === "web") return null;
  try {
    return require("expo-speech-recognition");
  } catch {
    return null;
  }
}

export function isRecognitionAvailable(): boolean {
  if (Platform.OS === "web") {
    const w = globalThis as any;
    return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
  }
  return nativeModule() != null;
}

export function startRecognition(handlers: RecognitionHandlers): RecognitionHandle | null {
  if (Platform.OS !== "web") return startRecognitionNative(handlers);
  return startRecognitionWeb(handlers);
}

/* ---- native (phone / tablet) via expo-speech-recognition ---- */
function startRecognitionNative(handlers: RecognitionHandlers): RecognitionHandle | null {
  const mod = nativeModule();
  if (!mod) return null;
  const M = mod.ExpoSpeechRecognitionModule;
  const subs: { remove: () => void }[] = [];
  let stopped = false;
  const cleanup = () => {
    subs.forEach((s) => s.remove());
    subs.length = 0;
  };

  subs.push(
    M.addListener("result", (e: any) => {
      const transcript = (e?.results?.[0]?.transcript ?? "").trim();
      handlers.onResult(transcript, !!e?.isFinal);
    })
  );
  subs.push(M.addListener("error", (e: any) => handlers.onError?.(e?.error || e?.message || "Recognition error")));
  subs.push(
    M.addListener("end", () => {
      cleanup();
      handlers.onEnd?.();
    })
  );

  M.requestPermissionsAsync()
    .then((res: any) => {
      if (!res?.granted) {
        handlers.onError?.("Microphone permission was not granted.");
        cleanup();
        handlers.onEnd?.();
        return;
      }
      if (stopped) return;
      M.start({ lang: "en-US", interimResults: true, continuous: false, addsPunctuation: false });
    })
    .catch((err: any) => {
      handlers.onError?.(String(err?.message || err));
      cleanup();
      handlers.onEnd?.();
    });

  return {
    stop: () => {
      stopped = true;
      try {
        M.stop();
      } catch {}
    },
  };
}

/* ---- web via the browser's Web Speech API ---- */
function startRecognitionWeb(handlers: RecognitionHandlers): RecognitionHandle | null {
  const w = globalThis as any;
  if (!(w.SpeechRecognition || w.webkitSpeechRecognition)) return null;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  const rec = new Ctor();
  rec.lang = "en-US";
  rec.interimResults = true;
  rec.continuous = false;
  rec.maxAlternatives = 1;

  rec.onresult = (event: any) => {
    let transcript = "";
    let isFinal = false;
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) isFinal = true;
    }
    handlers.onResult(transcript.trim(), isFinal);
  };
  rec.onerror = (e: any) => handlers.onError?.(e?.error || "Recognition error");
  rec.onend = () => handlers.onEnd?.();

  try {
    rec.start();
  } catch {
    return null;
  }
  return { stop: () => rec.stop() };
}

/* ================================================================== */
/*  Scoring helpers — compare what they said to the target sentence    */
/* ================================================================== */

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"'’“”\-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s: string): string[] {
  const n = normalize(s);
  return n ? n.split(" ") : [];
}

export function matchScore(target: string, spoken: string): number {
  const t = tokens(target);
  const s = tokens(spoken);
  if (t.length === 0) return 0;
  let matched = 0;
  let si = 0;
  for (const word of t) {
    const found = s.indexOf(word, si);
    if (found !== -1) {
      matched++;
      si = found + 1;
    }
  }
  return matched / t.length;
}

export function isCloseEnough(target: string, spoken: string, threshold = 0.7): boolean {
  return matchScore(target, spoken) >= threshold;
}

export function missingWords(target: string, spoken: string): string[] {
  const s = new Set(tokens(spoken));
  return tokens(target).filter((w) => !s.has(w));
}
