import Link from "next/link";

import { EmotionOverview } from "@/components/dashboard/emotion-overview";
import { EntriesList } from "@/components/dashboard/entries-list";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { buttonVariants } from "@/components/ui/button";
import { StatusBanner } from "@/components/ui/status-banner";
import { hasStoredAnalysis } from "@/lib/journal-analysis";
import { getJournalEntries, getJournalStats } from "@/lib/journal";

type DashboardPageProps = {
  searchParams: Promise<{
    message?: string;
    tone?: "error" | "info" | "success";
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const [entries, stats] = await Promise.all([getJournalEntries(), getJournalStats()]);
  const analyzedCount = entries.filter((entry) => hasStoredAnalysis(entry)).length;

  return (
    <div className="page-enter space-y-6">
      <section className="soft-panel hero-glow rounded-[2rem] p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr] xl:items-end">
          <div className="space-y-4">
            <p className="section-kicker">Dashboard</p>
            <h1 className="font-serif text-4xl leading-tight text-balance text-foreground sm:text-5xl">
              Your recent reflections, all in one place.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted">
              Review your archive, search through past notes, and keep a steady journaling habit.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link className={buttonVariants({ size: "lg" })} href="/journal/new">
                New entry
              </Link>
              <Link className={buttonVariants({ size: "lg", variant: "secondary" })} href="/insights">
                Open insights
              </Link>
              <div className="rounded-full border border-border/70 bg-white/65 px-4 py-3 text-sm text-muted">
                {analyzedCount} {analyzedCount === 1 ? "entry has" : "entries have"} saved insights
              </div>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.68),rgba(214,231,223,0.34))] p-5 shadow-[0_22px_40px_-34px_rgba(25,46,38,0.58)]">
            <p className="section-kicker">Archive pulse</p>
            <p className="mt-3 font-serif text-3xl text-foreground">
              {entries[0]?.title || "Your archive begins with the next honest paragraph."}
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">
              New entries fold emotional context into the archive so the app can show not just what happened, but how
              it felt.
            </p>
          </div>
        </div>
        {params.message ? (
          <StatusBanner className="mt-5" message={params.message} tone={params.tone || "success"} />
        ) : null}
      </section>

      <StatsOverview latestEntryAt={entries[0]?.created_at} stats={stats} />
      <EmotionOverview entries={entries} />

      <EntriesList entries={entries} />
    </div>
  );
}
