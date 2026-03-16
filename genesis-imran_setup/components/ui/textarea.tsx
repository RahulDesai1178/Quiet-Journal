import type { TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref,
) {
  return (
    <textarea
      className={cn(
        "min-h-52 w-full rounded-[1.7rem] border border-border/90 bg-white/82 px-5 py-4 text-sm leading-8 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.84)] outline-none placeholder:text-muted/72 focus:border-accent/35 focus:bg-white focus:ring-4 focus:ring-accent/10",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
