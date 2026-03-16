import Link from "next/link";
import type { ReactNode } from "react";

import { logoutAction } from "@/app/actions";
import { Navigation } from "@/components/layout/navigation";
import { buttonVariants } from "@/components/ui/button";
import { formatShortDate } from "@/utils/date";

type AppShellProps = {
  children: ReactNode;
  userCreatedAt: string;
  userEmail: string;
};

export function AppShell({ children, userCreatedAt, userEmail }: AppShellProps) {
  return (
    <div className="relative min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl gap-6">
        <aside className="glass-panel hidden w-80 flex-col rounded-[2rem] p-6 lg:flex">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/10 bg-white/60 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.24em] text-accent-strong uppercase">
              Private journal
            </div>
            <p className="mt-5 font-serif text-[2.6rem] leading-none italic text-accent-strong">Quiet Journal</p>
            <p className="mt-4 text-sm leading-7 text-muted">
              A softer place to notice patterns, write clearly, and revisit how your inner weather changes over time.
            </p>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-border/60 bg-white/45 p-3">
            <Navigation />
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,rgba(214,231,223,0.38),rgba(255,255,255,0.34))] p-5">
            <p className="section-kicker">Today&apos;s rhythm</p>
            <p className="mt-3 font-serif text-2xl text-foreground">Reflect, trace the feeling, keep the thread.</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Each saved entry can carry emotional context and a note you can return to later.
            </p>
          </div>

          <div className="mt-auto space-y-4 rounded-[1.75rem] border border-border/70 bg-white/55 p-5">
            <div>
              <p className="section-kicker">Account</p>
              <p className="mt-3 text-sm font-semibold text-foreground">{userEmail}</p>
              <p className="mt-1 text-sm text-muted">Member since {formatShortDate(userCreatedAt)}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link className={buttonVariants({ size: "lg" })} href="/journal/new">
                Write now
              </Link>
              <form action={logoutAction}>
                <button className={buttonVariants({ className: "w-full", variant: "secondary" })} type="submit">
                  Log out
                </button>
              </form>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-0">
          <header className="glass-panel hero-glow page-enter rounded-[2rem] p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="section-kicker">Today</p>
                <h1 className="mt-3 font-serif text-3xl leading-none text-foreground sm:text-[3rem]">
                  {formatShortDate(new Date().toISOString())}
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
                  A slower interface for fast thoughts. Write, revisit, and let the archive show you the shape of your
                  days.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-border/70 bg-white/66 px-4 py-4 text-sm text-muted shadow-[0_18px_34px_-28px_rgba(25,46,38,0.55)]">
                Signed in as <span className="font-semibold text-foreground">{userEmail}</span>
              </div>
            </div>
          </header>

          <main className="mt-6 flex-1">{children}</main>
        </div>
      </div>
      <Navigation mobile />
    </div>
  );
}
