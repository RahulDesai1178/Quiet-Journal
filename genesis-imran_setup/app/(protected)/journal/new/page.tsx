import { NewEntryForm } from "@/components/entries/new-entry-form";

export default function NewEntryPage() {
  return (
    <div className="page-enter space-y-6">
      <section className="soft-panel hero-glow rounded-[2rem] p-6 sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
          <div>
            <p className="section-kicker">New entry</p>
            <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">Capture what matters today.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              Add a short title if it helps you organize your thoughts, then write the entry itself. Saving now also
              runs the entry through AI to generate an emotional overview and a therapeutic reflection you can revisit
              later.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(214,231,223,0.32))] p-5">
            <p className="section-kicker">What gets saved</p>
            <p className="mt-3 font-serif text-3xl text-foreground">Your words, the emotional read, and the note.</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              That makes the archive useful later when you want to compare patterns instead of rereading everything
              from scratch.
            </p>
          </div>
        </div>
      </section>

      <NewEntryForm />
    </div>
  );
}
