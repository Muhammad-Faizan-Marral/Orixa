"use client";
import { useEffect, useState } from "react";
import type { PuzzleBodyProps } from "./types";

type ClassificationId =
  | "overqualified"
  | "prompt"
  | "overtime"
  | "bugs"
  | "portfolio"
  | "quiet"
  | "chaos";

interface InterviewOption {
  label: string;
  reaction: string;
  classification: ClassificationId;
}

const QUESTIONS: { prompt: string; options: InterviewOption[] }[] = [
  {
    prompt: "Your portfolio is strong. How many years of experience do you have with our tool that launched last spring?",
    options: [
      { label: "More years than the tool has existed.", reaction: "Impressive. We have scheduled a meeting to discuss your timeline.", classification: "overqualified" },
      { label: "I learn tools quickly and show my work.", reaction: "A measured answer. The hiring model is recalibrating its confidence.", classification: "quiet" },
      { label: "I built a better version over the weekend.", reaction: "We love initiative. The original team would like a word.", classification: "chaos" },
    ],
  },
  {
    prompt: "A client requests a “minimal” portfolio with seventeen animations. What do you do?",
    options: [
      { label: "Ask the AI to define “minimal” before designing.", reaction: "A follow-up question? Bold. The brief has started sweating.", classification: "prompt" },
      { label: "Turn the chaos into a clear system.", reaction: "You made the impossible brief useful. The spreadsheet is delighted.", classification: "chaos" },
      { label: "Make every animation a separate case study.", reaction: "The portfolio is now longer than the project. The client is thrilled.", classification: "portfolio" },
    ],
  },
  {
    prompt: "The production build fails five minutes before the presentation. Your move?",
    options: [
      { label: "Find the smallest reproducible bug.", reaction: "You and the bug have been introduced. It looks nervous.", classification: "bugs" },
      { label: "Ship the stable version and explain the trade-off.", reaction: "A calm release. The room has forgotten how to panic.", classification: "quiet" },
      { label: "Rename the build “experimental” and demo anyway.", reaction: "Confidence: immaculate. Risk assessment: still loading.", classification: "chaos" },
    ],
  },
  {
    prompt: "Our culture values work-life balance. Can you join a 10 p.m. team-building call?",
    options: [
      { label: "I can join tomorrow during work hours.", reaction: "A boundary! HR has opened a document titled “precedent.”", classification: "quiet" },
      { label: "Only if the meeting has snacks and an agenda.", reaction: "Reasonable conditions have entered the chat.", classification: "overtime" },
      { label: "I already made a slide deck for it.", reaction: "The deck has 42 slides. The call is now a quarterly review.", classification: "portfolio" },
    ],
  },
  {
    prompt: "The recruiter asks for one final thing: a “quick” unpaid redesign exercise.",
    options: [
      { label: "Ask for scope, timeline, and compensation.", reaction: "The word “compensation” has caused a brief system outage.", classification: "overqualified" },
      { label: "Offer a link to relevant work instead.", reaction: "A professional answer. Your evenings remain yours.", classification: "quiet" },
      { label: "Send the invoice before opening the brief.", reaction: "The recruiter has discovered your most powerful feature: self-respect.", classification: "overtime" },
    ],
  },
];

const CLASSIFICATIONS: { id: ClassificationId; title: string }[] = [
  { id: "overqualified", title: "The Overqualified Intern" },
  { id: "prompt", title: "The Prompt Engineer of Doom" },
  { id: "overtime", title: "The CEO of Unpaid Overtime" },
  { id: "bugs", title: "The Professional Bug Creator" },
  { id: "portfolio", title: "The Portfolio Maximalist" },
  { id: "quiet", title: "The Quiet Shipper" },
  { id: "chaos", title: "The Chaos Debugger" },
];

export default function TerminalPuzzle({ attempt, busy }: PuzzleBodyProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choices, setChoices] = useState<ClassificationId[]>([]);
  const [reaction, setReaction] = useState<string | null>(null);

  useEffect(() => {
    if (!reaction) return;
    const timeout = window.setTimeout(() => {
      setReaction(null);
      setQuestionIndex((index) => index + 1);
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [reaction]);

  const classificationScores = choices.reduce<Record<ClassificationId, number>>(
    (scores, id) => {
      scores[id] += 1;
      return scores;
    },
    {
      overqualified: 0,
      prompt: 0,
      overtime: 0,
      bugs: 0,
      portfolio: 0,
      quiet: 0,
      chaos: 0,
    },
  );
  const classification = CLASSIFICATIONS.reduce((best, item) =>
    classificationScores[item.id] > classificationScores[best.id] ? item : best,
  );

  function replay() {
    setQuestionIndex(0);
    setChoices([]);
    setReaction(null);
  }

  return (
    <div className="space-y-4">
      {questionIndex < QUESTIONS.length ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-subtle-foreground">
              Recruiter simulation
            </p>
            <p className="font-mono text-sm text-accent" aria-live="polite">
              {questionIndex + 1} / {QUESTIONS.length}
            </p>
          </div>
          <progress
            aria-label="Interview progress"
            value={questionIndex + 1}
            max={QUESTIONS.length}
            className="h-2 w-full accent-primary"
          />
          <section className="rounded-xl border border-border-strong bg-surface p-4 sm:p-5">
            <p className="font-display text-lg font-semibold">
              {QUESTIONS[questionIndex].prompt}
            </p>
            <div className="mt-4 grid gap-2">
              {QUESTIONS[questionIndex].options.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  disabled={Boolean(reaction)}
                  onClick={() => {
                    setChoices((current) => [
                      ...current,
                      option.classification,
                    ]);
                    setReaction(option.reaction);
                  }}
                  className="min-h-11 rounded-lg border border-border-strong bg-surface-2 px-4 py-3 text-left text-sm transition hover:border-primary hover:bg-surface"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>
          <p
            aria-live="polite"
            className="min-h-12 rounded-lg border border-border bg-background/60 p-3 text-sm text-muted-foreground"
          >
            {reaction ?? "Choose an answer. The recruiter is taking notes."}
          </p>
        </>
      ) : (
        <section className="space-y-4 rounded-xl border border-border-strong bg-surface p-5 text-center">
          <p className="text-caption">Your thoroughly unofficial result</p>
          <h3 className="font-display text-2xl font-semibold text-gradient-ion">
            {classification.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            The interview is over. No unpaid take-home assignment was harmed
            in this classification.
          </p>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <button
              type="button"
              className="btn btn-ion"
              disabled={busy}
              onClick={() => void attempt("complete")}
            >
              Accept classification
            </button>
            <button type="button" className="btn btn-ghost" onClick={replay}>
              Replay interview
            </button>
          </div>
        </section>
      )}
      {questionIndex >= QUESTIONS.length && (
        <p className="text-center font-mono text-xs text-subtle-foreground">
          Interview complete · 5 / 5
        </p>
      )}
      {questionIndex < QUESTIONS.length && busy && (
        <p className="sr-only" role="status">
          Submitting classification
        </p>
      )}
    </div>
  );
}
