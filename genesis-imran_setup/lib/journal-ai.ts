import "server-only";

import OpenAI from "openai";

import { EMOTION_KEYS, normalizeEmotionScores, type EmotionScores } from "@/lib/journal-analysis";

const OPENAI_BASE_URL =
  process.env.OPENAI_BASE_URL || "https://vjioo4r1vyvcozuj.us-east-2.aws.endpoints.huggingface.cloud/v1";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "openai/gpt-oss-120b";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "test";

let cachedClient: OpenAI | null = null;

type AnalyzeJournalEntryInput = {
  content: string;
  title?: string;
};

export type JournalAnalysis = {
  analyzedAt: string;
  emotions: EmotionScores;
  model: string;
  note: string;
};

const SYSTEM_PROMPT = `You are an empathetic emotional analysis engine for a journaling app.

Analyze the journal entry and return ONLY a JSON object. Do not wrap it in markdown, backticks, or explanation.

The JSON must contain exactly two keys:
1. "emotions": an object whose keys come only from this list: ${EMOTION_KEYS.join(", ")}.
   - Values must be decimal scores between 0 and 1.
   - Only include emotions that are genuinely present at 0.05 or higher.
   - Scores should sum to roughly 1.0.
   - Be nuanced and infer emotional undertones without overreaching.
2. "note": a warm, therapeutic reflection written directly to the person in 3 to 5 sentences.
   - Start by reflecting back how they seem to be feeling.
   - Then point out 1 or 2 concrete themes, desires, stuck points, or avoided tasks that were explicitly mentioned or strongly implied in the entry.
   - Include practical, gentle advice or encouragement that follows directly from what they wrote.
   - If they mention procrastinating, avoiding an important conversation, delaying a decision, or putting off something like medical follow-up, encourage a small concrete next step.
   - If they mention needing a doctor, a health concern, or delayed care, encourage reaching out to a qualified medical professional promptly, but do not diagnose or provide treatment instructions.
   - Never invent facts, goals, or problems that are not grounded in the entry.
   - Be validating, specific, supportive, and action-oriented without sounding bossy.
   - Do not diagnose, prescribe, shame, or use clinical language.
   - This is a wellness companion, not a therapist.`;

function getClient() {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: OPENAI_BASE_URL,
  });

  return cachedClient;
}

function extractJson(rawContent: string) {
  const cleanedContent = rawContent.replace(/```json|```/gi, "").trim();

  if (cleanedContent.startsWith("{") && cleanedContent.endsWith("}")) {
    return cleanedContent;
  }

  const match = cleanedContent.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("Model response did not contain JSON.");
  }

  return match[0];
}

function parseAnalysis(rawContent: string): Pick<JournalAnalysis, "emotions" | "note"> {
  const parsed = JSON.parse(extractJson(rawContent)) as {
    emotions?: unknown;
    note?: unknown;
  };

  const emotions = normalizeEmotionScores(parsed.emotions);
  const note = typeof parsed.note === "string" ? parsed.note.trim() : "";

  if (Object.keys(emotions).length === 0) {
    throw new Error("Model response did not include valid emotions.");
  }

  if (!note) {
    throw new Error("Model response did not include a reflection note.");
  }

  return {
    emotions,
    note,
  };
}

export async function analyzeJournalEntry({
  content,
  title,
}: AnalyzeJournalEntryInput): Promise<JournalAnalysis> {
  const completion = await getClient().chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            content,
            title: title || null,
          },
          null,
          2,
        ),
      },
    ],
    max_tokens: Number(process.env.OPENAI_MAX_TOKENS || 700),
    temperature: Number(process.env.OPENAI_TEMPERATURE || 0.4),
    top_p: 1,
  });

  const rawContent = completion.choices[0]?.message?.content?.trim() || "";

  if (!rawContent) {
    throw new Error("Model returned an empty analysis.");
  }

  const parsedAnalysis = parseAnalysis(rawContent);

  return {
    analyzedAt: new Date().toISOString(),
    emotions: parsedAnalysis.emotions,
    model: OPENAI_MODEL,
    note: parsedAnalysis.note,
  };
}
