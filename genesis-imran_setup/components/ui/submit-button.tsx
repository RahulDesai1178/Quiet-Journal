"use client";

import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "@/components/ui/button";

type SubmitButtonProps = ButtonProps & {
  pendingLabel?: string;
};

export function SubmitButton({
  children,
  pendingLabel = "Working...",
  variant = "primary",
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button aria-disabled={pending} disabled={pending} variant={variant} {...props}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
