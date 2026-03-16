"use client";

import { useDeferredValue, useState } from "react";

import { getEmotionSearchText } from "@/lib/journal-analysis";
import type { JournalEntry } from "@/types/database";

export function useJournalSearch(entries: JournalEntry[]) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredEntries = normalizedQuery
    ? entries.filter((entry) => {
        const title = entry.title?.toLowerCase() ?? "";
        const content = entry.content.toLowerCase();
        const note = entry.analysis_note?.toLowerCase() ?? "";
        const emotions = getEmotionSearchText(entry.analysis_emotions);

        return (
          title.includes(normalizedQuery) ||
          content.includes(normalizedQuery) ||
          note.includes(normalizedQuery) ||
          emotions.includes(normalizedQuery)
        );
      })
    : entries;

  return {
    filteredEntries,
    hasQuery: normalizedQuery.length > 0,
    query,
    setQuery,
  };
}
