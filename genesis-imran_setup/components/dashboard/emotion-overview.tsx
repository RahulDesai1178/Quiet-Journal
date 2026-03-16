import Link from "next/link";

import { EmotionChips } from "@/components/entries/emotion-chips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAverageEmotionEntries, getDominantEmotion, hasStoredAnalysis } from "@/lib/journal-analysis";
import type { JournalEntry } from "@/types/database";
import { formatShortDate, getSnippet } from "@/utils/date";

type EmotionOverviewProps = {
  entries: JournalEntry[];
};

export function EmotionOverview({ entries }: EmotionOverviewProps) {
  if (entries.length === 0) {
    return null;
  }

  const analyzedEntries = entries.filter((entry) => hasStoredAnalysis(entry));
  const averageEmotions = getAverageEmotionEntries(entries).slice(0, 4);
  const recentArc = analyzedEntries
    .map((entry) => ({
      dominantEmotion: getDominantEmotion(entry.analysis_emotions),
      entry,
    }))
    .filter((item) => item.dominantEmotion)
    .slice(0, 6)
    .reverse();

  return (
    <section className="grid gap-4 xl:grid-cols-[0.95fr_1.3fr]">
      <Card className="rounded-[1.75rem]">
        <CardHeader>
          <p className="section-kicker">Emotional overview</p>
          <CardTitle className="mt-3 text-3xl">How your writing has been feeling.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-[1.5rem] border border-border/70 bg-white/60 p-4">
            <p className="text-sm leading-7 text-muted">
              {analyzedEntries.length === 0
                ? "No AI insights are saved yet. New entries will be analyzed automatically, and older entries can be updated from their detail pages."
                : `Saved emotional insights exist for ${analyzedEntries.length} of ${entries.length} entries.`}
            </p>
          </div>

          {averageEmotions.length > 0 ? (
            <div className="space-y-4">
              {averageEmotions.map((emotion) => (
                <div key={emotion.key} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">{emotion.label}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                      Avg {Math.round(emotion.score * 100)}%
                    </p>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/80">
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${emotion.color}99, ${emotion.color})`,
                        width: `${Math.max(8, Math.round(emotion.score * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem]">
        <CardHeader>
          <p className="section-kicker">Recent emotional arc</p>
          <CardTitle className="mt-3 text-3xl">How it has shifted over time.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentArc.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-white/55 p-5 text-sm leading-7 text-muted">
              Save a new entry or run insights on an older one to start building your emotional history.
            </div>
          ) : (
            recentArc.map(({ dominantEmotion, entry }) => (
              <Link
                key={entry.id}
                className="block rounded-[1.5rem] border border-border/70 bg-white/60 p-4 hover:-translate-y-0.5"
                href={`/journal/${entry.id}`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="section-kicker">{formatShortDate(entry.created_at)}</p>
                    <h3 className="mt-2 font-serif text-2xl text-foreground">
                      {entry.title || "Untitled reflection"}
                    </h3>
                    {entry.analysis_note ? (
                      <p className="mt-2 text-sm leading-7 text-muted">{getSnippet(entry.analysis_note, 150)}</p>
                    ) : null}
                  </div>
                  <div className="sm:max-w-xs">
                    <EmotionChips emotions={entry.analysis_emotions} limit={2} />
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
                      Dominant: {dominantEmotion?.label}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
