"use client";

import { useActionState } from "react";

import { createEntryAction } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBanner } from "@/components/ui/status-banner";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY_ACTION_STATE } from "@/lib/validators";

export function NewEntryForm() {
  const [state, formAction] = useActionState(createEntryAction, EMPTY_ACTION_STATE);

  return (
    <Card className="rounded-[2rem]">
      <CardHeader>
        <p className="section-kicker">Writing space</p>
        <CardTitle className="mt-3 text-4xl">Write an entry</CardTitle>
        <CardDescription className="mt-3 max-w-2xl">
          Titles are optional. When you save, AI will analyze the entry and attach emotional insights plus a
          supportive reflection.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            {state.message ? <StatusBanner message={state.message} tone="error" /> : null}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground" htmlFor="title">
                Title
              </label>
              <Input defaultValue={state.fields?.title ?? ""} id="title" name="title" placeholder="A quiet morning" />
              {state.errors?.title ? <p className="text-sm text-danger">{state.errors.title}</p> : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground" htmlFor="content">
                Entry
              </label>
              <Textarea
                defaultValue={state.fields?.content ?? ""}
                id="content"
                name="content"
                placeholder="What happened today? What stood out? What do you want to remember?"
              />
              {state.errors?.content ? <p className="text-sm text-danger">{state.errors.content}</p> : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <SubmitButton className="w-full sm:w-auto" pendingLabel="Saving and analyzing..." size="lg">
                Save and analyze
              </SubmitButton>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.6rem] border border-border/70 bg-[linear-gradient(180deg,rgba(214,231,223,0.34),rgba(255,255,255,0.48))] p-5">
              <p className="section-kicker">After you save</p>
              <p className="mt-3 font-serif text-3xl text-foreground">The entry becomes more than a note.</p>
              <p className="mt-3 text-sm leading-7 text-muted">
                You will see a feeling breakdown, a reflective note, and a record you can revisit to compare how your
                mood has changed over time.
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-border/70 bg-white/56 p-5">
              <p className="section-kicker">Privacy</p>
              <p className="mt-3 text-sm leading-7 text-muted">
                Reflections are private to your account. AI notes are intended for wellness support, not medical
                advice.
              </p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
