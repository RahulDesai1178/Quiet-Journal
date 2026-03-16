import Link from "next/link";
import { notFound } from "next/navigation";

import { analyzeEntryAction, deleteEntryAction } from "@/app/actions";
import { AnalysisPanel } from "@/components/entries/analysis-panel";
import { ResourceCard } from "@/components/entries/resource-card";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBanner } from "@/components/ui/status-banner";
import { getJournalEntry } from "@/lib/journal";
import type { RecommendationResult } from "@/lib/recommend";
import { formatLongDateTime } from "@/utils/date";

type JournalDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    message?: string;
    tone?: "error" | "info" | "success";
  }>;
};

export default async function JournalDetailPage({ params, searchParams }: JournalDetailPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const entry = await getJournalEntry(id);

  if (!entry) {
    notFound();
  }

  return (
    <div className="page-enter space-y-6">
      <div className="soft-panel hero-glow rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="section-kicker">Entry detail</p>
            <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">
              {entry.title || "Untitled reflection"}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
              Revisit the original writing alongside the emotional reading that was saved with it.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className={buttonVariants({ variant: "secondary" })} href="/dashboard">
              Back to dashboard
            </Link>
            <form action={deleteEntryAction.bind(null, entry.id)}>
              <button className={buttonVariants({ variant: "destructive" })} type="submit">
                Delete entry
              </button>
            </form>
          </div>
        </div>
      </div>

      {query.message ? <StatusBanner message={query.message} tone={query.tone || "info"} /> : null}

      <Card className="rounded-[2rem]">
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-4 rounded-[1.5rem] border border-border/70 bg-white/60 p-5 sm:grid-cols-2">
            <div>
              <p className="section-kicker">Created</p>
              <p className="mt-2 text-sm text-foreground">{formatLongDateTime(entry.created_at)}</p>
            </div>
            <div>
              <p className="section-kicker">Updated</p>
              <p className="mt-2 text-sm text-foreground">{formatLongDateTime(entry.updated_at)}</p>
            </div>
          </div>
          <article className="paper-inset rounded-[1.7rem] border border-border/70 p-5 sm:p-7">
            <div className="whitespace-pre-wrap font-serif text-[1.2rem] leading-9 text-foreground">{entry.content}</div>
          </article>
        </CardContent>
      </Card>

      <AnalysisPanel
        action={
          <form action={analyzeEntryAction.bind(null, entry.id)}>
            <button className={buttonVariants({ variant: "secondary" })} type="submit">
              {entry.analysis_note ? "Refresh insights" : "Generate insights"}
            </button>
          </form>
        }
        analyzedAt={entry.analysis_created_at}
        emotions={entry.analysis_emotions}
        model={entry.analysis_model}
        note={entry.analysis_note}
      />

      {entry.analysis_recommendations ? (
        <ResourceCard recommendations={entry.analysis_recommendations as unknown as RecommendationResult} />
      ) : null}
    </div>
  );
}
