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
import { md } from "../theme";

const SAMPLE = "Hello! This is how I sound. Nice to meet you.";

/** Convert a raw Android/iOS TTS voice identifier to a human-readable label. */
function humanizeName(v: VoiceInfo): { label: string; region: string } {
  const raw = v.name ?? v.id;

  // Android Google voices: "en-us-x-sfg-network" → "US English (online)"
  // iOS: "Samantha" → "Samantha"
  // Edge/Chrome web: "Microsoft Aria Online (Natural) - English (United States)" → "Aria (Natural)"

  // Web neural voices from Edge/Chrome
  const microsoftMatch = raw.match(/Microsoft\s+(\w+).*Natural.*-\s+(.+)$/i);
  if (microsoftMatch) return { label: `${microsoftMatch[1]} — Natural`, region: microsoftMatch[2] };

  const microsoftBasic = raw.match(/Microsoft\s+(\w+)\s+-\s+(.+)$/i);
  if (microsoftBasic) return { label: microsoftBasic[1], region: microsoftBasic[2] };

  // Google Android voices: "en-us-x-sfg-local" → break down
  const googleMatch = raw.match(/^([a-z]{2}-[a-z]{2,3})(?:-x-([a-z]+))?(-(local|network|language))?$/i);
  if (googleMatch) {
    const lang = googleMatch[1].toLowerCase();
    const suffix = googleMatch[4] ?? "";
    const qualifier = suffix === "network" ? " (online)" : suffix === "local" ? " (offline)" : "";
    return { label: friendlyLang(lang) + qualifier, region: friendlyLang(lang) };
  }

  // iOS / macOS named voices
  if (/^[A-Z][a-z]+$/.test(raw)) return { label: raw, region: friendlyLang(v.lang) };

  // Fallback: strip common prefixes
  const cleaned = raw
    .replace(/^en[-_]/, "")
    .replace(/[-_]/g, " ")
    .replace(/\bx\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return { label: titleCase(cleaned), region: friendlyLang(v.lang) };
}

function friendlyLang(lang: string): string {
  const map: Record<string, string> = {
    "en-us": "US English", "en-gb": "UK English", "en-au": "Australian English",
    "en-ca": "Canadian English", "en-in": "Indian English", "en-ie": "Irish English",
    "en-nz": "New Zealand English", "en-za": "South African English",
    "en-ng": "Nigerian English", "en-ph": "Philippine English",
  };
  const k = lang.toLowerCase().replace("_", "-");
  if (map[k]) return map[k];
  if (k.startsWith("en")) return "English";
  return lang;
}

function titleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Group voices by their region string. */
function groupVoices(voices: VoiceInfo[]): Map<string, VoiceInfo[]> {
  const groups = new Map<string, VoiceInfo[]>();
  for (const v of voices) {
    const { region } = humanizeName(v);
    const g = groups.get(region) ?? [];
    g.push(v);
    groups.set(region, g);
  }
  return groups;
}

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const voices = listVoices();
  const [selected, setSelected] = useState<string | null>(getPreferredVoiceId());
  const natural = hasNaturalVoice();
  const groups = groupVoices(voices);

  function pick(v: VoiceInfo | null) {
    const id = v?.id ?? null;
    setSelected(id);
    setPreferredVoiceId(id);
    speak(SAMPLE, { voiceId: id ?? undefined });
  }

  return (
    <Screen>
      <ActivityHeader title="Voice" onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingBottom: md.spacing.xxxl }}>
        <Body style={{ color: md.colors.onSurfaceVariant, marginTop: md.spacing.md }}>
          Choose the voice you like best. Tap one to hear a sample.
        </Body>

        {/* ── Sample button — pinned at the top ── */}
        <Button
          title="▶  Hear a sample"
          variant="neutral"
          onPress={() => speak(SAMPLE, { voiceId: selected ?? undefined })}
          accessibilityLabel="Play a voice sample of the selected voice"
          style={{ marginTop: md.spacing.md }}
        />

        {!natural && (
          <Card style={{ marginTop: md.spacing.md, backgroundColor: md.colors.primaryContainer,
            borderColor: md.colors.primary }}>
            <Text style={{ ...md.typescale.titleSmall, color: md.colors.onPrimaryContainer }}>
              💡 Want more natural voices?
            </Text>
            <Body style={{ color: md.colors.onPrimaryContainer, marginTop: md.spacing.xs }}>
              {Platform.OS === "web"
                ? "Open in Microsoft Edge for free lifelike voices (Aria, Guy, Jenny)."
                : "Install your device's enhanced English voice in Settings → Accessibility → Spoken Content."}
            </Body>
          </Card>
        )}

        {/* ── Automatic option ── */}
        <Text style={styles.groupLabel}>RECOMMENDED</Text>
        <VoiceRow
          label="Automatic"
          sublabel={natural ? "Best available — natural voice selected" : "Best available on this device"}
          natural={natural}
          selected={selected == null}
          onPress={() => pick(null)}
        />

        {/* ── Grouped voice list ── */}
        {[...groups.entries()].map(([region, regionVoices]) => (
          <View key={region}>
            <Text style={styles.groupLabel}>{region.toUpperCase()}</Text>
            {regionVoices.map((v) => {
              const { label } = humanizeName(v);
              return (
                <VoiceRow
                  key={v.id}
                  label={label}
                  sublabel={v.natural ? "Natural — sounds more human" : "Standard voice"}
                  natural={v.natural}
                  selected={selected === v.id}
                  onPress={() => pick(v)}
                />
              );
            })}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

function VoiceRow({
  label,
  sublabel,
  natural,
  selected,
  onPress,
}: {
  label: string;
  sublabel: string;
  natural: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={`${label}. ${sublabel}`}
      accessibilityState={{ selected }}
      android_ripple={md.ripple(md.colors.onSurface)}
      style={({ pressed }) => [
        styles.row,
        {
          borderColor: selected ? md.colors.primary : md.colors.outlineVariant,
          backgroundColor: selected ? md.colors.primaryContainer : md.elevation.level1,
        },
        pressed && Platform.OS !== "android" && { opacity: 0.88 },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.name, selected && { color: md.colors.onPrimaryContainer }]}>
          {label}
        </Text>
        <Text style={[styles.sub, selected && { color: md.colors.onPrimaryContainer }]}>
          {sublabel}
        </Text>
      </View>
      {natural && <Pill tone="good" text="Natural" />}
      {selected && (
        <Text style={styles.check} accessibilityLabel="Selected">
          ✓
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  groupLabel: {
    ...md.typescale.labelSmall,
    fontWeight: "800",
    color: md.colors.onSurfaceVariant,
    letterSpacing: 1.2,
    marginTop: md.spacing.lg,
    marginBottom: md.spacing.xs,
  },
  row: {
    minHeight: md.touchTarget.minHeight,
    borderRadius: md.shape.medium,
    borderWidth: 1.5,
    paddingHorizontal: md.spacing.md,
    paddingVertical: md.spacing.md,
    marginTop: md.spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  name: {
    ...md.typescale.titleSmall,
    color: md.colors.onSurface,
  },
  sub: {
    ...md.typescale.bodySmall,
    color: md.colors.onSurfaceVariant,
    marginTop: 2,
  },
  check: {
    fontSize: 20,
    color: md.colors.primary,
    fontWeight: "900",
    marginLeft: md.spacing.sm,
  },
});
