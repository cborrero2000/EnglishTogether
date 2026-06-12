import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, ChoiceButton, H2 } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import { speak, stopSpeaking } from "../speech/speech";
import { scenes } from "../data/content";
import { shuffle } from "../util";
const SESSION_SIZE = 5;
import { colors, font, radius, spacing } from "../theme";
import { filterByLevel } from "../data/level";
import { getLevelFilter } from "../progress/preferences";
import { SceneVideo } from "../components/SceneVideo";

const AVATARS = ["🧑", "👩", "👨", "🧓", "👱‍♀️", "👨‍🦰"];

export function SceneScreen({ onBack }: { onBack: () => void }) {
  const [session] = useState(() => {
    const pool = filterByLevel(
      scenes,
      (item) => [item.situation, ...item.lines.map((l) => l.text), item.question],
      getLevelFilter()
    );
    return shuffle(pool).slice(0, SESSION_SIZE);
  });
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeLine, setActiveLine] = useState(-1);
  const [played, setPlayed] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  const item = session[i];

  useEffect(() => {
    const t = setTimeout(playScene, 400);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
  }, [i]);

  // Gentle "speaking" pulse on the avatar while a line plays.
  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    if (playing) {
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.12, duration: 280, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 280, useNativeDriver: true }),
        ])
      );
      loop.start();
    } else {
      pulse.setValue(1);
    }
    return () => loop?.stop();
  }, [playing]);

  function playScene() {
    stopSpeaking();
    setPlaying(true);
    let idx = 0;
    const playNext = () => {
      if (idx >= item.lines.length) {
        setPlaying(false);
        setActiveLine(-1);
        setPlayed(true);
        return;
      }
      setActiveLine(idx);
      const line = item.lines[idx];
      idx++;
      // The character is someone other than the learner — use the "other" voice.
      speak(line.text, { voice: "b", onDone: () => setTimeout(playNext, 400) });
    };
    playNext();
  }

  function choose(idx: number) {
    if (picked != null) return;
    setPicked(idx);
    if (idx === item.answer) setScore((s) => s + 1);
  }

  function next() {
    if (i + 1 >= session.length) setDone(true);
    else {
      setI(i + 1);
      setPicked(null);
      setPlayed(false);
      setActiveLine(-1);
    }
  }

  function restart() {
    stopSpeaking();
    setI(0);
    setPicked(null);
    setPlayed(false);
    setScore(0);
    setDone(false);
  }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="Watch & Decide" onBack={onBack} />
        <DoneCard score={score} total={session.length} onRestart={restart} onBack={onBack} />
      </Screen>
    );
  }

  const subtitle = activeLine >= 0 ? item.lines[activeLine] : null;

  return (
    <Screen>
      <ActivityHeader title="Watch & Decide" onBack={onBack} step={i + 1} total={session.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <H2 style={{ marginTop: spacing.md }}>{item.title}</H2>
        <Body style={{ color: colors.textSoft, marginTop: spacing.xs }}>{item.situation}</Body>

        {/* The "scene": a real video clip if provided, else a speaking character — with live subtitles */}
        <View style={styles.stage}>
          {item.video ? (
            <SceneVideo uri={item.video} playing={playing} />
          ) : (
            <Animated.Text style={[styles.avatar, { transform: [{ scale: pulse }] }]}>
              {AVATARS[i % AVATARS.length]}
            </Animated.Text>
          )}
          <View style={styles.subtitleBox}>
            {subtitle ? (
              <>
                <Text style={styles.subSpeaker}>{subtitle.speaker}</Text>
                <Text style={styles.subText}>{subtitle.text}</Text>
              </>
            ) : (
              <Text style={styles.subHint}>{played ? "Now answer the question below." : "▶ Press play to watch the scene."}</Text>
            )}
          </View>
        </View>

        <Button
          title={playing ? "Playing…" : played ? "Watch again" : "Play scene"}
          icon="🎬"
          variant="neutral"
          disabled={playing}
          onPress={playScene}
        />

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
              {picked === item.answer ? "✓ Great choice!" : "Not the best reply — see the highlighted one."}
            </Body>
            <Button title={i + 1 >= session.length ? "See results" : "Next"} onPress={next} style={{ marginTop: spacing.md }} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: "#1E2A2A",
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.md,
    marginBottom: spacing.md,
    minHeight: 220,
    justifyContent: "center",
  },
  avatar: { fontSize: 88 },
  subtitleBox: {
    marginTop: spacing.md,
    minHeight: 70,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: radius.md,
    padding: spacing.md,
    justifyContent: "center",
  },
  subSpeaker: { color: colors.accent, fontWeight: "800", fontSize: font.label },
  subText: { color: colors.white, fontSize: font.body, marginTop: 2, lineHeight: font.body * 1.3 },
  subHint: { color: "#B8C2C2", fontSize: font.body, textAlign: "center" },
});
