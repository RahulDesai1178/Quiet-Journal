import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="page-enter hidden flex-col justify-between rounded-[2rem] border border-border/70 bg-accent-strong p-8 text-white lg:flex">
          <div>
            <p className="font-serif text-2xl italic text-white/90">Quiet Journal</p>
          </div>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.24em] text-white/65">Personal reflection</p>
            <h1 className="font-serif text-5xl leading-tight text-balance">
              A private place to keep your daily thoughts organized.
            </h1>
            <p className="max-w-md text-base leading-7 text-white/72">
              Capture what happened, how it felt, and what you want to remember. Everything you write is
              scoped to your account through Supabase Auth and Postgres row-level security.
            </p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
            <p className="text-sm text-white/70">
              This MVP includes account creation, login, protected routes, journal management, dashboard
              stats, and profile details in one Next.js app.
            </p>
          </div>
        </section>
        <section className="flex items-center justify-center">{children}</section>
      </div>
    </main>
  );
}
