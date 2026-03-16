import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JournalInsights } from "@/lib/insights";
import { formatShortDate } from "@/utils/date";

export function EmotionPatterns({ insights }: { insights: JournalInsights }) {
  return (
    <section className="grid gap-4 xl:grid-cols-[0.95fr_1.1fr]">
      <Card className="rounded-[1.75rem]">
        <CardHeader>
          <p className="section-kicker">Emotional mix</p>
          <CardTitle className="mt-3 text-3xl">What has been showing up most often lately.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.recentAverageEmotions.slice(0, 6).map((emotion) => (
            <div key={emotion.key} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{emotion.label}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">{Math.round(emotion.score * 100)}%</p>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/80">
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

          {insights.recentAverageEmotions.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-white/55 p-5 text-sm leading-7 text-muted">
              Save a few analyzed entries to see the emotional mix settle into something readable.
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem]">
        <CardHeader>
          <p className="section-kicker">Recent checkpoints</p>
          <CardTitle className="mt-3 text-3xl">The last few moments in the timeline.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.recentPoints.map((point) => (
            <Link
              key={point.id}
              className="block rounded-[1.45rem] border border-border/70 bg-white/60 p-4 hover:-translate-y-0.5"
              href={`/journal/${point.id}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="section-kicker">{formatShortDate(point.createdAt)}</p>
                  <h3 className="mt-2 font-serif text-2xl text-foreground">
                    {point.title || "Untitled reflection"}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {point.dominantEmotion
                      ? `${point.dominantEmotion.label} was the strongest emotional signal in this entry.`
                      : "Emotion data saved for this entry."}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                  <div className="rounded-full border border-border/70 bg-white/70 px-3 py-2 text-sm font-semibold text-foreground">
                    Mood {point.moodScore}/100
                  </div>
                  {point.dominantEmotion ? (
                    <div
                      className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                      style={{
                        backgroundColor: `${point.dominantEmotion.color}14`,
                        borderColor: `${point.dominantEmotion.color}33`,
                        color: point.dominantEmotion.color,
                      }}
                    >
                      {point.dominantEmotion.label}
                    </div>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
