import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2 } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { speak, stopSpeaking } from "../speech/speech";
import { dialogs } from "../data/content";
import { colors, font, radius, spacing } from "../theme";

export function DialogScreen({ onBack }: { onBack: () => void }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState(-1);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const item = dialogs[i];

  useEffect(() => {
    const t = setTimeout(playDialog, 400);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
  }, [i]);

  function playDialog() {
    stopSpeaking();
    setPlaying(true);
    // Give the two speakers different voices so it sounds like two people.
    const speakers = Array.from(new Set(item.lines.map((l) => l.speaker)));
    const voiceFor = (speaker: string): "a" | "b" => (speakers.indexOf(speaker) % 2 === 0 ? "a" : "b");
    let idx = 0;
    const playNext = () => {
      if (idx >= item.lines.length) {
        setPlaying(false);
        setActiveLine(-1);
        return;
      }
      setActiveLine(idx);
      const line = item.lines[idx];
      idx++;
      // A small pause between speakers feels more natural.
      speak(line.text, { voice: voiceFor(line.speaker), onDone: () => setTimeout(playNext, 450) });
    };
    playNext();
  }

  function choose(idx: number) {
    if (picked != null) return;
    setPicked(idx);
    if (idx === item.answer) setScore((s) => s + 1);
  }

  function next() {
    if (i + 1 >= dialogs.length) setDone(true);
    else {
      setI(i + 1);
      setPicked(null);
      setActiveLine(-1);
    }
  }

  function restart() {
    stopSpeaking();
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="Dialog & Question" onBack={onBack} />
        <DoneCard score={score} total={dialogs.length} onRestart={restart} onBack={onBack} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ActivityHeader title="Dialog & Question" onBack={onBack} step={i + 1} total={dialogs.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <H2 style={{ marginTop: spacing.md }}>{item.title}</H2>

        <Card style={{ marginTop: spacing.sm }}>
          {item.lines.map((ln, idx) => (
            <View
              key={idx}
              style={[styles.bubble, activeLine === idx && styles.bubbleActive]}
            >
              <Text style={styles.speaker}>{ln.speaker}</Text>
              <Text style={styles.line}>{ln.text}</Text>
            </View>
          ))}
          <Button
            title={playing ? "Playing…" : "Play the conversation"}
            icon="🔊"
            variant="neutral"
            disabled={playing}
            onPress={playDialog}
            style={{ marginTop: spacing.md }}
          />
        </Card>

        <H2 style={{ marginTop: spacing.lg, marginBottom: spacing.xs }}>{item.question}</H2>
        {item.options.map((opt, idx) => {
          let state: "idle" | "correct" | "wrong" | "dim" = "idle";
          if (picked != null) {
            if (idx === item.answer) state = "correct";
            else if (idx === picked) state = "wrong";
            else state = "dim";
          }
          return <ChoiceButton key={idx} label={opt} state={state} disabled={picked != null} onPress={() => choose(idx)} />;
        })}

        {picked != null && (
          <View style={{ marginTop: spacing.md }}>
            <Body style={{ color: picked === item.answer ? colors.correct : colors.wrong, fontWeight: "700" }}>
              {picked === item.answer ? "✓ That's right!" : "Not quite — see the highlighted answer."}
            </Body>
            <Button title={i + 1 >= dialogs.length ? "See results" : "Next"} onPress={next} style={{ marginTop: spacing.md }} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  bubbleActive: { borderColor: colors.primary, backgroundColor: colors.correctBg },
  speaker: { fontSize: font.label, fontWeight: "800", color: colors.primary, marginBottom: 2 },
  line: { fontSize: font.body, color: colors.text, lineHeight: font.body * 1.35 },
});
