import { cache } from "react";

import type { JournalEntry } from "@/types/database";

import { requireUser } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getWeekStart, getWordCount } from "@/utils/date";

export const getJournalEntries = cache(async () => {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load journal entries: ${error.message}`);
  }

  return data as JournalEntry[];
});

export async function getRecentJournalEntries(limit: number) {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("journal_entries")
    .select("analysis_emotions")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];

  return data as Pick<JournalEntry, "analysis_emotions">[];
}

export async function getJournalEntry(entryId: string) {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("id", entryId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return null;
  }

  return data as JournalEntry;
}

export async function getJournalStats() {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const weekStartIso = getWeekStart().toISOString();

  const [totalResult, weeklyResult, entriesResult] = await Promise.all([
    supabase
      .from("journal_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("journal_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", weekStartIso),
    supabase.from("journal_entries").select("content").eq("user_id", user.id),
  ]);

  if (totalResult.error) {
    throw new Error(`Unable to load total journal count: ${totalResult.error.message}`);
  }

  if (weeklyResult.error) {
    throw new Error(`Unable to load weekly journal count: ${weeklyResult.error.message}`);
  }

  if (entriesResult.error) {
    throw new Error(`Unable to load journal statistics: ${entriesResult.error.message}`);
  }

  const totalWords = entriesResult.data.reduce((sum, entry) => sum + getWordCount(entry.content), 0);

  return {
    totalEntries: totalResult.count ?? 0,
    entriesThisWeek: weeklyResult.count ?? 0,
    totalWords,
  };
}
