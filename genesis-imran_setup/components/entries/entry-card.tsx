import Link from "next/link";

import { EmotionChips } from "@/components/entries/emotion-chips";
import { Card, CardContent } from "@/components/ui/card";
import type { JournalEntry } from "@/types/database";
import { formatShortDate, formatTime, getSnippet } from "@/utils/date";

type EntryCardProps = {
  entry: JournalEntry;
};

export function EntryCard({ entry }: EntryCardProps) {
  return (
    <Link className="block" href={`/journal/${entry.id}`}>
      <Card className="rounded-[1.75rem] transition-transform hover:-translate-y-1">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="section-kicker">Journal entry</p>
              <h3 className="mt-3 font-serif text-3xl leading-tight text-foreground">
                {entry.title || "Untitled reflection"}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {formatShortDate(entry.created_at)} at {formatTime(entry.created_at)}
              </p>
            </div>
            <span className="inline-flex rounded-full border border-border/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              {entry.analysis_note ? "Insight ready" : "Pending insight"}
            </span>
          </div>
          <EmotionChips emotions={entry.analysis_emotions} emptyLabel="Insights pending" />
          <div className="paper-inset rounded-[1.4rem] border border-border/60 px-4 py-4">
            <p className="text-sm leading-7 text-muted">{getSnippet(entry.content, 210)}</p>
          </div>
          {entry.analysis_note ? (
            <div className="rounded-[1.35rem] border border-border/70 bg-[linear-gradient(180deg,rgba(214,231,223,0.26),rgba(255,255,255,0.48))] p-4">
              <p className="section-kicker">Guidance</p>
              <p className="text-sm leading-7 text-foreground/80">{getSnippet(entry.analysis_note, 180)}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
