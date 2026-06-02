import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, H1, Body } from "../components/UI";
import { colors, font, radius, spacing, isLargeScreen } from "../theme";
import { ScreenName } from "../navigation";
import { initProgress, learnedCount, dueCount } from "../progress/store";
import { phrases } from "../data/phrases";

type TileConfig = {
  key: ScreenName;
  icon: string;
  title: string;
  desc: string;
  accent?: string;
  badge?: () => string | null;
};

const SECTION_LEARN: TileConfig[] = [
  {
    key: "learn",
    icon: "🌱",
    title: "Learn",
    desc: "Listen → Speak → Read → Build. The full sensory lesson.",
    accent: "#0E7C66",
  },
  {
    key: "recall",
    icon: "🧠",
    title: "Recall",
    desc: "Test your memory. Reconstruct phrases from their meaning.",
    accent: "#6B48C8",
  },
  {
    key: "review",
    icon: "☀️",
    title: "Daily Review",
    desc: "Keep phrases fresh. A short review of what you have learned.",
    accent: "#E8A13A",
  },
];

const SECTION_PRACTICE: TileConfig[] = [
  { key: "listening", icon: "👂", title: "Listen & Choose", desc: "Hear a sentence, pick the one you heard." },
  { key: "speaking",  icon: "🎤", title: "Say It",          desc: "Read it out loud and check your speaking." },
  { key: "dialog",    icon: "💬", title: "Dialog & Question", desc: "Hear a short talk, then answer a question." },
  { key: "talkback",  icon: "🔁", title: "Talk Back",       desc: "Have a real conversation. Answer out loud." },
  { key: "scenes",    icon: "🎬", title: "Watch & Decide",  desc: "Watch a scene, choose the best reply." },
];

export function HomeScreen({ go }: { go: (s: ScreenName) => void }) {
  const [learned, setLearned] = useState(0);
  const [due, setDue] = useState(0);

  useEffect(() => {
    initProgress().then(() => {
      const ids = phrases.map(p => p.id);
      setLearned(learnedCount());
      setDue(dueCount(ids));
    });
  }, []);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <H1>English Together</H1>
            <Pressable onPress={() => go("settings")}
              style={({ pressed }) => [styles.voiceBtn, pressed && { opacity: 0.8 }]}>
              <Text style={styles.voiceBtnText}>🔊 Voice</Text>
            </Pressable>
          </View>
          <Body style={{ color: colors.textSoft, marginTop: spacing.xs }}>
            Practice listening and speaking, one step at a time.
          </Body>
        </View>

        {/* Progress stats */}
        {learned > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{learned}</Text>
              <Text style={styles.statLabel}>learned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statNum, due > 0 && { color: colors.accent }]}>{due}</Text>
              <Text style={styles.statLabel}>due today</Text>
            </View>
            {due > 0 && (
              <Pressable onPress={() => go("review")}
                style={({ pressed }) => [styles.reviewBtn, pressed && { opacity: 0.8 }]}>
                <Text style={styles.reviewBtnText}>Review now ›</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Learn / Recall / Review */}
        <Text style={styles.sectionLabel}>STUDY</Text>
        <View style={[styles.grid, isLargeScreen() && styles.gridWide]}>
          {SECTION_LEARN.map((t) => (
            <Tile key={t.key} config={t} onPress={() => go(t.key)} />
          ))}
        </View>

        {/* Practice modes */}
        <Text style={styles.sectionLabel}>PRACTICE</Text>
        <View style={[styles.grid, isLargeScreen() && styles.gridWide]}>
          {SECTION_PRACTICE.map((t) => (
            <Tile key={t.key} config={t} onPress={() => go(t.key)} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

function Tile({ config: t, onPress }: { config: TileConfig; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        isLargeScreen() && styles.tileWide,
        pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] },
      ]}>
      {t.accent && <View style={[styles.accentBar, { backgroundColor: t.accent }]} />}
      <Text style={styles.icon}>{t.icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.tileTitle}>{t.title}</Text>
        <Text style={styles.tileDesc}>{t.desc}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: spacing.lg },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  voiceBtn: { backgroundColor: colors.neutralBtn, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill },
  voiceBtnText: { fontSize: font.label, fontWeight: "700", color: colors.text },
  statsRow: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md },
  stat: { alignItems: "center", minWidth: 60 },
  statNum: { fontSize: font.heading, fontWeight: "900", color: colors.primary },
  statLabel: { fontSize: font.label, color: colors.textSoft, marginTop: 1 },
  statDivider: { width: 1, height: 36, backgroundColor: colors.border, marginHorizontal: spacing.md },
  reviewBtn: { marginLeft: "auto", backgroundColor: colors.accent, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill },
  reviewBtnText: { color: colors.white, fontWeight: "800", fontSize: font.label },
  sectionLabel: { fontSize: font.label, fontWeight: "800", color: colors.textSoft, letterSpacing: 1.2, marginTop: spacing.md, marginBottom: spacing.xs },
  grid: {},
  gridWide: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  tile: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, flexDirection: "row", alignItems: "center", marginBottom: spacing.md, overflow: "hidden" },
  tileWide: { width: "48.5%" },
  accentBar: { position: "absolute", left: 0, top: 0, bottom: 0, width: 5 },
  icon: { fontSize: 36, marginRight: spacing.md, marginLeft: spacing.sm },
  tileTitle: { fontSize: font.heading, fontWeight: "800", color: colors.text },
  tileDesc: { fontSize: font.label, color: colors.textSoft, marginTop: 2 },
  chevron: { fontSize: 30, color: colors.textSoft, marginLeft: spacing.sm },
});
