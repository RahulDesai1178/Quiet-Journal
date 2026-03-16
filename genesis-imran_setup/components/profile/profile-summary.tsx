import { Card, CardContent } from "@/components/ui/card";
import { formatLongDateTime, formatShortDate } from "@/utils/date";

type ProfileSummaryProps = {
  createdAt: string;
  email: string;
  stats: {
    entriesThisWeek: number;
    totalEntries: number;
    totalWords: number;
  };
};

export function ProfileSummary({ createdAt, email, stats }: ProfileSummaryProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-[2rem]">
        <CardContent className="space-y-5 p-6 sm:p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">User details</p>
            <h2 className="mt-3 font-serif text-3xl text-foreground">{email}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              Account created on {formatLongDateTime(createdAt)}.
            </p>
          </div>
          <div className="grid gap-4 rounded-[1.75rem] border border-border/70 bg-white/60 p-5 sm:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted">Member since</p>
              <p className="mt-2 text-base font-medium text-foreground">{formatShortDate(createdAt)}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted">Entries this week</p>
              <p className="mt-2 text-base font-medium text-foreground">{stats.entriesThisWeek}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {[
          {
            label: "Total journal entries",
            note: "All entries linked to your authenticated Supabase user.",
            value: stats.totalEntries.toLocaleString(),
          },
          {
            label: "Total words written",
            note: "A lightweight signal of how much you have captured so far.",
            value: stats.totalWords.toLocaleString(),
          },
        ].map((item) => (
          <Card className="rounded-[2rem]" key={item.label}>
            <CardContent className="space-y-3 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-muted">{item.label}</p>
              <p className="font-serif text-4xl text-foreground">{item.value}</p>
              <p className="text-sm leading-6 text-muted">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
