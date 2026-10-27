import SpotlightCard from "./SpotlightCard";
import ProgressLine from "./ProgressLine";
import CartridgeRelic from "./CartridgeRelic";

/** Server component: static HTML. Only ProgressLine, SpotlightCard and the relic ship JS. */

const STEPS = [
  {
    title: "Add your work",
    desc: "Upload your resume or add projects manually. AI does the heavy lifting.",
    offset: "",
  },
  {
    title: "Choose design",
    desc: "Pick a theme and customize sections until it feels like you.",
    offset: "md:mt-14",
  },
  {
    title: "Publish & share",
    desc: "Get a clean public link instantly. Share it anywhere.",
    offset: "md:mt-28",
  },
];

export default function WorkflowSection() {
  return (
    <section id="how" className="relative py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-5">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium tracking-wide text-muted-foreground">
            How it works
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
            From blank page to{" "}
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
              live portfolio
            </span>{" "}
            in minutes.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Three simple steps. No design degree. No code.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16 md:mt-20">
          {/* Horizontal line (desktop) */}
          <div
            className="absolute left-0 right-0 top-10 hidden h-px bg-border-strong/70 md:block"
            aria-hidden="true"
          />
          <ProgressLine />

          <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
            {STEPS.map((s, i) => (
              <li key={s.title} className={`relative ${s.offset}`}>
                <SpotlightCard className="relative h-full p-7 pt-14">
                  {/* Step number */}
                  <span
                    className="absolute -top-1 left-7 font-display text-5xl font-semibold tracking-tighter text-foreground/15 select-none"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    <span className="sr-only">Step {i + 1}: </span>
                    {s.title}
                  </h3>

                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>

                  {/* Secret relic only on the middle card */}
                  {i === 1 && <CartridgeRelic />}
                </SpotlightCard>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}