export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10 space-y-2">
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
      )}
      <div
        className="h-1 w-12 rounded-full"
        style={{ background: "var(--pr-accent, #6c5cff)" }}
      />
    </div>
  );
}