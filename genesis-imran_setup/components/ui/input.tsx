import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {
  return (
    <input
      className={cn(
        "h-[3.25rem] w-full rounded-[1.35rem] border border-border/90 bg-white/82 px-4 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none placeholder:text-muted/72 focus:border-accent/35 focus:bg-white focus:ring-4 focus:ring-accent/10",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
