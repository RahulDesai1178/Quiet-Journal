"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecommendationResult, RecommendedResource } from "@/lib/recommend";

type ResourceCardProps = {
  recommendations: RecommendationResult;
};

function BookingPanel({ resource, onClose }: { resource: RecommendedResource; onClose: () => void }) {
  return (
    <div className="mt-3 rounded-[1.2rem] border border-border/70 bg-white/80 p-4 space-y-3">
      <p className="text-sm font-medium text-foreground">Booking {resource.name}</p>
      <p className="text-sm text-muted leading-6">
        Reach out directly to get started — they&apos;re here to help.
      </p>
      <a
        href={resource.contact.startsWith("http") ? resource.contact : `tel:${resource.contact.replace(/\D/g, "")}`}
        className="inline-block rounded-full bg-foreground px-5 py-2 text-sm font-medium text-white"
      >
        {resource.contact.startsWith("http") ? "Visit website" : `Call ${resource.contact}`}
      </a>
      <button
        onClick={onClose}
        className="ml-3 text-sm text-muted underline underline-offset-2"
      >
        Cancel
      </button>
    </div>
  );
}

export function ResourceCard({ recommendations }: ResourceCardProps) {
  const [bookingResource, setBookingResource] = useState<RecommendedResource | null>(null);
  const [dismissed, setDismissed] = useState(false);

  if (!recommendations.should_recommend || recommendations.resources.length === 0 || dismissed) {
    return null;
  }

  return (
    <Card className="rounded-[2rem]" style={{ background: "linear-gradient(180deg, rgba(198,228,210,0.22), rgba(220,240,230,0.38))" }}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Support nearby</p>
            <CardTitle className="mt-3 text-3xl">You might find these helpful</CardTitle>
            <CardDescription className="mt-3 max-w-2xl">{recommendations.reasoning}</CardDescription>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 text-sm text-muted underline underline-offset-2 mt-1"
          >
            Dismiss
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {recommendations.resources.map((resource, index) => (
            <div key={index} className="rounded-[1.5rem] border border-border/70 bg-white/60 p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{resource.name}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{resource.description}</p>
                  <p className="mt-1 text-sm text-foreground/70">{resource.contact}</p>
                </div>
                <button
                  onClick={() => setBookingResource(bookingResource?.name === resource.name ? null : resource)}
                  className="mt-3 shrink-0 rounded-full border border-border/70 bg-white/80 px-4 py-1.5 text-sm font-medium text-foreground hover:bg-white sm:ml-4 sm:mt-0"
                >
                  {bookingResource?.name === resource.name ? "Cancel" : "Book appointment"}
                </button>
              </div>
              {bookingResource?.name === resource.name && (
                <BookingPanel resource={resource} onClose={() => setBookingResource(null)} />
              )}
            </div>
          ))}
        </div>

        <p className="text-sm leading-6 text-muted">
          These are suggestions, not prescriptions. You&apos;re always in control.
        </p>
      </CardContent>
    </Card>
  );
}
