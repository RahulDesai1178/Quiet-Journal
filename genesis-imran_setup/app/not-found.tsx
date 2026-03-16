import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="soft-panel w-full max-w-xl rounded-[2rem] p-8 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Not found</p>
        <h1 className="mt-4 font-serif text-4xl text-foreground">That page does not exist.</h1>
        <p className="mt-3 text-muted">
          The journal entry or page you requested could not be found or is not available to your account.
        </p>
        <Link className={buttonVariants({ className: "mt-6 w-full" })} href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
