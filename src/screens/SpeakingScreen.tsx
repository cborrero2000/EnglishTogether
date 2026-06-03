import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, H2, Pill } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { DoneCard } from "../components/DoneCard";
import {
  speak,
  stopSpeaking,
  isRecognitionAvailable,
  startRecognition,
  RecognitionHandle,
  matchScore,
  missingWords,
} from "../speech/speech";
import { speaking } from "../data/content";
import { shuffle } from "../util";
const SESSION_SIZE = 10;
import { colors, font, spacing } from "../theme";

export function SpeakingScreen({ onBack }: { onBack: () => void }) {
  const [session] = useState(() => shuffle(speaking).slice(0, SESSION_SIZE));
  const [i, setI] = useState(0);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [score, setScore] = useState<number | null>(null); // 0..1 for current item
  const [passes, setPasses] = useState(0);
  const [done, setDone] = useState(false);
  const recRef = useRef<RecognitionHandle | null>(null);
  const supported = isRecognitionAvailable();

  const item = session[i];

  useEffect(() => () => stopRec(), []);

  function stopRec() {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
  }

  function startListening() {
    setHeard("");
    setScore(null);
    const handle = startRecognition({
      onResult: (transcript, isFinal) => {
        setHeard(transcript);
        if (isFinal) finish(transcript);
      },
      onError: () => setListening(false),
      onEnd: () => setListening(false),
    });
    if (!handle) return;
    recRef.current = handle;
    setListening(true);
  }

  function finish(transcript: string) {
    const s = matchScore(item.text, transcript);
    setScore(s);
    if (s >= 0.7) setPasses((p) => p + 1);
    stopRec();
  }

  function next() {
    if (i + 1 >= session.length) setDone(true);
    else {
      setI(i + 1);
      setHeard("");
      setScore(null);
    }
  }

  function restart() {
    stopSpeaking();
    setI(0);
    setHeard("");
    setScore(null);
    setPasses(0);
    setDone(false);
  }

  if (done) {
    return (
      <Screen>
        <ActivityHeader title="Say It" onBack={onBack} />
        <DoneCard score={passes} total={session.length} onRestart={restart} onBack={onBack} />
      </Screen>
    );
  }

  const passed = score != null && score >= 0.7;
  const close = score != null && score >= 0.4 && score < 0.7;
  const missed = score != null && !passed ? missingWords(item.text, heard) : [];

  return (
    <Screen>
      <ActivityHeader title="Say It" onBack={onBack} step={i + 1} total={session.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Card style={{ marginTop: spacing.md }}>
          <Body style={{ color: colors.textSoft }}>Read this out loud:</Body>
          <Text style={styles.target} accessibilityLabel={`Say: ${item.text}`}>{item.text}</Text>
          <Button
            title="Hear it"
            icon="🔊"
            variant="neutral"
            onPress={() => speak(item.text)}
            style={{ marginTop: spacing.md }}
          />
        </Card>

        {supported ? (
          <>
            <Button
              title={listening ? "Listening… tap to stop" : "🎤  Tap and speak"}
              variant={listening ? "accent" : "primary"}
              onPress={listening ? stopRec : startListening}
              accessibilityLabel={listening ? "Stop listening" : "Tap to record your voice"}
              style={{ marginTop: spacing.lg }}
            />
            {(heard !== "" || score != null) && (
              <Card style={{ marginTop: spacing.md }}>
                <Body style={{ color: colors.textSoft }}>I heard you say:</Body>
                <Text style={styles.heard}>“{heard || "…"}”</Text>
                {score != null && (
                  <View style={{ marginTop: spacing.sm }}>
                    <Pill
                      tone={passed ? "good" : close ? "neutral" : "bad"}
                      text={passed ? "✓ Great pronunciation!" : close ? "Almost! Try once more." : "Let's try again."}
                    />
                    {missed.length > 0 && (
                      <Body style={{ marginTop: spacing.sm }}>
                        Focus on these words:{" "}
                        <Text style={{ fontWeight: "800", color: colors.primary }}>{missed.join(", ")}</Text>
                      </Body>
                    )}
                  </View>
                )}
              </Card>
            )}
          </>
        ) : (
          <Card style={{ marginTop: spacing.lg }}>
            <Body style={{ fontWeight: "700" }}>🎤 Speaking check works in the web browser</Body>
            <Body style={{ color: colors.textSoft, marginTop: spacing.xs }}>
              On this device, open the app on a computer (Chrome or Edge) to have your speaking checked
              automatically. For now, tap “Hear it”, then repeat the sentence out loud and compare.
            </Body>
          </Card>
        )}

        <Button
          title={i + 1 >= session.length ? "Finish" : score != null && passed ? "Next →" : "Practice this later →"}
          variant={passed ? "primary" : "neutral"}
          accessibilityLabel={i + 1 >= session.length ? "Finish session" : passed ? "Next sentence" : "Skip and practice this later"}
          onPress={next}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  target: { fontSize: font.big, fontWeight: "800", color: colors.text, marginTop: spacing.sm, lineHeight: font.big * 1.35 },
  heard: { fontSize: font.body, fontStyle: "italic", color: colors.text, marginTop: 4 },
});
