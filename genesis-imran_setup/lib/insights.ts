import type { JournalEntry } from "@/types/database";

import {
  EMOTION_META,
  getAverageEmotionEntries,
  getDominantEmotion,
  normalizeEmotionScores,
  type EmotionEntry,
  type EmotionKey,
} from "@/lib/journal-analysis";
import { getWeekStart, getWordCount } from "@/utils/date";

const POSITIVE_EMOTIONS: EmotionKey[] = ["joy", "gratitude", "calm", "hope"];
const HEAVIER_EMOTIONS: EmotionKey[] = ["sadness", "anxiety", "anger", "loneliness"];
const MOOD_WEIGHTS: Record<EmotionKey, number> = {
  anger: -0.92,
  anxiety: -0.88,
  calm: 0.62,
  gratitude: 0.82,
  hope: 0.74,
  joy: 1,
  loneliness: -0.8,
  sadness: -0.74,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, precision = 1) {
  const multiplier = 10 ** precision;

  return Math.round(value * multiplier) / multiplier;
}

function average(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getEmotionShare(scores: Partial<Record<EmotionKey, number>>, keys: EmotionKey[]) {
  return keys.reduce((sum, key) => sum + (scores[key] ?? 0), 0);
}

export function getMoodScoreFromEmotionScores(scores: Partial<Record<EmotionKey, number>>) {
  const weightedSum = Object.entries(scores).reduce((sum, [key, value]) => {
    const emotionKey = key as EmotionKey;

    return sum + (value ?? 0) * MOOD_WEIGHTS[emotionKey];
  }, 0);

  return Math.round(clamp((weightedSum + 1) * 50, 0, 100));
}

function getMoodDescriptor(score: number, delta: number | null) {
  if (score >= 70 && (delta ?? 0) >= 3) {
    return {
      label: "Rising",
      note: "Recent entries read lighter and more grounded than the earlier baseline.",
      tone: "up",
    } as const;
  }

  if (score >= 62) {
    return {
      label: "Steady",
      note: "Your recent emotional pattern looks relatively balanced, with more supportive than heavy emotions.",
      tone: "steady",
    } as const;
  }

  if (score >= 46) {
    return {
      label: "Mixed",
      note: "The recent pattern looks more emotionally split, with both supportive and heavier signals present.",
      tone: "mixed",
    } as const;
  }

  return {
    label: "Heavy",
    note: "Recent entries are carrying more emotional weight. Use this as a prompt to slow down and notice what needs care.",
    tone: "down",
  } as const;
}

function getTrendLabel(delta: number | null) {
  if (delta === null || Math.abs(delta) < 3) {
    return "Steady";
  }

  return delta > 0 ? "Upward" : "Lower";
}

export type InsightPoint = {
  createdAt: string;
  dominantEmotion: EmotionEntry | null;
  id: string;
  moodScore: number;
  negativeShare: number;
  positiveShare: number;
  title: string | null;
  words: number;
};

export type JournalInsights = {
  activeWeeks: number;
  allTimeAverageEmotions: EmotionEntry[];
  analyzedEntryCount: number;
  averageWordsPerEntry: number;
  baselineMoodScore: number | null;
  consistencyScore: number;
  currentMoodDescriptor:
    | {
        label: string;
        note: string;
        tone: "down" | "mixed" | "steady" | "up";
      }
    | null;
  currentMoodScore: number | null;
  emotionalRangeCount: number;
  entriesCount: number;
  moodDelta: number | null;
  negativeShare: number | null;
  positiveShare: number | null;
  recentAverageEmotions: EmotionEntry[];
  recentPoints: InsightPoint[];
  recurringEmotion:
    | {
        color: string;
        count: number;
        label: string;
      }
    | null;
  trendDirection: string;
  trendPoints: InsightPoint[];
  windowSize: number;
};

export function buildJournalInsights(entries: JournalEntry[]): JournalInsights {
  const chronologicalEntries = [...entries].sort(
    (left, right) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime(),
  );

  const analyzedEntries = chronologicalEntries.filter(
    (entry) => Object.keys(normalizeEmotionScores(entry.analysis_emotions)).length > 0,
  );

  const analyzedPoints = analyzedEntries.map((entry) => {
    const scores = normalizeEmotionScores(entry.analysis_emotions);

    return {
      createdAt: entry.created_at,
      dominantEmotion: getDominantEmotion(scores),
      id: entry.id,
      moodScore: getMoodScoreFromEmotionScores(scores),
      negativeShare: round(getEmotionShare(scores, HEAVIER_EMOTIONS) * 100),
      positiveShare: round(getEmotionShare(scores, POSITIVE_EMOTIONS) * 100),
      title: entry.title,
      words: getWordCount(entry.content),
    } satisfies InsightPoint;
  });

  const windowSize = Math.min(5, analyzedPoints.length);
  const currentWindow = windowSize > 0 ? analyzedPoints.slice(-windowSize) : [];
  const previousWindow = windowSize > 0 ? analyzedPoints.slice(-windowSize * 2, -windowSize) : [];

  const currentMoodScore = average(currentWindow.map((point) => point.moodScore));
  const baselineMoodScore = average(analyzedPoints.map((point) => point.moodScore));
  const comparisonMoodScore = average(previousWindow.map((point) => point.moodScore)) ?? baselineMoodScore;
  const moodDelta =
    currentMoodScore !== null && comparisonMoodScore !== null ? round(currentMoodScore - comparisonMoodScore) : null;

  const now = new Date();
  const currentWeekStart = getWeekStart(now);
  const oldestTrackedWeek = new Date(currentWeekStart);
  oldestTrackedWeek.setDate(oldestTrackedWeek.getDate() - 7 * 7);

  const activeWeeks = new Set(
    chronologicalEntries
      .filter((entry) => new Date(entry.created_at).getTime() >= oldestTrackedWeek.getTime())
      .map((entry) => getWeekStart(new Date(entry.created_at)).toISOString().slice(0, 10)),
  ).size;

  const dominantEmotionCounts = analyzedPoints.reduce(
    (counts, point) => {
      if (point.dominantEmotion) {
        counts[point.dominantEmotion.key] = (counts[point.dominantEmotion.key] ?? 0) + 1;
      }

      return counts;
    },
    {} as Partial<Record<EmotionKey, number>>,
  );

  const recurringEmotionKey = (Object.entries(dominantEmotionCounts).sort((left, right) => right[1] - left[1])[0]?.[0] ??
    null) as EmotionKey | null;

  return {
    activeWeeks,
    allTimeAverageEmotions: getAverageEmotionEntries(analyzedEntries),
    analyzedEntryCount: analyzedEntries.length,
    averageWordsPerEntry: entries.length
      ? Math.round(entries.reduce((sum, entry) => sum + getWordCount(entry.content), 0) / entries.length)
      : 0,
    baselineMoodScore: baselineMoodScore === null ? null : Math.round(baselineMoodScore),
    consistencyScore: Math.round((activeWeeks / 8) * 100),
    currentMoodDescriptor:
      currentMoodScore === null ? null : getMoodDescriptor(Math.round(currentMoodScore), moodDelta),
    currentMoodScore: currentMoodScore === null ? null : Math.round(currentMoodScore),
    emotionalRangeCount: new Set(
      analyzedPoints.map((point) => point.dominantEmotion?.key).filter((value): value is EmotionKey => Boolean(value)),
    ).size,
    entriesCount: entries.length,
    moodDelta,
    negativeShare: average(currentWindow.map((point) => point.negativeShare)),
    positiveShare: average(currentWindow.map((point) => point.positiveShare)),
    recentAverageEmotions: getAverageEmotionEntries(analyzedEntries.slice(-10)),
    recentPoints: [...analyzedPoints].slice(-6).reverse(),
    recurringEmotion: recurringEmotionKey
      ? {
          color: EMOTION_META[recurringEmotionKey].color,
          count: dominantEmotionCounts[recurringEmotionKey] ?? 0,
          label: EMOTION_META[recurringEmotionKey].label,
        }
      : null,
    trendDirection: getTrendLabel(moodDelta),
    trendPoints: analyzedPoints.slice(-24),
    windowSize,
  };
}
