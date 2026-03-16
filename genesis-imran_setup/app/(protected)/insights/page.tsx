import Link from "next/link";

import { EmotionPatterns } from "@/components/insights/emotion-patterns";
import { MoodTrendChart } from "@/components/insights/mood-trend-chart";
import { WellbeingMetrics } from "@/components/insights/wellbeing-metrics";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getJournalEntries } from "@/lib/journal";
import { buildJournalInsights } from "@/lib/insights";

export default async function InsightsPage() {
  const entries = await getJournalEntries();

  if (entries.length === 0) {
    return (
      <div className="page-enter space-y-6">
        <section className="soft-panel hero-glow rounded-[2rem] p-6 sm:p-8">
          <p className="section-kicker">Insights</p>
          <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">Track your mental wellbeing over time.</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            This area turns your archive into a longer-view read of mood, emotional balance, and journaling patterns.
          </p>
        </section>

        <EmptyState
          actionHref="/journal/new"
          actionLabel="Write your first entry"
          description="Insights appear after you start saving journal entries with emotion analysis."
          title="No data to analyze yet"
        />
      </div>
    );
  }

  const insights = buildJournalInsights(entries);

  if (insights.analyzedEntryCount === 0) {
    return (
      <div className="page-enter space-y-6">
        <section className="soft-panel hero-glow rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="section-kicker">Insights</p>
              <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">
                Track your mental wellbeing over time.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                This page needs saved emotion analysis before it can chart anything meaningful.
              </p>
            </div>
            <Link className={buttonVariants({ size: "lg" })} href="/journal/new">
              Create analyzed entry
            </Link>
          </div>
        </section>

        <div className="soft-panel rounded-[2rem] p-6 sm:p-8">
          <p className="font-serif text-3xl text-foreground">You have entries, but no insight data yet.</p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
            New entries analyze automatically on save. Older entries can also be opened individually and refreshed to
            generate their emotion summary.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter space-y-6">
      <section className="soft-panel hero-glow rounded-[2rem] p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr] xl:items-end">
          <div>
            <p className="section-kicker">Insights</p>
            <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">
              Track your mental wellbeing over time.
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
              This section turns saved emotion analysis into a longer-view read of mood, emotional balance, and the way
              your writing shifts over time.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(214,231,223,0.32))] p-5">
            <p className="section-kicker">Reading window</p>
            <p className="mt-3 font-serif text-3xl text-foreground">
              {insights.analyzedEntryCount} analyzed {insights.analyzedEntryCount === 1 ? "entry" : "entries"}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Scores here are reflective wellness signals from your journal archive, meant to help you notice patterns
              rather than diagnose anything.
            </p>
          </div>
        </div>
      </section>

      <WellbeingMetrics insights={insights} />
      <MoodTrendChart insights={insights} />
      <EmotionPatterns insights={insights} />
    </div>
  );
}
