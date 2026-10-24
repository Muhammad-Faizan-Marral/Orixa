"use client";
import { useState } from "react";
import type { PuzzleBodyProps } from "./types";

interface ForgeChoice {
  label: string;
  description: string;
  titleWord?: string;
  tagline: string;
}

const STAGES: { title: string; options: ForgeChoice[] }[] = [
  {
    title: "Choose your artifact",
    options: [
      { label: "The Key", description: "You look for the door in every impossible brief.", titleWord: "Silent", tagline: "You make a way where none was obvious." },
      { label: "The Mirror", description: "You notice what a product says about the people using it.", titleWord: "Invisible", tagline: "You make the unseen feel understood." },
      { label: "The Broken Star", description: "You turn imperfect beginnings into a direction.", titleWord: "Wayfinding", tagline: "A little fracture can become a new map." },
      { label: "The Compass", description: "You help teams find north when the signal gets noisy.", titleWord: "Northbound", tagline: "Clarity is a direction you can build toward." },
    ],
  },
  {
    title: "Choose your personality",
    options: [
      { label: "Architect", description: "You give ambitious ideas a structure they can grow inside.", tagline: "A strong frame makes room for bold work." },
      { label: "Explorer", description: "You learn by following the question past the obvious answer.", tagline: "Curiosity is your most reliable instrument." },
      { label: "Inventor", description: "You prototype possibilities before the old rules catch up.", tagline: "Make the thing that makes the next thing possible." },
      { label: "Strategist", description: "You connect small decisions to the larger picture.", tagline: "Every detail earns its place in the whole." },
    ],
  },
  {
    title: "Choose your superpower",
    options: [
      { label: "Chaos → systems", description: "You turn a tangle of moving parts into a system people can use.", tagline: "From scattered to shippable." },
      { label: "Ideas → stories", description: "You shape a raw idea into a story people remember.", tagline: "Give good ideas a voice." },
      { label: "Building new worlds", description: "You make new digital places feel tangible and alive.", tagline: "Imagine it, then make it inhabitable." },
      { label: "Noise → signal", description: "You find the useful truth hiding inside the noise.", tagline: "Make the important thing unmistakable." },
    ],
  },
  {
    title: "Choose a visual identity",
    options: [
      { label: "Minimal Airy", description: "Space, restraint, and details that know when to speak.", tagline: "Room for the work to breathe." },
      { label: "Editorial", description: "A confident point of view with a little print-inspired polish.", tagline: "Make every page worth a second look." },
      { label: "Tech Dense", description: "Information-rich, precise, and built for curious minds.", tagline: "Complexity, with the controls in reach." },
      { label: "Cinematic", description: "Atmosphere, contrast, and a sense of forward motion.", tagline: "Give the next chapter an entrance." },
    ],
  },
];

export default function AlchemyPuzzle({ attempt, busy }: PuzzleBodyProps) {
  const [stage, setStage] = useState(0);
  const [choices, setChoices] = useState<ForgeChoice[]>([]);
  const identityReady = choices.length === STAGES.length;
  const [artifact, personality, superpower, style] = choices;

  function choose(option: ForgeChoice) {
    setChoices((current) => [...current, option]);
    setStage((current) => current + 1);
  }

  return (
    <div className="space-y-5">
      {!identityReady ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-lg font-semibold">
              {STAGES[stage].title}
            </p>
            <p className="font-mono text-xs text-subtle-foreground">
              {stage + 1} / {STAGES.length}
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {STAGES[stage].options.map((option) => (
              <button
                key={option.label}
                type="button"
                disabled={busy}
                onClick={() => choose(option)}
                className="min-h-16 rounded-xl border border-border-strong bg-surface p-4 text-left transition hover:border-primary hover:bg-surface-2"
              >
                <span className="block font-medium">{option.label}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="space-y-4 rounded-2xl border border-border-strong bg-surface p-5 sm:p-6">
          <p className="text-caption">Identity forged</p>
          <h3 className="font-display text-3xl font-semibold text-gradient-ion">
            The {artifact.titleWord} {personality.label}
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {artifact.description} {personality.description}{" "}
            {superpower.description}
          </p>
          <dl className="grid gap-3 border-y border-border py-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wide text-subtle-foreground">
                Artifact
              </dt>
              <dd className="mt-1 font-medium">{artifact.label}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-subtle-foreground">
                Superpower
              </dt>
              <dd className="mt-1 font-medium">{superpower.label}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-subtle-foreground">
                Visual identity
              </dt>
              <dd className="mt-1 font-medium">{style.label}</dd>
            </div>
          </dl>
          <p className="font-display text-base italic text-accent">
            {style.tagline}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="btn btn-ion flex-1"
              disabled={busy}
              onClick={() => void attempt("forged")}
            >
              Seal identity · claim digit
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={busy}
              onClick={() => {
                setChoices([]);
                setStage(0);
              }}
            >
              Reforge
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
