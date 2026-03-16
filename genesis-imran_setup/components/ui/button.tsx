import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent/35 disabled:pointer-events-none disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] text-white shadow-[0_18px_40px_-20px_rgba(31,77,65,0.85)] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-18px_rgba(31,77,65,0.95)]",
  secondary:
    "border border-border bg-white/78 text-foreground shadow-[0_12px_28px_-24px_rgba(27,45,39,0.7)] backdrop-blur hover:-translate-y-0.5 hover:bg-white",
  ghost: "text-foreground hover:bg-white/70",
  destructive: "bg-danger text-white shadow-[0_18px_36px_-22px_rgba(166,70,70,0.8)] hover:-translate-y-0.5 hover:bg-[#8f3d3d]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonVariants({
  className,
  size = "md",
  variant = "primary",
}: {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, size = "md", variant = "primary", ...props },
  ref,
) {
  return <button className={buttonVariants({ className, size, variant })} ref={ref} {...props} />;
});
