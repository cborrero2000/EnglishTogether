import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2 } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { speak, stopSpeaking } from "../speech/speech";
import { listening } from "../data/content";

const SESSION_SIZE = 8;
import { colors, spacing, md } from "../theme";
import { shuffle } from "../util";
import { filterByLevel } from "../data/level";
import { getLevelFilter } from "../progress/preferences";

export function ListeningScreen({ onBack }: { onBack: () => void }) {
  const [session] = useState(() => {
    const pool = filterByLevel(listening, (item) => [item.say], getLevelFilter());
    return shuffle(pool).slice(0, SESSION_SIZE);
  });
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const item = session[i];
  // Shuffle the options once per question.
  const options = useMemo(() => shuffle(item.options), [i]);
  const answerIndex = options.indexOf(item.say);

  useEffect(() => {
    const t = setTimeout(() => speak(item.say), 350);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
  }, [i]);

  function choose(idx: number) {
    if (picked != null) return;
    setPicked(idx);
    if (idx === answerIndex) setScore((s) => s + 1);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }

  function next() {
    if (i + 1 >= session.length) setDone(true);
    else {
      setI(i + 1);
      setPicked(null);
    }
  }

  function restart() {
    stopSpeaking();
    // session is re-created when the component unmounts/remounts; just reset index
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="Listen & Choose" onBack={onBack} />
        <DoneCard score={score} total={session.length} onRestart={restart} onBack={onBack} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ActivityHeader title="Listen & Choose" onBack={onBack} step={i + 1} total={session.length} />
      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Card style={{ marginTop: spacing.md, alignItems: "center", padding: md.spacing.md }}>
          <Body style={{ color: md.colors.primary, fontWeight: "700", textAlign: "center" }}>
            Listen carefully, then choose the sentence you heard.
          </Body>
          <Button
            title="Play again"
            icon="🔊"
            onPress={() => speak(item.say)}
            style={{ marginTop: spacing.md, alignSelf: "stretch", minHeight: 76 }}
            iconStyle={{ fontSize: md.typescale.displaySmall.fontSize, marginRight: md.spacing.md }}
            textStyle={{ fontSize: md.typescale.titleLarge.fontSize }}
          />
          <Button
            title="Slower"
            icon="🐢"
            variant="neutral"
            onPress={() => speak(item.say, { rate: 0.6 })}
            style={{ marginTop: spacing.sm, alignSelf: "stretch", minHeight: 76 }}
            iconStyle={{ fontSize: md.typescale.displaySmall.fontSize, marginRight: md.spacing.md }}
            textStyle={{ fontSize: md.typescale.titleLarge.fontSize }}
          />
        </Card>

        <H2 style={{ marginTop: spacing.sm, marginBottom: spacing.xs }}>Which did you hear?</H2>
        {options.map((opt, idx) => {
          let state: "idle" | "correct" | "wrong" | "dim" = "idle";
          if (picked != null) {
            if (idx === answerIndex) state = "correct";
            else if (idx === picked) state = "wrong";
            else state = "dim";
          }
          return (
            <ChoiceButton
              key={idx}
              label={opt}
              state={state}
              disabled={picked != null}
              onPress={() => choose(idx)}
              labelStyle={{ fontSize: md.typescale.titleLarge.fontSize, lineHeight: md.typescale.titleLarge.lineHeight }}
            />
          );
        })}
      </ScrollView>

      {picked != null && (
        <View style={styles.footer}>
          <Body style={{ color: picked === answerIndex ? colors.correct : colors.wrong, fontWeight: "700" }}>
            {picked === answerIndex ? "✓ Correct!" : "Not quite — the highlighted one is right."}
          </Body>
          <Button
            title={i + 1 >= session.length ? "See results" : "Next"}
            onPress={next}
            style={{ marginTop: spacing.md }}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    borderTopColor: md.colors.outlineVariant,
    paddingTop: md.spacing.md,
    paddingBottom: md.spacing.lg,
    backgroundColor: md.colors.background,
  },
});
