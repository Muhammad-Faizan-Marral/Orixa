import { cn } from "@/lib/utils";

export function FormAlert({
  variant = "error",
  children,
}: {
  variant?: "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <p
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm",
        variant === "error" && "border-error/20 bg-error/10 text-error",
        variant === "success" && "border-success/20 bg-success/10 text-success"
      )}
    >
      {children}
    </p>
  );
}
