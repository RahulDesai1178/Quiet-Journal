import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col justify-between gap-8">
        <header className="page-enter flex items-center justify-between rounded-full border border-border/70 bg-white/55 px-5 py-3 backdrop-blur">
          <div>
            <p className="font-serif text-lg italic text-accent-strong">Quiet Journal</p>
          </div>
          <div className="flex items-center gap-3">
            <Link className={cn(buttonVariants({ variant: "ghost", size: "sm" }))} href="/login">
              Log in
            </Link>
            <Link className={cn(buttonVariants({ size: "sm" }))} href="/signup">
              Create account
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="page-enter space-y-6">
            <p className="inline-flex rounded-full border border-accent/15 bg-accent-soft/70 px-4 py-2 text-sm font-medium text-accent-strong">
              Private journaling for focused daily reflection
            </p>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-serif text-5xl leading-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
                Write clearly, keep your thoughts safe, and track your rhythm over time.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                Quiet Journal is a polished MVP for personal writing. Sign up, capture entries in seconds,
                review your archive, and see simple journaling statistics in a calm, modern dashboard.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className={buttonVariants({ size: "lg" })} href="/signup">
                Start journaling
              </Link>
              <Link className={buttonVariants({ variant: "secondary", size: "lg" })} href="/login">
                I already have an account
              </Link>
            </div>
          </div>

          <div className="page-enter">
            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
              <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-accent-soft/70 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/70 blur-2xl" />
              <div className="relative space-y-5">
                <div className="rounded-3xl border border-border/70 bg-white/70 p-5">
                  <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">What you get</p>
                  <div className="mt-4 space-y-3">
                    {[
                      "Secure Supabase authentication",
                      "Private journal entries protected by RLS",
                      "Responsive dashboard and profile stats",
                      "Fast local setup for hackathon demos",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-border/70 bg-surface-strong px-4 py-3 text-sm text-foreground"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-border/70 bg-accent-strong px-5 py-6 text-white">
                  <p className="text-sm uppercase tracking-[0.24em] text-white/75">Built for an MVP</p>
                  <p className="mt-3 font-serif text-3xl leading-tight">
                    One Next.js codebase.
                    <br />
                    Auth, database, UI, and docs included.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
