import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen, Card, Body, H2 } from "../components/UI";
import { ActivityHeader } from "../components/ActivityHeader";
import { md } from "../theme";
import { useLanguage } from "../i18n/useLanguage";
import { initProgress, getProgress, overallAccuracy, streakDays, learnedCount, dueCount } from "../progress/store";
import { phrases } from "../data/phrases";

type TopicStat = { topic: string; learned: number; total: number };

export function ProgressScreen({ onBack }: { onBack: () => void }) {
  const { t } = useLanguage();
  const [ready, setReady] = useState(false);
  const [streak, setStreak] = useState(0);
  const [learned, setLearned] = useState(0);
  const [due, setDue] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [topics, setTopics] = useState<TopicStat[]>([]);

  useEffect(() => {
    initProgress().then(() => {
      const ids = phrases.map((p) => p.id);
      setStreak(streakDays());
      setLearned(learnedCount());
      setDue(dueCount(ids));
      setAccuracy(overallAccuracy());

      const byTopic = new Map<string, TopicStat>();
      for (const p of phrases) {
        const stat = byTopic.get(p.topic) ?? { topic: p.topic, learned: 0, total: 0 };
        stat.total++;
        if (getProgress(p.id)) stat.learned++;
        byTopic.set(p.topic, stat);
      }
      setTopics([...byTopic.values()]);
      setReady(true);
    });
  }, []);

  return (
    <Screen>
      <ActivityHeader title={t("progressTitle")} onBack={onBack} />
      <ScrollView contentContainerStyle={{ paddingBottom: md.spacing.xxxl }}>
        {!ready ? null : learned === 0 ? (
          <Card style={{ marginTop: md.spacing.lg }}>
            <Body>{t("progressEmpty")}</Body>
          </Card>
        ) : (
          <>
            {/* ── Streak ─────────────────────────────────── */}
            <Card style={styles.streakCard}>
              <Text style={styles.streakNum}>{streak > 0 ? `🔥 ${streak}` : "—"}</Text>
              <Body style={{ color: md.colors.onSurfaceVariant, marginTop: 2 }}>
                {streak > 0 ? t("progressStreak") : t("progressNoStreak")}
              </Body>
            </Card>

            {/* ── Headline stats ─────────────────────────── */}
            <View style={styles.statsRow}>
              <StatTile value={String(learned)} label={t("progressLearned")} />
              <StatTile
                value={accuracy != null ? `${Math.round(accuracy * 100)}%` : "—"}
                label={t("progressAccuracy")}
              />
              <StatTile value={String(due)} label={t("progressDue")} accent={due > 0} />
            </View>

            {/* ── By topic ───────────────────────────────── */}
            <Text style={styles.sectionLabel}>{t("progressByTopic")}</Text>
            {topics.map((stat) => (
              <View key={stat.topic} style={styles.topicRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.topicName}>{stat.topic}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${Math.round((stat.learned / stat.total) * 100)}%` },
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.topicCount}>
                  {stat.learned}/{stat.total}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function StatTile({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <View style={styles.statTile}>
      <Text style={[styles.statValue, accent && { color: md.colors.tertiary }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  streakCard: { alignItems: "center", marginTop: md.spacing.lg },
  streakNum: {
    ...md.typescale.headlineLarge,
    fontWeight: "800",
    color: md.colors.tertiary,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: md.spacing.md,
    gap: md.spacing.sm,
  },
  statTile: {
    flex: 1,
    backgroundColor: md.elevation.level1,
    borderRadius: md.shape.large,
    borderWidth: 1,
    borderColor: md.colors.outlineVariant,
    paddingVertical: md.spacing.lg,
    alignItems: "center",
  },
  statValue: {
    ...md.typescale.headlineSmall,
    fontWeight: "800",
    color: md.colors.primary,
  },
  statLabel: {
    ...md.typescale.labelSmall,
    color: md.colors.onSurfaceVariant,
    marginTop: 4,
    textAlign: "center",
  },
  sectionLabel: {
    ...md.typescale.labelMedium,
    fontWeight: "800",
    color: md.colors.onSurfaceVariant,
    letterSpacing: 1.4,
    marginTop: md.spacing.xl,
    marginBottom: md.spacing.sm,
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: md.spacing.md,
  },
  topicName: {
    ...md.typescale.titleSmall,
    color: md.colors.onSurface,
    marginBottom: 4,
  },
  barTrack: {
    height: 8,
    backgroundColor: md.colors.surfaceVariant,
    borderRadius: md.shape.full,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: md.colors.primary,
    borderRadius: md.shape.full,
  },
  topicCount: {
    ...md.typescale.labelLarge,
    color: md.colors.onSurfaceVariant,
    marginLeft: md.spacing.md,
    minWidth: 48,
    textAlign: "right",
  },
});
