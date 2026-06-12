import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, H1, Body } from "../components/UI";
import { md, isLargeScreen } from "../theme";
import { ScreenName } from "../navigation";
import { initProgress, learnedCount, dueCount } from "../progress/store";
import { phrases } from "../data/phrases";
import { useLanguage } from "../i18n/useLanguage";
import { StringKey } from "../i18n/strings";

type TileConfig = {
  key: ScreenName;
  icon: string;
  titleKey: StringKey;
  descKey: StringKey;
  accentColor?: string;
};

const SECTION_LEARN: TileConfig[] = [
  { key: "learn",    icon: "🌱", titleKey: "tileLearnTitle",    descKey: "tileLearnDesc",    accentColor: md.colors.primary },
  { key: "recall",   icon: "🧠", titleKey: "tileRecallTitle",   descKey: "tileRecallDesc",   accentColor: "#6B48C8" },
  { key: "review",   icon: "☀️", titleKey: "tileReviewTitle",   descKey: "tileReviewDesc",   accentColor: md.colors.tertiary },
  { key: "progress", icon: "📈", titleKey: "tileProgressTitle", descKey: "tileProgressDesc", accentColor: "#3F6FB0" },
];

const SECTION_PRACTICE: TileConfig[] = [
  { key: "listening", icon: "👂", titleKey: "tileListeningTitle", descKey: "tileListeningDesc" },
  { key: "speaking",  icon: "🎤", titleKey: "tileSpeakingTitle",  descKey: "tileSpeakingDesc" },
  { key: "dialog",    icon: "💬", titleKey: "tileDialogTitle",    descKey: "tileDialogDesc" },
  { key: "talkback",  icon: "🔁", titleKey: "tileTalkbackTitle",  descKey: "tileTalkbackDesc" },
  { key: "scenes",    icon: "🎬", titleKey: "tileScenesTitle",    descKey: "tileScenesDesc" },
];

