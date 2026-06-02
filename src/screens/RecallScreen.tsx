import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, Pill, H2 } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { WordArrange } from "../components/WordArrange";
import {
  speak, stopSpeaking,
  isRecognitionAvailable, startRecognition, RecognitionHandle, matchScore,
} from "../speech/speech";
import { phrases } from "../data/phrases";
import { initProgress, dueIds, newIds, recordResult, dueCount } from "../progress/store";
import { colors, font, spacing } from "../theme";
import { shuffle } from "../util";

/**
 * RECALL — active retrieval with spaced repetition.
 * Shows the *meaning*, learner must reconstruct the English (tiles + optional speak).
 * Correct → phrase promoted up one Leitner box (longer until next review).
 * Wrong   → phrase drops back (reviewed sooner again).
 */

type Phase = "prompt" | "check" | "done";

const SESSION_SIZE = 5;

export function RecallScreen({ onBack }: { onBack: () => void }) {
  const [ready, setReady] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);
  const [qi, setQi] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  useEffect(() => {
    initProgress().then(() => {
      const allIds = phrases.map(p => p.id);
      const due = dueIds(allIds);
      // Fill session from due items first, then new ones, then shuffle remaining
      const fresh = newIds(allIds);
      const combined = [...due, ...fresh];
      setQueue(shuffle(combined).slice(0, SESSION_SIZE));
      setReady(true);
    });
    return () => stopSpeaking();
  }, []);

  if (!ready) return null;

  if (queue.length === 0) {
    return (
      <Screen>
        <ActivityHeader title="Recall" onBack={onBack} />
        <Card style={{ marginTop: spacing.lg, alignItems: "center" }}>
          <Text style={{ fontSize: 56 }}>📚</Text>
          <H2 style={{ marginTop: spacing.sm }}>Nothing to recall yet!</H2>
          <Body style={{ color: colors.textSoft, marginTop: spacing.xs, textAlign: "center" }}>
            Complete a Learn session first to add phrases to your memory bank.
          </Body>
          <Button title="Back to menu" onPress={onBack} style={{ marginTop: spacing.lg, alignSelf: "stretch" }} />
        </Card>
      </Screen>
    );
  }

  if (sessionDone) {
    const pct = Math.round((correct / queue.length) * 100);
    const great = pct >= 80;
    return (
      <Screen>
        <ActivityHeader title="Recall" onBack={onBack} />
        <Card style={{ marginTop: spacing.lg, alignItems: "center" }}>
          <Text style={{ fontSize: 56 }}>{great ? "🧠" : "💪"}</Text>
          <H2 style={{ marginTop: spacing.sm }}>{great ? "Excellent memory!" : "Keep practising!"}</H2>
          <Text style={styles.score}>{correct}/{queue.length}</Text>
          <Body style={{ color: colors.textSoft }}>{pct}% correct</Body>
          <Body style={{ color: colors.textSoft, marginTop: spacing.xs, textAlign: "center" }}>
            Phrases you got right are scheduled further away.{"\n"}Ones you missed will come back sooner.
          </Body>
          <Button title="Recall again" icon="🔁" onPress={() => {
            stopSpeaking();
            initProgress().then(() => {
              const allIds = phrases.map(p => p.id);
              const due = dueIds(allIds);
              const fresh = newIds(allIds);
              setQueue(shuffle([...due, ...fresh]).slice(0, SESSION_SIZE));
              setQi(0); setCorrect(0); setSessionDone(false);
            });
          }} style={{ marginTop: spacing.lg, alignSelf: "stretch" }} />
          <Button title="Back to menu" variant="neutral" onPress={onBack} style={{ marginTop: spacing.sm, alignSelf: "stretch" }} />
        </Card>
      </Screen>
    );
  }

  const phraseId = queue[qi];
  const phrase = phrases.find(p => p.id === phraseId);
  if (!phrase) { setQi(q => q + 1); return null; }

  async function handleResult(ok: boolean) {
    await recordResult(phraseId, ok);
    if (ok) setCorrect(c => c + 1);
    if (qi + 1 >= queue.length) setSessionDone(true);
    else setQi(q => q + 1);
  }

  return (
    <Screen>
      <ActivityHeader title="Recall" onBack={onBack} step={qi + 1} total={queue.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <RecallCard phrase={phrase} onResult={handleResult} />
      </ScrollView>
    </Screen>
  );
}

function RecallCard({
  phrase,
  onResult,
}: {
  phrase: { id: string; english: string; meaning: string; topic: string };
  onResult: (ok: boolean) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [tileResult, setTileResult] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [speakScore, setSpeakScore] = useState<number | null>(null);
  const recRef = useRef<RecognitionHandle | null>(null);
  const supported = isRecognitionAvailable();

  useEffect(() => () => { recRef.current?.stop(); stopSpeaking(); }, [phrase.id]);

  function startListen() {
    setHeard(""); setSpeakScore(null); setListening(true);
    const h = startRecognition({
      onResult: (t, final) => { setHeard(t); if (final) { setSpeakScore(matchScore(phrase.english, t)); setListening(false); } },
      onError: () => setListening(false),
      onEnd: () => setListening(false),
    });
    if (!h) setListening(false);
    else recRef.current = h;
  }

  return (
    <Card style={{ marginTop: spacing.md }}>
      <Pill text={phrase.topic} />
      <H2 style={{ marginTop: spacing.sm }}>What is the English sentence?</H2>
      <Body style={{ color: colors.textSoft, marginTop: spacing.xs, fontSize: font.body + 2 }}>
        {phrase.meaning}
      </Body>

      <Button
        title="Hear a hint 🔊"
        variant="neutral"
        onPress={() => speak(phrase.english)}
        style={{ marginTop: spacing.md }}
      />

      <View style={{ marginTop: spacing.md }}>
        <WordArrange
          sentence={phrase.english}
          onResult={(ok) => setTileResult(ok)}
          onNext={() => onResult(tileResult ?? false)}
          nextLabel="Next phrase →"
        />
      </View>

      {tileResult !== null && (
        <>
          {/* Also let them say it after they built it */}
          {supported && (
            <View style={{ marginTop: spacing.md }}>
              <Body style={{ color: colors.textSoft }}>Now say it out loud too:</Body>
              <Button
                title={listening ? "Listening…" : "🎤 Say it"}
                variant={listening ? "accent" : "neutral"}
                onPress={listening ? () => recRef.current?.stop() : startListen}
                style={{ marginTop: spacing.xs }}
              />
              {heard !== "" && (
                <Body style={{ fontStyle: "italic", marginTop: spacing.xs }}>I heard: "{heard}"</Body>
              )}
              {speakScore !== null && (
                <Pill
                  tone={speakScore >= 0.7 ? "good" : "bad"}
                  text={speakScore >= 0.7 ? "✓ Great pronunciation!" : "Keep practising the spoken version."}
                />
              )}
            </View>
          )}
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  score: { fontSize: font.title + 10, fontWeight: "900", color: colors.primary, marginTop: spacing.md },
});
