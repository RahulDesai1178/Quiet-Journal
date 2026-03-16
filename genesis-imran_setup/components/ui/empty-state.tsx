import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

type EmptyStateProps = {
  actionHref: string;
  actionLabel: string;
  description: string;
  title: string;
};

export function EmptyState({ actionHref, actionLabel, description, title }: EmptyStateProps) {
  return (
    <div className="soft-panel rounded-[2rem] p-8 text-center">
      <p className="text-sm uppercase tracking-[0.24em] text-muted">Nothing here yet</p>
      <h3 className="mt-4 font-serif text-3xl text-foreground">{title}</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted">{description}</p>
      <Link className={buttonVariants({ className: "mt-6" })} href={actionHref}>
        {actionLabel}
      </Link>
    </div>
  );
}
