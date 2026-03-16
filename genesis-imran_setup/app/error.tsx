"use client";

import { buttonVariants } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorPageProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center px-4">
        <div className="soft-panel w-full max-w-lg rounded-[2rem] p-8 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-muted">Something broke</p>
          <h1 className="mt-4 font-serif text-4xl text-foreground">The app hit an unexpected error.</h1>
          <p className="mt-3 text-sm leading-7 text-muted">{error.message}</p>
          <button className={buttonVariants({ className: "mt-6 w-full" })} onClick={reset} type="button">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
