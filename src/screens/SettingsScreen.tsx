import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, Button, H2, Pill } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import {
  listVoices,
  getPreferredVoiceId,
  setPreferredVoiceId,
  speak,
  hasNaturalVoice,
  VoiceInfo,
} from "../speech/speech";
import { colors, font, radius, spacing } from "../theme";

const SAMPLE = "Hello! This is how I sound. Nice to meet you.";

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const voices = listVoices();
  const [selected, setSelected] = useState<string | null>(getPreferredVoiceId());
  const natural = hasNaturalVoice();

  function pick(v: VoiceInfo | null) {
    const id = v?.id ?? null;
    setSelected(id);
    setPreferredVoiceId(id);
    speak(SAMPLE, { voiceId: id ?? undefined });
  }

  return (
    <Screen>
      <ActivityHeader title="Voice" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <Body style={{ color: colors.textSoft, marginTop: spacing.md }}>
          Choose the voice you like best. Tap one to hear a sample.
        </Body>

        {!natural && (
          <Card style={{ marginTop: spacing.md, backgroundColor: colors.correctBg, borderColor: colors.correct }}>
            <Text style={{ fontSize: font.body, fontWeight: "700", color: colors.text }}>
              💡 Want more natural voices?
            </Text>
            <Body style={{ color: colors.text, marginTop: spacing.xs }}>
              {Platform.OS === "web"
                ? "This browser only has basic voices. Open the app in Microsoft Edge for free, lifelike “Natural” voices (Aria, Guy, and more)."
                : "Install your device's enhanced English voice in Settings → Accessibility → Spoken Content for a more natural sound."}
            </Body>
          </Card>
        )}

        {/* Automatic = let the app pick the best available voice */}
        <VoiceRow
          name="Automatic (best available)"
          sub="Let the app choose for you"
          natural={natural}
          selected={selected == null}
          onPress={() => pick(null)}
        />

        {voices.map((v) => (
          <VoiceRow
            key={v.id}
            name={v.name}
            sub={v.lang}
            natural={v.natural}
            selected={selected === v.id}
            onPress={() => pick(v)}
          />
        ))}

        <Button title="Hear a sample" icon="🔊" variant="neutral" onPress={() => speak(SAMPLE, { voiceId: selected ?? undefined })} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </Screen>
  );
}

function VoiceRow({
  name,
  sub,
  natural,
  selected,
  onPress,
}: {
  name: string;
  sub: string;
  natural: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.correctBg : colors.card },
        pressed && { opacity: 0.9 },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      {natural && <Pill tone="good" text="Natural" />}
      {selected && <Text style={styles.check}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    borderRadius: radius.md,
    borderWidth: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },
  name: { fontSize: font.body, fontWeight: "700", color: colors.text },
  sub: { fontSize: font.label, color: colors.textSoft, marginTop: 2 },
  check: { fontSize: font.heading, color: colors.primary, fontWeight: "900", marginLeft: spacing.sm },
});
