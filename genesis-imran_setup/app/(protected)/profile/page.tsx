import { logoutAction } from "@/app/actions";
import { ProfileSummary } from "@/components/profile/profile-summary";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { getJournalStats } from "@/lib/journal";

export default async function ProfilePage() {
  const [user, stats] = await Promise.all([requireUser(), getJournalStats()]);

  return (
    <div className="page-enter space-y-6">
      <section className="soft-panel rounded-[2rem] p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Profile</p>
        <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">Your account snapshot.</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
          Review your Supabase-authenticated account details, journaling volume, and weekly activity.
        </p>
      </section>

      <ProfileSummary createdAt={user.created_at} email={user.email ?? "Unknown email"} stats={stats} />

      <form action={logoutAction}>
        <button className={buttonVariants({ variant: "secondary", className: "w-full sm:w-auto" })} type="submit">
          Log out securely
        </button>
      </form>
    </div>
  );
}
