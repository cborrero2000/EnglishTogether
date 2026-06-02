import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Screen, Card, Body, Button, H2, Pill } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import {
  speak,
  stopSpeaking,
  isRecognitionAvailable,
  startRecognition,
  RecognitionHandle,
} from "../speech/speech";
import { conversations } from "../data/content";
import { shuffle } from "../util";
const SESSION_SIZE = 3;
import { colors, font, radius, spacing } from "../theme";

type Status = "idle" | "listening" | "good" | "retry";

function normalize(s: string): string {
  return s.toLowerCase().replace(/[.,!?;:"'’]/g, "").replace(/\s+/g, " ").trim();
}
function isAcceptable(accept: string[], said: string): boolean {
  const n = normalize(said);
  return accept.some((a) => n.includes(normalize(a)));
}

export function TalkBackScreen({ onBack }: { onBack: () => void }) {
  const [session] = useState(() => shuffle(conversations).slice(0, SESSION_SIZE));
  const [convoIdx, setConvoIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [heard, setHeard] = useState("");
  const [typed, setTyped] = useState("");
  const [finished, setFinished] = useState(false);
  const recRef = useRef<RecognitionHandle | null>(null);
  const supported = isRecognitionAvailable();

  const convo = session[convoIdx];
  const current = convo.steps[step];

  // Speak each prompt as we arrive at it.
  useEffect(() => {
    setStatus("idle");
    setHeard("");
    setTyped("");
    const t = setTimeout(() => speak(current.prompt, { voice: "b" }), 350);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
  }, [convoIdx, step]);

  useEffect(() => () => recRef.current?.stop(), []);

  function listen() {
    setHeard("");
    setStatus("listening");
    const handle = startRecognition({
      onResult: (transcript, isFinal) => {
        setHeard(transcript);
        if (isFinal) evaluate(transcript);
      },
      onError: () => setStatus("idle"),
      onEnd: () => setStatus((s) => (s === "listening" ? "idle" : s)),
    });
    if (!handle) {
      setStatus("idle");
      return;
    }
    recRef.current = handle;
  }

  function evaluate(said: string) {
    recRef.current?.stop();
    recRef.current = null;
    if (isAcceptable(current.accept, said)) {
      setStatus("good");
      speak("Great!", { voice: "b", onDone: () => setTimeout(advance, 300) });
    } else {
      setStatus("retry");
      // The behavior you asked for: politely ask them to try again.
      speak("Excuse me, what did you say?", { voice: "b" });
    }
  }

  function submitTyped() {
    if (!typed.trim()) return;
    setHeard(typed);
    evaluate(typed);
  }

  function advance() {
    if (step + 1 >= convo.steps.length) {
      setFinished(true);
      speak("Well done! You finished the conversation.", { voice: "b" });
    } else {
      setStep((s) => s + 1);
    }
  }

  function nextConversation() {
    stopSpeaking();
    if (convoIdx + 1 >= session.length) {
      onBack();
    } else {
      setConvoIdx((c) => c + 1);
      setStep(0);
      setFinished(false);
    }
  }

  function restart() {
    stopSpeaking();
    setStep(0);
    setFinished(false);
    setStatus("idle");
  }

  if (finished) {
    return (
      <Screen>
        <ActivityHeader title="Talk Back" onBack={onBack} />
        <Card style={{ marginTop: spacing.lg, alignItems: "center" }}>
          <Text style={{ fontSize: 56 }}>🎉</Text>
          <H2 style={{ marginTop: spacing.sm }}>You finished “{convo.title}”!</H2>
          <Body style={{ color: colors.textSoft, marginTop: spacing.xs, textAlign: "center" }}>
            You had a whole conversation in English. Wonderful!
          </Body>
          {convoIdx + 1 < session.length ? (
            <Button title="Next conversation" onPress={nextConversation} style={{ marginTop: spacing.lg, alignSelf: "stretch" }} />
          ) : (
            <Button title="Back to menu" onPress={onBack} style={{ marginTop: spacing.lg, alignSelf: "stretch" }} />
          )}
          <Button title="Repeat this one" variant="neutral" onPress={restart} style={{ marginTop: spacing.sm, alignSelf: "stretch" }} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <ActivityHeader title={`Talk Back — ${convo.title}`} onBack={onBack} step={step + 1} total={convo.steps.length} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.speaker}>The other person says:</Text>
          <Text style={styles.prompt}>{current.prompt}</Text>
          <Button title="Hear it again" icon="🔊" variant="neutral" onPress={() => speak(current.prompt, { voice: "b" })} style={{ marginTop: spacing.md }} />
        </Card>

        <Card style={{ marginTop: spacing.md, backgroundColor: colors.bg }}>
          <Text style={styles.hintLabel}>You could say:</Text>
          <Text style={styles.hint}>“{current.expect}”</Text>
        </Card>

        {supported ? (
          <Button
            title={status === "listening" ? "Listening… speak now" : "Tap and answer"}
            icon={status === "listening" ? "🔴" : "🎤"}
            variant={status === "listening" ? "accent" : "primary"}
            onPress={status === "listening" ? () => recRef.current?.stop() : listen}
            style={{ marginTop: spacing.lg }}
          />
        ) : (
          <View style={{ marginTop: spacing.lg }}>
            <Body style={{ color: colors.textSoft, marginBottom: spacing.xs }}>
              Speaking check works in a computer browser. On this device, type your reply to practice:
            </Body>
            <TextInput
              value={typed}
              onChangeText={setTyped}
              placeholder="Type your answer…"
              placeholderTextColor={colors.textSoft}
              style={styles.input}
              onSubmitEditing={submitTyped}
            />
            <Button title="Check my answer" onPress={submitTyped} style={{ marginTop: spacing.sm }} />
          </View>
        )}

        {heard !== "" && (
          <Body style={{ marginTop: spacing.md, fontStyle: "italic", color: colors.text }}>You said: “{heard}”</Body>
        )}

        {status === "good" && (
          <View style={{ marginTop: spacing.md }}>
            <Pill tone="good" text="✓ Perfect — moving on!" />
          </View>
        )}
        {status === "retry" && (
          <Card style={{ marginTop: spacing.md, backgroundColor: colors.wrongBg, borderColor: colors.wrong }}>
            <Text style={{ fontSize: font.body, fontWeight: "700", color: colors.wrong }}>
              “Excuse me, what did you say?”
            </Text>
            <Body style={{ color: colors.text, marginTop: spacing.xs }}>
              Try again. Listen to the example above, then answer.
            </Body>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  speaker: { fontSize: font.label, fontWeight: "800", color: colors.primary },
  prompt: { fontSize: font.big, fontWeight: "800", color: colors.text, marginTop: spacing.xs, lineHeight: font.big * 1.3 },
  hintLabel: { fontSize: font.label, fontWeight: "700", color: colors.textSoft },
  hint: { fontSize: font.body, color: colors.text, fontStyle: "italic", marginTop: 4 },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: font.body,
    color: colors.text,
    backgroundColor: colors.card,
  },
});
