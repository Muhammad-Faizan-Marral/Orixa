export default function DigitRail({ digits, size = "md" }: { digits: (string | null)[]; size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-8 w-7 text-base" : "h-11 w-9 text-xl";
  return (
    <ol aria-label="Collected code digits" className="flex items-center gap-1.5">
      {digits.map((d, i) => (
        <li key={i} aria-label={d ? `Digit ${i + 1}: ${d}` : `Digit ${i + 1}: not found yet`}
          className={`flex ${box} items-center justify-center rounded-md font-mono font-bold ${
            d ? "border-gradient-ion text-gradient-ion shadow-glow-primary" : "border border-dashed border-border-strong text-border-strong"}`}>
          <span aria-hidden="true" className={d ? "text-gradient-ion" : ""}>{d ?? "·"}</span>
        </li>
      ))}
    </ol>
  );
}
