import { Card, CardContent } from "@/components/ui/card";
import type { JournalInsights } from "@/lib/insights";

function formatSignedValue(value: number | null) {
  if (value === null) {
    return "No baseline";
  }

  const prefix = value > 0 ? "+" : "";

  return `${prefix}${value}`;
}

export function WellbeingMetrics({ insights }: { insights: JournalInsights }) {
  const primaryCards = [
    {
      accent: "rgba(44,103,88,0.16)",
      label: "Overall mood",
      note: insights.currentMoodDescriptor?.note || "Save more analyzed entries to establish a clearer signal.",
      subline:
        insights.currentMoodScore !== null
          ? `${formatSignedValue(insights.moodDelta)} vs previous ${insights.windowSize}-entry window`
          : "Waiting for analyzed entries",
      value: insights.currentMoodScore !== null ? `${insights.currentMoodScore}/100` : "No score",
    },
    {
      accent: "rgba(214,174,115,0.18)",
      label: "Trend direction",
      note: "Compares your most recent analyzed entries against the earlier baseline.",
      subline: insights.currentMoodDescriptor?.label || "No reading yet",
      value: insights.trendDirection,
    },
    {
      accent: "rgba(135,169,109,0.18)",
      label: "Positive balance",
      note:
        insights.positiveShare !== null && insights.negativeShare !== null
          ? `${Math.round(insights.positiveShare)}% supportive emotions vs ${Math.round(insights.negativeShare)}% heavier ones recently.`
          : "Needs more analyzed entries",
      subline: "Recent emotional mix",
      value: insights.positiveShare !== null ? `${Math.round(insights.positiveShare)}%` : "No reading",
    },
    {
      accent: "rgba(111,148,179,0.18)",
      label: "Consistency",
      note: `You journaled in ${insights.activeWeeks} of the last 8 weeks.`,
      subline: "Habit signal",
      value: `${insights.consistencyScore}%`,
    },
  ];

  const secondaryCards = [
    {
      label: "Recurring emotion",
      note: insights.recurringEmotion
        ? `${insights.recurringEmotion.label} has shown up most often as the dominant feeling.`
        : "No recurring pattern yet.",
      value: insights.recurringEmotion?.label || "Not enough data",
    },
    {
      label: "Emotional range",
      note: "Counts how many different dominant emotions have appeared over time.",
      value: `${insights.emotionalRangeCount} ${insights.emotionalRangeCount === 1 ? "state" : "states"}`,
    },
    {
      label: "Average reflection length",
      note: "Average words per journal entry across the archive.",
      value: `${insights.averageWordsPerEntry} words`,
    },
    {
      label: "Analyzed entries",
      note: "Entries with saved emotion data powering these wellbeing insights.",
      value: insights.analyzedEntryCount.toLocaleString(),
    },
  ];

  return (
    <section className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-4">
        {primaryCards.map((card) => (
          <Card key={card.label} className="rounded-[1.75rem]">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="section-kicker">{card.label}</p>
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: card.accent }} />
              </div>
              <div
                className="rounded-[1.5rem] border border-border/70 px-4 py-5"
                style={{ background: `linear-gradient(180deg, ${card.accent}, rgba(255,255,255,0.58))` }}
              >
                <p className="font-serif text-4xl leading-none text-foreground">{card.value}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">{card.subline}</p>
              </div>
              <p className="text-sm leading-6 text-muted">{card.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {secondaryCards.map((card) => (
          <Card key={card.label} className="rounded-[1.6rem]">
            <CardContent className="space-y-3 p-5">
              <p className="section-kicker">{card.label}</p>
              <p className="font-serif text-3xl text-foreground">{card.value}</p>
              <p className="text-sm leading-6 text-muted">{card.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
