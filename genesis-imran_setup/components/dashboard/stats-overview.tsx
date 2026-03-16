import { Card, CardContent } from "@/components/ui/card";
import { formatShortDate } from "@/utils/date";

type StatsOverviewProps = {
  latestEntryAt?: string;
  stats: {
    entriesThisWeek: number;
    totalEntries: number;
    totalWords: number;
  };
};

export function StatsOverview({ latestEntryAt, stats }: StatsOverviewProps) {
  const items = [
    {
      accent: "rgba(44,103,88,0.14)",
      label: "Total entries",
      value: stats.totalEntries.toLocaleString(),
      note: "Everything saved to your private journal.",
    },
    {
      accent: "rgba(214,174,115,0.18)",
      label: "Entries this week",
      value: stats.entriesThisWeek.toLocaleString(),
      note: "A quick view of your current writing pace.",
    },
    {
      accent: "rgba(111,148,179,0.16)",
      label: "Words captured",
      value: stats.totalWords.toLocaleString(),
      note: latestEntryAt ? `Latest entry on ${formatShortDate(latestEntryAt)}.` : "Write your first entry today.",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="rounded-[1.75rem]">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="section-kicker">{item.label}</p>
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.accent }} />
            </div>
            <div
              className="rounded-[1.5rem] border border-border/65 px-4 py-5"
              style={{ background: `linear-gradient(180deg, ${item.accent}, rgba(255,255,255,0.52))` }}
            >
              <p className="font-serif text-5xl leading-none text-foreground">{item.value}</p>
            </div>
            <p className="text-sm leading-6 text-muted">{item.note}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
