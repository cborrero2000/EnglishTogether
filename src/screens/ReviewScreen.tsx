import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2, Pill } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { speak, stopSpeaking } from "../speech/speech";
import { phrases, Phrase } from "../data/phrases";
import { initProgress, dueIds, recordResult, learnedCount, dueCount } from "../progress/store";
import { colors, font, spacing } from "../theme";
import { shuffle } from "../util";

/**
 * DAILY REVIEW — Exposure Maintenance.
 * Resurfaces phrases that are *due* for a light review so they don't fade.
 * Each card does:  LISTEN (auto-play) → see the phrase → quick meaning check
 * Low-pressure: correct = scheduled further out, wrong = comes back tomorrow.
 */

type CardState = "listening" | "reveal" | "question" | "feedback";

const SESSION_SIZE = 8;

export function ReviewScreen({ onBack }: { onBack: () => void }) {
  const [ready, setReady] = useState(false);
  const [queue, setQueue] = useState<Phrase[]>([]);
  const [qi, setQi] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  useEffect(() => {
    initProgress().then(() => {
      const allIds = phrases.map(p => p.id);
      const due = dueIds(allIds);
      const duePhrases = due.map(id => phrases.find(p => p.id === id)!).filter(Boolean);
      setQueue(shuffle(duePhrases).slice(0, SESSION_SIZE));
      setReady(true);
    });
    return () => stopSpeaking();
  }, []);

  if (!ready) return null;

  const totalLearned = learnedCount();
  const totalDue = dueCount(phrases.map(p => p.id));

  if (queue.length === 0) {
    return (
      <Screen>
        <ActivityHeader title="Daily Review" onBack={onBack} />
        <Card style={{ marginTop: spacing.lg, alignItems: "center" }}>
          <Text style={{ fontSize: 56 }}>{totalLearned === 0 ? "📖" : "✅"}</Text>
          <H2 style={{ marginTop: spacing.sm }}>
            {totalLearned === 0 ? "Start with Learn first!" : "All caught up!"}
          </H2>
          <Body style={{ color: colors.textSoft, marginTop: spacing.xs, textAlign: "center" }}>
            {totalLearned === 0
              ? "Complete a Learn session and your phrases will appear here for daily review."
              : `You have learned ${totalLearned} phrase${totalLearned !== 1 ? "s" : ""}. No reviews are due right now — check back tomorrow!`}
          </Body>
          <Button title="Back to menu" onPress={onBack} style={{ marginTop: spacing.lg, alignSelf: "stretch" }} />
        </Card>
      </Screen>
    );
  }

  if (sessionDone) {
    const pct = Math.round((correct / queue.length) * 100);
    return (
      <Screen>
        <ActivityHeader title="Daily Review" onBack={onBack} />
        <Card style={{ marginTop: spacing.lg, alignItems: "center" }}>
          <Text style={{ fontSize: 56 }}>☀️</Text>
          <H2 style={{ marginTop: spacing.sm }}>Review done for today!</H2>
          <Text style={styles.score}>{correct}/{queue.length}</Text>
          <Body style={{ color: colors.textSoft }}>{pct}% remembered</Body>
          <Body style={{ color: colors.textSoft, marginTop: spacing.xs, textAlign: "center" }}>
            Phrases you remembered are scheduled for later.{"\n"}Ones you missed will come back sooner.
          </Body>
          <Button title="Back to menu" onPress={onBack} style={{ marginTop: spacing.lg, alignSelf: "stretch" }} />
        </Card>
      </Screen>
    );
  }

  const phrase = queue[qi];

  async function handleResult(ok: boolean) {
    await recordResult(phrase.id, ok);
    if (ok) setCorrect(c => c + 1);
    if (qi + 1 >= queue.length) setSessionDone(true);
    else setQi(q => q + 1);
  }

  return (
    <Screen>
      <ActivityHeader title="Daily Review" onBack={onBack} step={qi + 1} total={queue.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <ReviewCard phrase={phrase} allPhrases={phrases} onResult={handleResult} />
      </ScrollView>
    </Screen>
  );
}

function ReviewCard({
  phrase,
  allPhrases,
  onResult,
}: {
  phrase: Phrase;
  allPhrases: Phrase[];
  onResult: (ok: boolean) => void;
}) {
  const [cardState, setCardState] = useState<CardState>("listening");
  const [picked, setPicked] = useState<string | null>(null);

  // Meaning choices: 1 correct + 2 distractors
  const [options] = useState(() => {
    const d = shuffle(allPhrases.filter(p => p.id !== phrase.id)).slice(0, 2).map(p => p.meaning);
    return shuffle([phrase.meaning, ...d]);
  });

  // Auto-play as soon as the card mounts
  useEffect(() => {
    const t = setTimeout(() => {
      speak(phrase.english, { onDone: () => setCardState("reveal") });
    }, 300);
    return () => { clearTimeout(t); stopSpeaking(); };
  }, [phrase.id]);

  function choose(opt: string) {
    if (picked) return;
    setPicked(opt);
    setCardState("feedback");
  }

  const isCorrect = picked === phrase.meaning;

  return (
    <Card style={{ marginTop: spacing.md }}>
      <Pill text={phrase.topic} />

      {/* Listening state: show audio wave + hint */}
      {cardState === "listening" && (
        <View style={styles.listeningBox}>
          <Text style={styles.wave}>🔊</Text>
          <Body style={{ color: colors.textSoft, textAlign: "center", marginTop: spacing.sm }}>
            Listen carefully…
          </Body>
        </View>
      )}

      {/* Reveal state: show phrase + replay + question */}
      {(cardState === "reveal" || cardState === "question" || cardState === "feedback") && (
        <>
          <Text style={styles.phrase}>{phrase.english}</Text>
          <Button title="Play again" icon="🔊" variant="neutral"
            onPress={() => speak(phrase.english)} style={{ marginTop: spacing.sm }} />
        </>
      )}

      {cardState === "reveal" && (
        <Button title="I remember — what does it mean?" onPress={() => setCardState("question")}
          style={{ marginTop: spacing.md }} />
      )}

      {(cardState === "question" || cardState === "feedback") && (
        <View style={{ marginTop: spacing.md }}>
          <Body style={{ color: colors.textSoft }}>What does this mean?</Body>
          {options.map((opt) => {
            let state: "idle"|"correct"|"wrong"|"dim" = "idle";
            if (picked) state = opt === phrase.meaning ? "correct" : opt === picked ? "wrong" : "dim";
            return (
              <ChoiceButton key={opt} label={opt} state={state}
                disabled={!!picked} onPress={() => choose(opt)} />
            );
          })}
        </View>
      )}

      {cardState === "feedback" && (
        <View style={{ marginTop: spacing.md }}>
          <Body style={{ color: isCorrect ? colors.correct : colors.wrong, fontWeight: "800" }}>
            {isCorrect ? "✓ You remembered!" : "Not quite — review it and try again tomorrow."}
          </Body>
          <Button title="Next →" onPress={() => onResult(isCorrect)} style={{ marginTop: spacing.sm }} />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  listeningBox: { alignItems: "center", paddingVertical: spacing.lg },
  wave: { fontSize: 60 },
  phrase: { fontSize: font.big, fontWeight: "800", color: colors.text, marginTop: spacing.md, lineHeight: font.big * 1.35 },
  score: { fontSize: font.title + 10, fontWeight: "900", color: colors.primary, marginTop: spacing.md },
});
