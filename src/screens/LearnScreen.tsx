import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2, Pill } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { WordArrange } from "../components/WordArrange";
import {
  speak, stopSpeaking,
  isRecognitionAvailable, startRecognition, RecognitionHandle,
  matchScore, missingWords,
} from "../speech/speech";
import { phrases, Phrase } from "../data/phrases";
import { markLearned, initProgress } from "../progress/store";
import { colors, font, spacing } from "../theme";
import { shuffle } from "../util";

/**
 * Full multi-sensory lesson.  Each phrase goes through 4 steps in priority order:
 *   1 LISTEN  – hear it, pick which sentence was said (3 choices)
 *   2 SPEAK   – read it out loud; mic checks pronunciation
 *   3 READ    – read the sentence, pick its meaning (3 choices)
 *   4 WRITE   – tap word tiles to build the sentence
 * After step 4 the phrase is saved to spaced-repetition memory.
 */

type Step = "listen" | "speak" | "read" | "write" | "done";

const BATCH = 3; // phrases per lesson session

export function LearnScreen({ onBack }: { onBack: () => void }) {
  const [ready, setReady] = useState(false);
  const [batch, setBatch] = useState<Phrase[]>([]);
  const [pi, setPi] = useState(0); // phrase index
  const [step, setStep] = useState<Step>("listen");
  const [sessionDone, setSessionDone] = useState(false);

  useEffect(() => {
    initProgress().then(() => {
      setBatch(shuffle(phrases).slice(0, BATCH));
      setReady(true);
    });
    return () => stopSpeaking();
  }, []);

  if (!ready) return null;

  const phrase = batch[pi];
  const totalSteps = batch.length * 4;
  const currentStepNum = pi * 4 + ["listen","speak","read","write"].indexOf(step) + 1;

  async function advance(correct = true) {
    if (step === "write") {
      await markLearned(phrase.id, correct);
      if (pi + 1 >= batch.length) {
        setSessionDone(true);
      } else {
        setPi(pi + 1);
        setStep("listen");
      }
    } else {
      const next: Step[] = ["listen","speak","read","write"];
      setStep(next[next.indexOf(step) + 1]);
    }
  }

  function restart() {
    stopSpeaking();
    setBatch(shuffle(phrases).slice(0, BATCH));
    setPi(0);
    setStep("listen");
    setSessionDone(false);
  }

  if (sessionDone) {
    return (
      <Screen>
        <ActivityHeader title="Learn" onBack={onBack} />
        <Card style={{ marginTop: spacing.lg, alignItems: "center" }}>
          <Text style={{ fontSize: 56 }}>🌟</Text>
          <H2 style={{ marginTop: spacing.sm }}>Lesson complete!</H2>
          <Body style={{ color: colors.textSoft, marginTop: spacing.xs, textAlign: "center" }}>
            You practiced {batch.length} phrases through listening, speaking, reading, and building.
            They are now saved for your Daily Review.
          </Body>
          <Button title="Learn more" onPress={restart} style={{ marginTop: spacing.lg, alignSelf: "stretch" }} />
          <Button title="Back to menu" variant="neutral" onPress={onBack} style={{ marginTop: spacing.sm, alignSelf: "stretch" }} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <ActivityHeader title="Learn" onBack={onBack} step={currentStepNum} total={totalSteps} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={styles.topicRow}>
          <Pill text={phrase.topic} />
          <Pill text={STEP_LABELS[step]} tone={STEP_TONES[step]} />
        </View>

        {step === "listen" && <ListenStep phrase={phrase} onNext={() => advance()} />}
        {step === "speak"  && <SpeakStep  phrase={phrase} onNext={() => advance()} />}
        {step === "read"   && <ReadStep   phrase={phrase} onNext={() => advance()} />}
        {step === "write"  && <WriteStep  phrase={phrase} onNext={(ok) => advance(ok)} />}
      </ScrollView>
    </Screen>
  );
}

/* ── STEP 1: LISTEN ─────────────────────────────────────── */
function ListenStep({ phrase, onNext }: { phrase: Phrase; onNext: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const options = useShuffledOptions(phrase.english, phrases);

  useEffect(() => {
    const t = setTimeout(() => speak(phrase.english), 350);
    return () => { clearTimeout(t); stopSpeaking(); };
  }, [phrase.id]);

  return (
    <Card style={{ marginTop: spacing.md }}>
      <H2>👂 Listen</H2>
      <Body style={{ color: colors.textSoft, marginTop: spacing.xs }}>
        Which sentence did you hear?
      </Body>
      <Button title="Play again" icon="🔊" variant="neutral" onPress={() => speak(phrase.english)} style={{ marginTop: spacing.md }} />
      <Button title="Slower" icon="🐢" variant="neutral" onPress={() => speak(phrase.english, { rate: 0.6 })} style={{ marginTop: spacing.sm }} />
      <View style={{ marginTop: spacing.md }}>
        {options.map((opt) => {
          const isCorrect = opt === phrase.english;
          let state: "idle"|"correct"|"wrong"|"dim" = "idle";
          if (picked) state = isCorrect ? "correct" : opt === picked ? "wrong" : "dim";
          return (
            <ChoiceButton key={opt} label={opt} state={state}
              disabled={!!picked} onPress={() => { if (!picked) setPicked(opt); }} />
          );
        })}
      </View>
      {picked && (
        <Button title="Next →" onPress={onNext} style={{ marginTop: spacing.md }} />
      )}
    </Card>
  );
}

/* ── STEP 2: SPEAK ──────────────────────────────────────── */
function SpeakStep({ phrase, onNext }: { phrase: Phrase; onNext: () => void }) {
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const recRef = useRef<RecognitionHandle | null>(null);
  const supported = isRecognitionAvailable();

  useEffect(() => () => { recRef.current?.stop(); stopSpeaking(); }, []);

  function startListen() {
    setHeard(""); setScore(null); setListening(true);
    const h = startRecognition({
      onResult: (t, final) => { setHeard(t); if (final) finish(t); },
      onError:  () => setListening(false),
      onEnd:    () => setListening(false),
    });
    if (!h) { setListening(false); return; }
    recRef.current = h;
  }
  function finish(t: string) {
    recRef.current?.stop(); recRef.current = null;
    setScore(matchScore(phrase.english, t));
    setListening(false);
  }

  const passed = score !== null && score >= 0.7;
  const missed = score !== null && !passed ? missingWords(phrase.english, heard) : [];

  return (
    <Card style={{ marginTop: spacing.md }}>
      <H2>🎤 Speak</H2>
      <Text style={styles.target}>{phrase.english}</Text>
      <Button title="Hear it" icon="🔊" variant="neutral" onPress={() => speak(phrase.english)} style={{ marginTop: spacing.md }} />

      {supported ? (
        <Button
          title={listening ? "Listening… tap to stop" : "Tap and say it"}
          icon={listening ? "🔴" : "🎤"}
          variant={listening ? "accent" : "primary"}
          onPress={listening ? () => { recRef.current?.stop(); } : startListen}
          style={{ marginTop: spacing.sm }}
        />
      ) : (
        <Body style={{ color: colors.textSoft, marginTop: spacing.sm }}>
          🎤 Open in a browser on your computer to check your speaking.
        </Body>
      )}

      {heard !== "" && (
        <Body style={{ fontStyle: "italic", marginTop: spacing.sm }}>I heard: "{heard}"</Body>
      )}
      {score !== null && (
        <View style={{ marginTop: spacing.sm }}>
          <Pill tone={passed ? "good" : "bad"}
            text={passed ? "✓ Great!" : "Almost — try once more"} />
          {missed.length > 0 && (
            <Body style={{ marginTop: spacing.xs }}>
              Focus on: <Text style={{ fontWeight: "800", color: colors.primary }}>{missed.join(", ")}</Text>
            </Body>
          )}
        </View>
      )}
      <Button
        title={passed ? "Next →" : "Skip to next step"}
        variant={passed ? "primary" : "neutral"}
        onPress={onNext}
        style={{ marginTop: spacing.md }}
      />
    </Card>
  );
}

/* ── STEP 3: READ ───────────────────────────────────────── */
function ReadStep({ phrase, onNext }: { phrase: Phrase; onNext: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const options = useShuffledMeanings(phrase, phrases);

  useEffect(() => {
    const t = setTimeout(() => speak(phrase.english), 200);
    return () => { clearTimeout(t); stopSpeaking(); };
  }, [phrase.id]);

  return (
    <Card style={{ marginTop: spacing.md }}>
      <H2>📖 Read</H2>
      <Text style={styles.target}>{phrase.english}</Text>
      <Button title="Hear it" icon="🔊" variant="neutral" onPress={() => speak(phrase.english)} style={{ marginTop: spacing.sm }} />
      <Body style={{ color: colors.textSoft, marginTop: spacing.md }}>What does this mean?</Body>
      <View style={{ marginTop: spacing.sm }}>
        {options.map((opt) => {
          const isCorrect = opt === phrase.meaning;
          let state: "idle"|"correct"|"wrong"|"dim" = "idle";
          if (picked) state = isCorrect ? "correct" : opt === picked ? "wrong" : "dim";
          return (
            <ChoiceButton key={opt} label={opt} state={state}
              disabled={!!picked} onPress={() => { if (!picked) setPicked(opt); }} />
          );
        })}
      </View>
      {picked && (
        <Button title="Next →" onPress={onNext} style={{ marginTop: spacing.md }} />
      )}
    </Card>
  );
}

/* ── STEP 4: WRITE (select tiles) ───────────────────────── */
function WriteStep({ phrase, onNext }: { phrase: Phrase; onNext: (correct: boolean) => void }) {
  const [result, setResult] = useState<boolean | null>(null);

  useEffect(() => {
    const t = setTimeout(() => speak(phrase.english), 200);
    return () => { clearTimeout(t); stopSpeaking(); };
  }, [phrase.id]);

  return (
    <Card style={{ marginTop: spacing.md }}>
      <H2>✏️ Build it</H2>
      <Body style={{ color: colors.textSoft }}>Meaning: {phrase.meaning}</Body>
      <Button title="Hear it" icon="🔊" variant="neutral" onPress={() => speak(phrase.english)} style={{ marginTop: spacing.sm, marginBottom: spacing.md }} />
      <WordArrange
        sentence={phrase.english}
        onResult={(ok) => setResult(ok)}
        onNext={() => onNext(result ?? false)}
        nextLabel="Finish phrase →"
      />
    </Card>
  );
}

/* ── Helpers ─────────────────────────────────────────────── */

function useShuffledOptions(correct: string, all: Phrase[]): string[] {
  const [opts] = useState(() => {
    const distractors = shuffle(all.filter(p => p.english !== correct)).slice(0, 2).map(p => p.english);
    return shuffle([correct, ...distractors]);
  });
  return opts;
}

function useShuffledMeanings(phrase: Phrase, all: Phrase[]): string[] {
  const [opts] = useState(() => {
    const distractors = shuffle(all.filter(p => p.id !== phrase.id)).slice(0, 2).map(p => p.meaning);
    return shuffle([phrase.meaning, ...distractors]);
  });
  return opts;
}

const STEP_LABELS: Record<Step, string> = {
  listen: "👂 Listen", speak: "🎤 Speak", read: "📖 Read", write: "✏️ Build", done: "Done",
};
const STEP_TONES: Record<Step, "neutral"|"good"|"bad"> = {
  listen: "neutral", speak: "good", read: "neutral", write: "neutral", done: "good",
};

const styles = StyleSheet.create({
  topicRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md, flexWrap: "wrap", paddingRight: spacing.md },
  target: { fontSize: font.big, fontWeight: "800", color: colors.text, marginTop: spacing.sm, lineHeight: font.big * 1.35 },
});
