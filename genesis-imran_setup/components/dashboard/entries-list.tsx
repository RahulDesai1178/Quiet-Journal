"use client";

import { EntryCard } from "@/components/entries/entry-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { useJournalSearch } from "@/hooks/use-journal-search";
import type { JournalEntry } from "@/types/database";

type EntriesListProps = {
  entries: JournalEntry[];
};

export function EntriesList({ entries }: EntriesListProps) {
  const { filteredEntries, hasQuery, query, setQuery } = useJournalSearch(entries);

  return (
    <section className="space-y-5">
      <div className="soft-panel rounded-[1.75rem] p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="section-kicker">Your entries</p>
            <h2 className="mt-3 font-serif text-3xl text-foreground">A more readable archive.</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {entries.length === 0
              ? "Start your archive with the first private journal entry."
              : `Search across ${entries.length} saved ${entries.length === 1 ? "entry" : "entries"}, including AI notes and emotion labels.`}
          </p>
          </div>
          <div className="w-full sm:max-w-sm">
            <Input
              aria-label="Search journal entries"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, content, or insight"
              value={query}
            />
          </div>
        </div>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          actionHref="/journal/new"
          actionLabel="Write your first entry"
          description="Once you save a journal entry it will appear here in reverse chronological order."
          title="No journal entries yet"
        />
      ) : filteredEntries.length === 0 ? (
        <EmptyState
          actionHref="/dashboard"
          actionLabel="Clear search"
          description="Try a different word or phrase. Search checks titles, entry text, emotion labels, and AI notes."
          title={hasQuery ? "No entries match your search" : "No entries found"}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredEntries.map((entry) => (
            <EntryCard entry={entry} key={entry.id} />
          ))}
        </div>
      )}
    </section>
  );
}
