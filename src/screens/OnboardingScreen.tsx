import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen, H1, Body, Button } from "../components/UI";
import { md } from "../theme";
import { useLanguage } from "../i18n/useLanguage";
import { StringKey } from "../i18n/strings";

type Slide = { icon: string; titleKey: StringKey; bodyKey: StringKey };

const SLIDES: Slide[] = [
  { icon: "👋", titleKey: "onboardingTitle1", bodyKey: "onboardingBody1" },
  { icon: "🗂️", titleKey: "onboardingTitle2", bodyKey: "onboardingBody2" },
  { icon: "🔊", titleKey: "onboardingTitle3", bodyKey: "onboardingBody3" },
  { icon: "📈", titleKey: "onboardingTitle4", bodyKey: "onboardingBody4" },
];

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const { t } = useLanguage();
  const [i, setI] = useState(0);
  const slide = SLIDES[i];
  const isLast = i === SLIDES.length - 1;

  return (
    <Screen>
      <View style={styles.body}>
        <Text style={styles.icon}>{slide.icon}</Text>
        <H1 style={styles.title}>{t(slide.titleKey)}</H1>
        <Body style={styles.text}>{t(slide.bodyKey)}</Body>

        <View style={styles.dots}>
          {SLIDES.map((_, idx) => (
            <View key={idx} style={[styles.dot, idx === i && styles.dotActive]} />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        {!isLast && (
          <Button title={t("onboardingSkip")} variant="ghost" onPress={onDone} style={styles.skipBtn} />
        )}
        <Button
          title={isLast ? t("onboardingGetStarted") : t("onboardingNext")}
          onPress={() => (isLast ? onDone() : setI((n) => n + 1))}
          style={styles.nextBtn}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 72, marginBottom: md.spacing.lg },
  title: { textAlign: "center" },
  text: {
    textAlign: "center",
    marginTop: md.spacing.md,
    color: md.colors.onSurfaceVariant,
  },
  dots: {
    flexDirection: "row",
    marginTop: md.spacing.xxl,
    gap: md.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: md.shape.full,
    backgroundColor: md.colors.outlineVariant,
  },
  dotActive: {
    backgroundColor: md.colors.primary,
    width: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: md.spacing.lg,
    gap: md.spacing.md,
  },
  skipBtn: { flex: 1 },
  nextBtn: { flex: 2 },
});
