import { cn } from "@/lib/utils";
import { Container } from "./Container";
import type { DesignDna } from "../types";
import { getDnaSectionPy, shellMaxWidthClass } from "../theme";

export type SectionShell = "bleed" | "wide" | "content" | "narrow" | "split";
export type SectionAlign = "start" | "center";

type SectionWrapperProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  /** @deprecated prefer `shell` */
  maxWidthClass?: string;
  /** @deprecated use shell="bleed" */
  fullBleed?: boolean;
  shell?: SectionShell;
  align?: SectionAlign;
  spacing?: "tight" | "normal" | "loose";
  designDna?: DesignDna;
  layout?: "standard" | "wide" | "centered";
};

export function SectionWrapper({
  id,
  className,
  children,
  maxWidthClass,
  fullBleed = false,
  shell: shellProp,
  align: alignProp,
  spacing,
  designDna,
  layout = "standard",
}: SectionWrapperProps) {
  const shell: SectionShell = shellProp ?? (fullBleed ? "bleed" : "content");

  const align: SectionAlign = alignProp ?? (layout === "centered" ? "center" : "start");

  const dnaPy = getDnaSectionPy(designDna);

  const spacingClass =spacing === "tight"? "py-12 sm:py-16": spacing === "loose"? "py-24 sm:py-32": dnaPy || "py-16 sm:py-20";

  if (shell === "bleed") {
    return (
      <section id={id} className={cn(spacingClass, className)}>
        {children}
      </section>
    );
  }

  const widthClass = maxWidthClass ?? shellMaxWidthClass(shell, layout);

  if (shell === "split") {
    return (
      <section id={id} className={cn(spacingClass, className)}>
        <Container
          align={align}
          className={cn(widthClass, "max-w-[var(--pr-rail-wide,80rem)]")}
        >
          {children}
        </Container>
      </section>
    );
  }

  return (
    <section id={id} className={cn(spacingClass, className)}>
      <Container align={align} className={widthClass}>
        {children}
      </Container>
    </section>
  );
}