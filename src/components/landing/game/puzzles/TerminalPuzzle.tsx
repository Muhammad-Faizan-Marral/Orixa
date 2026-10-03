"use client";
import { useEffect, useRef, useState } from "react";
import { TERMINAL_FILES } from "@/lib/game/config";
import type { PuzzleBodyProps } from "./types";

const HELP = "commands: help  ls  cat <file>  whoami  clear  submit <number>";

export default function TerminalPuzzle({ attempt, busy }: PuzzleBodyProps) {
  const [lines, setLines] = useState<string[]>(["ORIXA-OS v0.1 booted.", HELP]);
  const [input, setInput] = useState("");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight }); }, [lines]);

  async function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    const [name, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");
    const echo = `> ${cmd}`;
    switch (name.toLowerCase()) {
      case "help": return setLines((l) => [...l, echo, HELP]);
      case "ls": return setLines((l) => [...l, echo, Object.keys(TERMINAL_FILES).join("  ")]);
      case "whoami": return setLines((l) => [...l, echo, "visitor (curious)"]);
      case "clear": return setLines([]);
      case "sudo": return setLines((l) => [...l, echo, "nice try. you are not in the sudoers file. this incident will be reported (to nobody)."]);
      case "cat": {
        const f = TERMINAL_FILES[arg];
        return setLines((l) => [...l, echo, ...(f ? f.split("\n") : [`cat: ${arg || "?"}: no such file`])]);
      }
      case "submit": {
        if (!/^\d$/.test(arg)) return setLines((l) => [...l, echo, "usage: submit <single digit>"]);
        setLines((l) => [...l, echo, "checking…"]);
        const r = await attempt(arg);
        return setLines((l) => [...l, r === "correct" ? "ACCESS GRANTED" : r === "wrong" ? "ACCESS DENIED" : r === "error" ? "connection lost. no life lost." : "busy"]);
      }
      default: return setLines((l) => [...l, echo, `${name}: command not found`]);
    }
  }

  return (
    <div className="space-y-3">
      <div ref={box} role="log" aria-label="Terminal output" tabIndex={0}
        className="h-56 overflow-y-auto rounded-xl border border-border-strong bg-background p-3 font-mono text-[0.8rem] leading-6 text-success">
        {lines.map((l, i) => <p key={i} className="whitespace-pre-wrap break-words">{l}</p>)}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-border-strong bg-surface px-3">
        <span className="font-mono text-accent" aria-hidden="true">&gt;</span>
        <label className="sr-only" htmlFor="term-input">Terminal command</label>
        <input id="term-input" value={input} disabled={busy} autoComplete="off" autoCapitalize="off" spellCheck={false} autoFocus
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { const v = input; setInput(""); void run(v); } }}
          className="min-h-12 min-w-0 flex-1 bg-transparent font-mono text-sm outline-none" placeholder="type help" />
      </div>
    </div>
  );
}