export function HomeScreen({ go }: { go: (s: ScreenName) => void }) {
  const [learned, setLearned] = useState(0);
  const [due, setDue] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    initProgress().then(() => {
      const ids = phrases.map((p) => p.id);
      setLearned(learnedCount());
      setDue(dueCount(ids));
    });
  }, []);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: md.spacing.xxxl }}
      >
        {/* ── Header ────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <H1 style={styles.appTitle}>{t("appTitle")}</H1>
            <Pressable
              onPress={() => go("settings")}
              accessibilityRole="button"
              accessibilityLabel={t("voiceButton")}
              android_ripple={md.ripple(md.colors.onSurface)}
              style={({ pressed }) => [
                styles.voiceBtn,
                pressed && Platform.OS !== "android" && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.voiceBtnText}>{t("voiceButton")}</Text>
            </Pressable>
          </View>
          <Body style={styles.subtitle}>{t("appSubtitle")}</Body>
        </View>

        {/* ── Progress stats ────────────────────────────── */}
        {learned > 0 && (
          <View style={styles.statsRow} accessibilityRole="summary"
            accessibilityLabel={`${learned} ${t("statLearned")}, ${due} ${t("statDueToday")}`}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{learned}</Text>
              <Text style={styles.statLabel}>{t("statLearned")}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statNum, due > 0 && styles.statNumDue]}>{due}</Text>
              <Text style={styles.statLabel}>{t("statDueToday")}</Text>
            </View>
            {due > 0 && (
              <Pressable
                onPress={() => go("review")}
                accessibilityRole="button"
                accessibilityLabel={`${due} ${t("statDueToday")}. ${t("reviewNow")}`}
                android_ripple={md.ripple(md.colors.onTertiary)}
                style={({ pressed }) => [
                  styles.reviewBtn,
                  pressed && Platform.OS !== "android" && { opacity: 0.8 },
                ]}
              >
                <Text style={styles.reviewBtnText}>{t("reviewNow")}</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* ── Study section ────────────────────────────── */}
        <Text style={styles.sectionLabel}>{t("sectionStudy")}</Text>
        <View style={[styles.grid, isLargeScreen() && styles.gridWide]}>
          {SECTION_LEARN.map((tile) => (
            <Tile key={tile.key} config={tile} t={t} onPress={() => go(tile.key)} />
          ))}
        </View>

        {/* ── Practice section ─────────────────────────── */}
        <Text style={styles.sectionLabel}>{t("sectionPractice")}</Text>
        <View style={[styles.grid, isLargeScreen() && styles.gridWide]}>
          {SECTION_PRACTICE.map((tile) => (
            <Tile key={tile.key} config={tile} t={t} onPress={() => go(tile.key)} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

function Tile({
  config,
  t,
  onPress,
}: {
  config: TileConfig;
  t: (key: StringKey) => string;
  onPress: () => void;
}) {
  const title = t(config.titleKey);
  const desc = t(config.descKey);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${desc}`}
      android_ripple={md.ripple(md.colors.onSurface)}
      style={({ pressed }) => [
        styles.tile,
        isLargeScreen() && styles.tileWide,
        pressed && Platform.OS !== "android" && { opacity: 0.88 },
      ]}
    >
      {/* Accent bar — clipped inside the tile via overflow:hidden */}
      {config.accentColor && (
        <View style={[styles.accentBar, { backgroundColor: config.accentColor }]} />
      )}
      <Text style={styles.tileIcon}>{config.icon}</Text>
      <View style={styles.tileMeta}>
        <Text style={styles.tileTitle}>{title}</Text>
        <Text style={styles.tileDesc}>{desc}</Text>
      </View>
      <Text style={styles.chevron} aria-hidden>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: md.spacing.lg, paddingBottom: md.spacing.md },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appTitle: { flex: 1 },
  subtitle: {
    color: md.colors.onSurfaceVariant,
    marginTop: md.spacing.xs,
  },
  voiceBtn: {
    backgroundColor: md.colors.surfaceVariant,
    paddingVertical: md.spacing.sm,
    paddingHorizontal: md.spacing.md,
    borderRadius: md.shape.full,
    minHeight: md.touchTarget.minHeight,
    justifyContent: "center",
    overflow: "hidden",
  },
  voiceBtnText: {
    ...md.typescale.labelLarge,
    fontWeight: "700",
    color: md.colors.onSurface,
  },

  /* Stats row */
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: md.elevation.level1,
    borderRadius: md.shape.large,
    borderWidth: 1,
    borderColor: md.colors.outlineVariant,
    padding: md.spacing.md,
    marginBottom: md.spacing.md,
  },
  stat: { alignItems: "center", minWidth: 64 },
  statNum: {
    ...md.typescale.headlineSmall,
    color: md.colors.primary,
    fontWeight: "800",
  },
  statNumDue: { color: md.colors.tertiary },
  statLabel: {
    ...md.typescale.labelSmall,
    color: md.colors.onSurfaceVariant,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: md.colors.outlineVariant,
    marginHorizontal: md.spacing.md,
  },
  reviewBtn: {
    marginLeft: "auto",
    backgroundColor: md.colors.tertiary,
    paddingVertical: md.spacing.sm,
    paddingHorizontal: md.spacing.md,
    borderRadius: md.shape.full,
    minHeight: md.touchTarget.minHeight,
    justifyContent: "center",
    overflow: "hidden",
  },
  reviewBtnText: {
    ...md.typescale.labelLarge,
    color: md.colors.onTertiary,
    fontWeight: "800",
  },

  /* Section label */
  sectionLabel: {
    ...md.typescale.labelMedium,
    fontWeight: "800",
    color: md.colors.onSurfaceVariant,
    letterSpacing: 1.4,
    marginTop: md.spacing.md,
    marginBottom: md.spacing.sm,
  },

  /* Grid */
  grid: {},
  gridWide: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },

  /* Tile */
  tile: {
    backgroundColor: md.elevation.level1,
    borderRadius: md.shape.large,
    borderWidth: 1,
    borderColor: md.colors.outlineVariant,
    padding: md.spacing.lg,
    paddingLeft: md.spacing.xl, // extra left padding to give accent bar room
    flexDirection: "row",
    alignItems: "center",
    marginBottom: md.spacing.md,
    overflow: "hidden", // clips accent bar + ripple
    minHeight: md.touchTarget.minHeight,
  },
  tileWide: { width: "48.5%" },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  tileIcon: { fontSize: 36, marginRight: md.spacing.md },
  tileMeta: { flex: 1 },
  tileTitle: {
    ...md.typescale.titleLarge,
    color: md.colors.onSurface,
  },
  tileDesc: {
    ...md.typescale.bodySmall,
    color: md.colors.onSurfaceVariant,
    marginTop: 2,
  },
  chevron: {
    fontSize: 28,
    color: md.colors.onSurfaceVariant,
    marginLeft: md.spacing.sm,
  },
});
