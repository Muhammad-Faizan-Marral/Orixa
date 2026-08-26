"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { generateAiContent } from "@/actions/portfolio/generate-ai-content";
import type { AiAssistField } from "@/lib/ai/generate-content";
import { Button } from "@/components/UI/Button";

export function AiAssistButton({
  portfolioId,
  field,
  currentText,
  context,
  onAccept,
  label = "Improve with AI",
}: {
  portfolioId: string;
  field: AiAssistField;
  currentText: string;
  context?: string;
  onAccept: (text: string) => void;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleGenerate() {
    setError(null);
    setResult(null);

    startTransition(async () => {
      const response = await generateAiContent({
        portfolioId,
        field,
        currentText,
        context,
      });

      if (!response.success) {
        setError(response.message);
        return;
      }

      setResult(response.data.text);
    });
  }

  function handleAccept() {
    if (result) onAccept(result);
    setResult(null);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-ion-soft border border-primary/25 px-2.5 py-1 text-xs font-medium text-primary transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-ion text-[0.55rem] text-white">
          AI
        </span>
        {isPending ? "Thinking..." : label}
      </button>

      <AnimatePresence>
        {(result || error) && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 overflow-hidden"
          >
            {error && (
              <p className="rounded-lg border border-error/20 bg-error/10 px-3 py-2 text-xs text-error">
                {error}
              </p>
            )}

            {result && (
              <div className="border-gradient-ion space-y-2.5 rounded-lg p-3">
                <p className="text-caption text-accent">AI suggestion</p>
                <p className="text-body text-foreground">{result}</p>
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant="gradient" onClick={handleAccept}>
                    Use this
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setResult(null)}>
                    Discard
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
