import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Body, Button } from "./UI";
import { colors, font, radius, spacing } from "../theme";
import { shuffle } from "../util";
import { distractorWords } from "../data/phrases";

function clean(w: string): string {
  return w.toLowerCase().replace(/[.,!?;:"'’“”]/g, "").trim();
}

type Tile = { key: string; word: string };

/**
 * "Write by selecting": the learner taps word tiles to build the sentence in
 * the right order. Reports whether they got it right.
 */
export function WordArrange({
  sentence,
  onResult,
  onNext,
  nextLabel = "Next",
}: {
  sentence: string;
  onResult?: (correct: boolean) => void;
  onNext?: () => void;
  nextLabel?: string;
}) {
  const targetWords = sentence.split(/\s+/).filter(Boolean);
  const targetNorm = targetWords.map(clean);

  // Build the tile pool once: the real words + a couple of distractors.
  const pool = useMemo<Tile[]>(() => {
    const real: Tile[] = targetWords.map((w, i) => ({ key: `r${i}`, word: w }));
    const extras = shuffle(distractorWords.filter((d) => !targetNorm.includes(clean(d)))).slice(0, 3);
    const dist: Tile[] = extras.map((w, i) => ({ key: `d${i}`, word: w }));
    return shuffle([...real, ...dist]);
  }, [sentence]);

  const [picked, setPicked] = useState<Tile[]>([]);
  const [checked, setChecked] = useState<null | boolean>(null);

  const usedKeys = new Set(picked.map((t) => t.key));

  function tapPool(t: Tile) {
    if (checked != null) return;
    setPicked((p) => [...p, t]);
  }
  function tapPicked(idx: number) {
    if (checked != null) return;
    setPicked((p) => p.filter((_, i) => i !== idx));
  }
  function reset() {
    setPicked([]);
    setChecked(null);
  }
  function check() {
    const got = picked.map((t) => clean(t.word)).join(" ");
    const want = targetNorm.join(" ");
    const correct = got === want;
    setChecked(correct);
    onResult?.(correct);
  }

  return (
    <View>
      <Body style={{ color: colors.textSoft, marginBottom: spacing.sm }}>
        Tap the words in the right order:
      </Body>

      {/* Answer area */}
      <View style={[styles.answer, checked === true && styles.answerOk, checked === false && styles.answerBad]}>
        {picked.length === 0 ? (
          <Text style={styles.placeholder}>Your sentence appears here…</Text>
        ) : (
          picked.map((t, idx) => (
            <Pressable key={t.key + idx} onPress={() => tapPicked(idx)} style={styles.pickedTile}>
              <Text style={styles.pickedText}>{t.word}</Text>
            </Pressable>
          ))
        )}
      </View>

      {/* Word bank */}
      <View style={styles.bank}>
        {pool.map((t) => {
          const used = usedKeys.has(t.key);
          return (
            <Pressable
              key={t.key}
              onPress={() => tapPool(t)}
              disabled={used || checked != null}
              style={[styles.tile, used && styles.tileUsed]}
            >
              <Text style={[styles.tileText, used && styles.tileTextUsed]}>{t.word}</Text>
            </Pressable>
          );
        })}
      </View>

      {checked == null ? (
        <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.md }}>
          <Button title="Clear" variant="neutral" onPress={reset} style={{ flex: 1 }} />
          <Button title="Check" onPress={check} disabled={picked.length === 0} style={{ flex: 2 }} />
        </View>
      ) : checked ? (
        <View style={{ marginTop: spacing.md }}>
          <Body style={{ color: colors.correct, fontWeight: "800" }}>✓ Perfect — that's correct!</Body>
          {onNext && <Button title={nextLabel} onPress={onNext} style={{ marginTop: spacing.sm }} />}
        </View>
      ) : (
        <View style={{ marginTop: spacing.md }}>
          <Body style={{ color: colors.wrong, fontWeight: "800" }}>Not quite. The correct sentence is:</Body>
          <Text style={styles.reveal}>{sentence}</Text>
          <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm }}>
            <Button title="Try again" variant="neutral" onPress={reset} style={{ flex: 1 }} />
            {onNext && <Button title={nextLabel} onPress={onNext} style={{ flex: 1 }} />}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  answer: {
    minHeight: 70,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.sm,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  answerOk: { borderColor: colors.correct, backgroundColor: colors.correctBg },
  answerBad: { borderColor: colors.wrong, backgroundColor: colors.wrongBg },
  placeholder: { color: colors.textSoft, fontSize: font.label, fontStyle: "italic" },
  pickedTile: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  pickedText: { color: colors.white, fontSize: font.body, fontWeight: "700" },
  bank: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: spacing.md },
  tile: {
    backgroundColor: colors.neutralBtn,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileUsed: { backgroundColor: colors.bg, opacity: 0.4 },
  tileText: { fontSize: font.body, fontWeight: "700", color: colors.text },
  tileTextUsed: { color: colors.textSoft },
  reveal: { fontSize: font.big, fontWeight: "800", color: colors.text, marginTop: spacing.xs },
});
