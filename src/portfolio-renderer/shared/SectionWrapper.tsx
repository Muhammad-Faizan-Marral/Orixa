import { cn } from "@/lib/utils";
import { Container } from "./Container";
import type { DesignDna } from "../types";
import { getDnaSectionPy } from "../theme";

type SectionWrapperProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
  /** full-bleed = no container max-width constraint */
  fullBleed?: boolean;
  /** override DNA spacing */
  spacing?: "tight" | "normal" | "loose";
  designDna?: DesignDna;
};

export function SectionWrapper({
  id,
  className,
  children,
  maxWidthClass = "max-w-5xl",
  fullBleed = false,
  spacing,
  designDna,
}: SectionWrapperProps) {
  const dnaPy = getDnaSectionPy(designDna);

  const spacingClass =
    spacing === "tight"
      ? "py-12 sm:py-16"
      : spacing === "loose"
        ? "py-24 sm:py-32"
        : dnaPy || "py-16 sm:py-20";

  return (
    <section id={id} className={cn(spacingClass, className)}>
      {fullBleed ? (
        children
      ) : (
        <Container className={maxWidthClass}>{children}</Container>
      )}
    </section>
  );
}
