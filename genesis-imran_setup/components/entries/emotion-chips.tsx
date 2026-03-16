import { getSortedEmotionEntries } from "@/lib/journal-analysis";
import { cn } from "@/lib/utils";
import type { Json } from "@/types/database";

type EmotionChipsProps = {
  className?: string;
  emotions: Json | null | undefined;
  emptyLabel?: string;
  limit?: number;
  showPercentages?: boolean;
};

export function EmotionChips({
  className,
  emotions,
  emptyLabel,
  limit = 3,
  showPercentages = true,
}: EmotionChipsProps) {
  const items = getSortedEmotionEntries(emotions).slice(0, limit);

  if (items.length === 0) {
    return emptyLabel ? (
      <span className={cn("inline-flex rounded-full border border-border/70 bg-white/60 px-3 py-1 text-xs text-muted", className)}>
        {emptyLabel}
      </span>
    ) : null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <span
          key={item.key}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
          style={{
            backgroundColor: `${item.color}14`,
            borderColor: `${item.color}33`,
            color: item.color,
          }}
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          <span>
            {item.label}
            {showPercentages ? ` ${Math.round(item.score * 100)}%` : ""}
          </span>
        </span>
      ))}
    </div>
  );
}
