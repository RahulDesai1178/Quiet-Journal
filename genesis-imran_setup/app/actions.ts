"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { analyzeJournalEntry } from "@/lib/journal-ai";
import { isStrugglingEntry } from "@/lib/journal-analysis";
import { getRecentJournalEntries } from "@/lib/journal";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  EMPTY_ACTION_STATE,
  getTextField,
  validateAuthFields,
  validateJournalFields,
  type ActionState,
} from "@/lib/validators";

type MessageTone = "error" | "info" | "success";

function buildMessageRedirect(pathname: string, message: string, tone: MessageTone = "success") {
  const searchParams = new URLSearchParams({
    message,
    tone,
  });

  return `${pathname}?${searchParams.toString()}`;
}

export async function loginAction(
  previousState: ActionState = EMPTY_ACTION_STATE,
  formData: FormData,
): Promise<ActionState> {
  void previousState;
  const email = getTextField(formData, "email").toLowerCase();
  const password = getTextField(formData, "password");
  const next = getTextField(formData, "next");

  const validation = validateAuthFields(email, password);

  if (validation) {
    return validation;
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      fields: { email, next },
      message: error.message,
    };
  }

  redirect(next || "/dashboard");
}

export async function signupAction(
  previousState: ActionState = EMPTY_ACTION_STATE,
  formData: FormData,
): Promise<ActionState> {
  void previousState;
  const email = getTextField(formData, "email").toLowerCase();
  const password = getTextField(formData, "password");

  const validation = validateAuthFields(email, password);

  if (validation) {
    return validation;
  }

  const supabase = await createServerSupabaseClient();
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";
  const emailRedirectTo = `${origin}/auth/callback?next=/dashboard`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    return {
      fields: { email },
      message: error.message,
    };
  }

  if (!data.session) {
    redirect(
      buildMessageRedirect(
        "/login",
        "Account created. Check your email to confirm your sign-in if email confirmation is enabled.",
      ),
    );
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();

  await supabase.auth.signOut();

  redirect("/login");
}

export async function createEntryAction(
  previousState: ActionState = EMPTY_ACTION_STATE,
  formData: FormData,
): Promise<ActionState> {
  void previousState;
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const title = getTextField(formData, "title");
  const content = getTextField(formData, "content");

  const validation = validateJournalFields(title, content);

  if (validation) {
    return validation;
  }

  let analysis = null;
  let redirectMessage = "Entry saved with AI insights.";
  let redirectTone: MessageTone = "success";

  try {
    analysis = await analyzeJournalEntry({
      content,
      title,
    });
  } catch (error) {
    console.error("Journal analysis failed during entry creation:", error);
    redirectMessage = "Entry saved, but AI insights are unavailable right now.";
    redirectTone = "info";
  }

  let recommendations = null;
  if (analysis?.emotions && isStrugglingEntry(analysis.emotions)) {
    const previousEntries = await getRecentJournalEntries(2);
    const allStruggling = previousEntries.length === 2 &&
      previousEntries.every((e) => isStrugglingEntry(e.analysis_emotions));
    if (allStruggling) {
      const { getRecommendations } = await import("@/lib/recommend");
      recommendations = await getRecommendations(content, analysis.emotions as Record<string, number>);
    }
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      analysis_created_at: analysis?.analyzedAt ?? null,
      analysis_emotions: analysis?.emotions ?? null,
      analysis_model: analysis?.model ?? null,
      analysis_note: analysis?.note ?? null,
      analysis_recommendations: recommendations ?? null,
      content,
      title: title || null,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      fields: { title, content },
      message: "Unable to save your journal entry right now.",
    };
  }

  redirect(buildMessageRedirect(`/journal/${data.id}`, redirectMessage, redirectTone));
}

export async function analyzeEntryAction(entryId: string) {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  const { data: entry, error: loadError } = await supabase
    .from("journal_entries")
    .select("content, id, title")
    .eq("id", entryId)
    .eq("user_id", user.id)
    .single();

  if (loadError || !entry) {
    redirect(buildMessageRedirect("/dashboard", "Unable to find that entry for analysis.", "error"));
  }

  try {
    const analysis = await analyzeJournalEntry({
      content: entry.content,
      title: entry.title || "",
    });

    const { error } = await supabase
      .from("journal_entries")
      .update({
        analysis_created_at: analysis.analyzedAt,
        analysis_emotions: analysis.emotions,
        analysis_model: analysis.model,
        analysis_note: analysis.note,
      })
      .eq("id", entryId)
      .eq("user_id", user.id);

    if (error) {
      redirect(buildMessageRedirect(`/journal/${entryId}`, "Unable to save AI insights right now.", "error"));
    }
  } catch (error) {
    console.error("Journal analysis failed for existing entry:", error);
    redirect(buildMessageRedirect(`/journal/${entryId}`, "AI insights are unavailable right now.", "error"));
  }

  redirect(buildMessageRedirect(`/journal/${entryId}`, "AI insights updated.", "success"));
}

export async function deleteEntryAction(entryId: string) {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", user.id);

  if (error) {
    redirect(buildMessageRedirect(`/journal/${entryId}`, "Unable to delete that entry.", "error"));
  }

  redirect(buildMessageRedirect("/dashboard", "Entry deleted.", "success"));
}
