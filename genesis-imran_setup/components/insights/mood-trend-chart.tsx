import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InsightPoint, JournalInsights } from "@/lib/insights";
import { formatShortDate } from "@/utils/date";

function buildLinePath(points: Array<{ x: number; y: number }>) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function buildAreaPath(points: Array<{ x: number; y: number }>, chartHeight: number, padY: number) {
  if (points.length === 0) {
    return "";
  }

  const line = buildLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];

  return `${line} L ${last.x} ${chartHeight - padY} L ${first.x} ${chartHeight - padY} Z`;
}

function getPlottedPoints(points: InsightPoint[]) {
  const chartWidth = 760;
  const chartHeight = 280;
  const padX = 34;
  const padY = 30;

  const plotted = points.map((point, index) => {
    const x =
      points.length === 1
        ? chartWidth / 2
        : padX + (index * (chartWidth - padX * 2)) / Math.max(points.length - 1, 1);
    const y = chartHeight - padY - (point.moodScore / 100) * (chartHeight - padY * 2);

    return {
      ...point,
      x,
      y,
    };
  });

  return {
    chartHeight,
    chartWidth,
    padX,
    padY,
    plotted,
  };
}

export function MoodTrendChart({ insights }: { insights: JournalInsights }) {
  const { chartHeight, chartWidth, padY, plotted } = getPlottedPoints(insights.trendPoints);
  const linePath = buildLinePath(plotted);
  const areaPath = buildAreaPath(plotted, chartHeight, padY);
  const lastPoint = plotted[plotted.length - 1];
  const labelIndexes = [0, Math.floor((plotted.length - 1) / 2), plotted.length - 1].filter(
    (value, index, list) => value >= 0 && list.indexOf(value) === index,
  );

  return (
    <Card className="rounded-[2rem]">
      <CardHeader className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="section-kicker">Mood over time</p>
          <CardTitle className="mt-3 text-4xl">A running mood score across your analyzed entries.</CardTitle>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            Each dot is a saved journal entry with emotion analysis. The score is a weighted blend of the supportive
            emotions and the heavier ones that showed up in the writing.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-border/70 bg-white/60 px-4 py-4 text-sm leading-6 text-muted">
          {insights.baselineMoodScore !== null ? `Baseline ${insights.baselineMoodScore}/100 across the archive.` : ""}
          {insights.currentMoodDescriptor ? ` ${insights.currentMoodDescriptor.label} recently.` : ""}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(214,231,223,0.18))] p-4 sm:p-6">
          <svg className="h-auto w-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img">
            <title>Mood score trend across analyzed journal entries</title>

            {[25, 50, 75].map((value) => {
              const y = chartHeight - padY - (value / 100) * (chartHeight - padY * 2);

              return (
                <g key={value}>
                  <line
                    stroke="rgba(25,49,41,0.08)"
                    strokeDasharray="6 8"
                    strokeWidth="1"
                    x1="24"
                    x2={chartWidth - 24}
                    y1={y}
                    y2={y}
                  />
                  <text fill="rgba(104,117,111,0.9)" fontSize="12" x="2" y={y + 4}>
                    {value}
                  </text>
                </g>
              );
            })}

            {areaPath ? <path d={areaPath} fill="rgba(44,103,88,0.12)" /> : null}
            {linePath ? (
              <path
                d={linePath}
                fill="none"
                stroke="url(#moodLine)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              />
            ) : null}

            <defs>
              <linearGradient id="moodLine" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#d6ae73" />
                <stop offset="100%" stopColor="#2c6758" />
              </linearGradient>
            </defs>

            {plotted.map((point) => (
              <g key={point.id}>
                <circle cx={point.x} cy={point.y} fill="white" r="7" />
                <circle cx={point.x} cy={point.y} fill={point.dominantEmotion?.color || "#2c6758"} r="4.5" />
              </g>
            ))}

            {lastPoint ? (
              <>
                <circle cx={lastPoint.x} cy={lastPoint.y} fill="rgba(44,103,88,0.14)" r="16" />
                <circle cx={lastPoint.x} cy={lastPoint.y} fill={lastPoint.dominantEmotion?.color || "#2c6758"} r="5" />
              </>
            ) : null}
          </svg>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-6">
              {labelIndexes.map((index) => (
                <div key={index}>
                  <p className="section-kicker">{formatShortDate(plotted[index].createdAt)}</p>
                  <p className="mt-2 text-sm text-muted">{plotted[index].title || "Untitled reflection"}</p>
                </div>
              ))}
            </div>
            {lastPoint ? (
              <div className="rounded-[1.35rem] border border-border/70 bg-white/70 px-4 py-3">
                <p className="section-kicker">Latest point</p>
                <p className="mt-2 font-serif text-3xl text-foreground">{lastPoint.moodScore}/100</p>
              </div>
            ) : null}
          </div>
        </div>

        <p className="text-sm leading-6 text-muted">
          This score is a reflective wellness signal generated from the emotions in your entries. It is not a clinical
          mental health assessment.
        </p>
      </CardContent>
    </Card>
  );
}
