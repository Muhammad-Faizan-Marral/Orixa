import { resolveModel, type SectionProps } from "../shared/model";

/** Footer: credits + watermark (free plan). Variants: "default" (right-bottom), "alt" (centered). */
export function Footer(props: SectionProps) {
  const model = resolveModel(props);
  const { name, showWatermark } = model.footer;
  const alt = props.variant === "alt";
  return (
    <footer
      className={`pointer-events-none fixed inset-x-0 bottom-4 z-20 hidden px-6 md:flex ${alt ? "justify-center" : "justify-end"}`}
    >
      <p className="cin-glass-pill cin-mono pointer-events-auto rounded-full px-4 py-1.5 text-[11px] tracking-wide text-white/70">
        © {new Date().getUTCFullYear()} {name}
        {showWatermark && (
          <>
            <span className="mx-2 opacity-40">|</span>
            <a
              href="https://orixa.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition hover:text-[var(--cin-accent)]"
            >
              Built with Orixa ↗
            </a>
          </>
        )}
      </p>
    </footer>
  );
}
