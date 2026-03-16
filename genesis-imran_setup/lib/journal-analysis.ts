import type { Json, JournalEntry } from "@/types/database";

export const EMOTION_META = {
  joy: { color: "#d28a63", label: "Joy" },
  sadness: { color: "#6f94b3", label: "Sadness" },
  anxiety: { color: "#a588c6", label: "Anxiety" },
  anger: { color: "#cb7865", label: "Anger" },
  gratitude: { color: "#87a96d", label: "Gratitude" },
  calm: { color: "#91af8b", label: "Calm" },
  loneliness: { color: "#7d88a0", label: "Loneliness" },
  hope: { color: "#d7b06d", label: "Hope" },
} as const;

export type EmotionKey = keyof typeof EMOTION_META;
export type EmotionScores = Partial<Record<EmotionKey, number>>;
export type EmotionEntry = {
  color: string;
  key: EmotionKey;
  label: string;
  score: number;
};

export const EMOTION_KEYS = Object.keys(EMOTION_META) as EmotionKey[];

function roundScore(value: number) {
  return Math.round(value * 1000) / 1000;
}

function toNumber(value: unknown) {
  const numericValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numericValue) && numericValue > 0 ? Math.min(1, numericValue) : null;
}

export function normalizeEmotionScores(value: unknown): EmotionScores {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const record = value as Record<string, unknown>;
  const entries = EMOTION_KEYS.flatMap((key) => {
    const numericValue = toNumber(record[key]);

    return numericValue && numericValue >= 0.05 ? ([[key, numericValue]] as const) : [];
  });

  const total = entries.reduce((sum, [, score]) => sum + score, 0);

  if (!total) {
    return {};
  }

  return Object.fromEntries(entries.map(([key, score]) => [key, roundScore(score / total)])) as EmotionScores;
}

export function parseEmotionScores(value: Json | null | undefined) {
  return normalizeEmotionScores(value);
}

export function getSortedEmotionEntries(value: EmotionScores | Json | null | undefined): EmotionEntry[] {
  const scores = normalizeEmotionScores(value);

  return Object.entries(scores)
    .map(([key, score]) => {
      const emotionKey = key as EmotionKey;

      return {
        color: EMOTION_META[emotionKey].color,
        key: emotionKey,
        label: EMOTION_META[emotionKey].label,
        score,
      };
    })
    .sort((left, right) => right.score - left.score);
}

export function getDominantEmotion(value: EmotionScores | Json | null | undefined) {
  return getSortedEmotionEntries(value)[0] ?? null;
}

export function getEmotionSearchText(value: EmotionScores | Json | null | undefined) {
  return getSortedEmotionEntries(value)
    .map((emotion) => emotion.label.toLowerCase())
    .join(" ");
}

const STRUGGLING_EMOTIONS: EmotionKey[] = ["sadness", "anxiety", "anger", "loneliness"];
const STRUGGLING_THRESHOLD = 0.45;

export function isStrugglingEntry(value: EmotionScores | Json | null | undefined): boolean {
  const scores = normalizeEmotionScores(value);
  const total = STRUGGLING_EMOTIONS.reduce((sum, key) => sum + (scores[key] ?? 0), 0);
  return total >= STRUGGLING_THRESHOLD;
}

export function hasStoredAnalysis(
  entry: Pick<JournalEntry, "analysis_emotions" | "analysis_note">,
) {
  return getSortedEmotionEntries(entry.analysis_emotions).length > 0 || Boolean(entry.analysis_note?.trim());
}

export function getAverageEmotionEntries(
  entries: Array<Pick<JournalEntry, "analysis_emotions">>,
) {
  const totals = Object.fromEntries(EMOTION_KEYS.map((key) => [key, 0])) as Record<EmotionKey, number>;
  let analyzedEntryCount = 0;

  for (const entry of entries) {
    const normalizedScores = normalizeEmotionScores(entry.analysis_emotions);

    if (Object.keys(normalizedScores).length === 0) {
      continue;
    }

    analyzedEntryCount += 1;

    for (const key of EMOTION_KEYS) {
      totals[key] += normalizedScores[key] ?? 0;
    }
  }

  if (!analyzedEntryCount) {
    return [];
  }

  return EMOTION_KEYS.map((key) => ({
    color: EMOTION_META[key].color,
    key,
    label: EMOTION_META[key].label,
    score: roundScore(totals[key] / analyzedEntryCount),
  }))
    .filter((emotion) => emotion.score > 0)
    .sort((left, right) => right.score - left.score);
}
