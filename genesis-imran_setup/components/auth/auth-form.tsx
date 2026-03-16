"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBanner } from "@/components/ui/status-banner";
import { SubmitButton } from "@/components/ui/submit-button";
import { EMPTY_ACTION_STATE, type ActionState } from "@/lib/validators";

type AuthFormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

type AuthFormProps = {
  action: AuthFormAction;
  alternateHref: string;
  alternateLabel: string;
  alternateText: string;
  description: string;
  message?: string;
  next?: string;
  submitLabel: string;
  title: string;
};

export function AuthForm({
  action,
  alternateHref,
  alternateLabel,
  alternateText,
  description,
  message,
  next,
  submitLabel,
  title,
}: AuthFormProps) {
  const [state, formAction] = useActionState(action, EMPTY_ACTION_STATE);
  const activeMessage = state.message ?? message;

  return (
    <Card className="page-enter w-full max-w-xl rounded-[2rem]">
      <CardHeader>
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Secure access</p>
        <CardTitle className="mt-3 text-4xl sm:text-5xl">{title}</CardTitle>
        <CardDescription className="mt-3">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {activeMessage ? (
          <StatusBanner message={activeMessage} tone={state.message ? "error" : "info"} />
        ) : null}
        <form action={formAction} className="space-y-4">
          {next ? <input name="next" type="hidden" value={next} /> : null}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              Email
            </label>
            <Input
              autoComplete="email"
              defaultValue={state.fields?.email ?? ""}
              id="email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
            {state.errors?.email ? <p className="text-sm text-danger">{state.errors.email}</p> : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="password">
              Password
            </label>
            <Input
              autoComplete={submitLabel === "Log in" ? "current-password" : "new-password"}
              id="password"
              name="password"
              placeholder="At least 8 characters"
              type="password"
            />
            {state.errors?.password ? <p className="text-sm text-danger">{state.errors.password}</p> : null}
          </div>
          <SubmitButton className="mt-2 w-full" pendingLabel="Submitting..." size="lg">
            {submitLabel}
          </SubmitButton>
        </form>
        <p className="text-sm text-muted">
          {alternateText}{" "}
          <Link className="font-medium text-accent-strong underline underline-offset-4" href={alternateHref}>
            {alternateLabel}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
