import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSortedEmotionEntries } from "@/lib/journal-analysis";
import type { Json } from "@/types/database";
import { formatLongDateTime } from "@/utils/date";

type AnalysisPanelProps = {
  action?: ReactNode;
  analyzedAt?: string | null;
  emotions: Json | null | undefined;
  model?: string | null;
  note?: string | null;
};

export function AnalysisPanel({ action, analyzedAt, emotions, model, note }: AnalysisPanelProps) {
  const emotionEntries = getSortedEmotionEntries(emotions);
  const hasAnalysis = emotionEntries.length > 0 || Boolean(note?.trim());

  return (
    <Card className="rounded-[2rem]">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="section-kicker">AI reflection</p>
          <CardTitle className="mt-3 text-3xl">Emotional landscape</CardTitle>
          <CardDescription className="mt-3 max-w-2xl">
            {hasAnalysis
              ? "A private emotional summary generated from the entry you wrote."
              : "This entry does not have saved insights yet."}
          </CardDescription>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>

      <CardContent className="space-y-6">
        {hasAnalysis ? (
          <>
            {analyzedAt || model ? (
              <div className="rounded-[1.5rem] border border-border/70 bg-white/60 p-4 text-sm leading-6 text-muted">
                {analyzedAt ? `Analyzed on ${formatLongDateTime(analyzedAt)}.` : "Saved analysis available."}
                {model ? ` Model: ${model}.` : ""}
              </div>
            ) : null}

            {emotionEntries.length > 0 ? (
              <div className="space-y-4 rounded-[1.5rem] border border-border/70 bg-surface-strong/70 p-5">
                {emotionEntries.map((emotion) => (
                  <div key={emotion.key} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-foreground">{emotion.label}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted">
                        {Math.round(emotion.score * 100)}%
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

            {note ? (
              <div className="rounded-[1.5rem] border border-border/70 bg-[linear-gradient(180deg,rgba(214,231,223,0.28),rgba(255,255,255,0.54))] p-5">
                <p className="section-kicker">Therapeutic note and guidance</p>
                <p className="mt-3 whitespace-pre-wrap text-base leading-8 text-foreground">{note}</p>
              </div>
            ) : null}

            <p className="text-sm leading-6 text-muted">
              These reflections are supportive wellness notes and should not be treated as medical advice.
            </p>
          </>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-border/70 bg-white/55 p-5 text-sm leading-7 text-muted">
            Open this entry again later to generate or refresh its emotional summary if AI was unavailable when
            it was first saved.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
