"use client";
import { useState, type FormEvent } from "react";
import type { PuzzleBodyProps } from "./types";

const EVIDENCE = [
  {
    id: "brief",
    label: "Brief",
    title: "Incident summary",
    content: (
      <>
        <p>
          At <strong>01:14</strong>, the private portfolio template{" "}
          <span className="font-mono text-accent">neo-glass</span> appeared in a
          public gist.
        </p>
        <p className="mt-3">
          The release team froze permissions at midnight. Establish who still
          had write access at that moment; earlier access alone does not count.
        </p>
      </>
    ),
  },
  {
    id: "access",
    label: "Access log",
    title: "Permission snapshot · 00:00",
    content: (
      <ul className="space-y-2 font-mono text-sm">
        <li>
          <span className="text-success">WRITE</span> · Reed · grant active
          since 22:08
        </li>
        <li>
          <span className="text-success">WRITE</span> · Nova · grant active
          since 23:16
        </li>
        <li>
          <span className="text-success">WRITE</span> · Jules · deploy token
          remains write-enabled
        </li>
        <li>
          <span className="text-subtle-foreground">REVOKED</span> · Mira ·
          session ended 23:42
        </li>
        <li>
          <span className="text-subtle-foreground">READ ONLY</span> · Kai ·
          downgraded 23:50
        </li>
      </ul>
    ),
  },
  {
    id: "chat",
    label: "Chat",
    title: "Team channel · 23:51–00:03",
    content: (
      <div className="space-y-3 font-mono text-sm">
        <p>
          <span className="text-accent">23:51 Reed:</span> “I can still push
          the rollback if needed.”
        </p>
        <p>
          <span className="text-accent">23:54 Nova:</span> “My write grant is
          still live. I&apos;m holding.”
        </p>
        <p>
          <span className="text-accent">00:03 Jules:</span> “Deploy token is
          still write-enabled; I didn&apos;t use it.”
        </p>
      </div>
    ),
  },
  {
    id: "notes",
    label: "Field notes",
    title: "Analyst annotation",
    content: (
      <ul className="list-inside list-disc space-y-2">
        <li>Count distinct people, not credentials or sessions.</li>
        <li>A revoked session and a read-only account cannot write.</li>
        <li>The timestamp to answer for is exactly 00:00.</li>
      </ul>
    ),
  },
] as const;

export default function DecoderPuzzle({ attempt, busy }: PuzzleBodyProps) {
  const [tab, setTab] = useState<(typeof EVIDENCE)[number]["id"]>("brief");
  const [answer, setAnswer] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [hintCount, setHintCount] = useState(0);
  const evidence = EVIDENCE.find((item) => item.id === tab) ?? EVIDENCE[0];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answer.trim() || busy) return;
    const submitted = answer.trim();
    const result = await attempt(submitted);
    if (result === "wrong") {
      setWrongAnswers((previous) => [...previous, submitted]);
      setAnswer("");
    }
  }

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border border-border-strong bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-border-strong px-4 py-3">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle-foreground">
            Case file · NF-0114
          </p>
          <span className="rounded-full border border-error/40 px-2 py-1 font-mono text-[0.65rem] text-error">
            RESTRICTED
          </span>
        </div>
        <div
          role="tablist"
          aria-label="Case evidence"
          className="grid grid-cols-2 gap-px border-b border-border-strong bg-border-strong sm:grid-cols-4"
        >
          {EVIDENCE.map((item) => (
            <button
              key={item.id}
              id={`case-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              aria-controls="case-evidence"
              onClick={() => setTab(item.id)}
              className={`min-h-11 bg-surface px-3 text-sm transition hover:text-foreground ${
                tab === item.id ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          id="case-evidence"
          role="tabpanel"
          aria-labelledby={`case-tab-${evidence.id}`}
          className="min-h-40 p-4 text-sm leading-6 text-muted-foreground"
        >
          <h3 className="mb-3 font-display text-base font-semibold text-foreground">
            {evidence.title}
          </h3>
          {evidence.content}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-subtle-foreground">
          Hint {hintCount} of 3
        </p>
        <button
          type="button"
          className="btn btn-ghost !min-h-11 !px-3 text-sm"
          disabled={hintCount >= 3}
          onClick={() => setHintCount((count) => Math.min(3, count + 1))}
        >
          Reveal next hint
        </button>
      </div>
      {hintCount > 0 && (
        <ol className="space-y-1 rounded-lg border border-border bg-surface-2 p-3 text-sm text-muted-foreground">
          {[
            "The snapshot is at 00:00; do not count access that ended before then.",
            "Remove anyone explicitly marked revoked or read-only.",
            "The remaining write-enabled people are Reed, Nova, and Jules.",
          ]
            .slice(0, hintCount)
            .map((hint, index) => (
              <li key={hint}>
                <span className="mr-2 font-mono text-accent">{index + 1}.</span>
                {hint}
              </li>
            ))}
        </ol>
      )}

      <form onSubmit={submit} className="space-y-3">
        <label
          htmlFor="decoder-answer"
          className="block text-sm font-medium"
        >
          How many people could still write at midnight?
        </label>
        <div className="flex gap-2">
          <input
            id="decoder-answer"
            inputMode="numeric"
            maxLength={2}
            value={answer}
            placeholder="Number"
            disabled={busy}
            onChange={(event) =>
              setAnswer(event.target.value.replace(/\D/g, ""))
            }
            className="min-h-12 min-w-0 flex-1 rounded-lg border border-border-strong bg-surface px-4 text-center font-mono text-lg"
          />
          <button
            type="submit"
            className="btn btn-ion"
            disabled={busy || !answer.trim()}
          >
            Submit answer
          </button>
        </div>
      </form>
      {wrongAnswers.length > 0 && (
        <p className="text-xs text-subtle-foreground" aria-live="polite">
          Incorrect submissions: {wrongAnswers.join(", ")}
        </p>
      )}
    </div>
  );
}
