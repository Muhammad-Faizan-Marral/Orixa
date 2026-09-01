import { cn } from "@/lib/utils";
import { Container } from "./Container";

export function SectionWrapper({
  id,
  className,
  children,
  maxWidthClass = "max-w-5xl",
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-20", className)}>
      <Container className={maxWidthClass}>{children}</Container>
    </section>
  );
}
