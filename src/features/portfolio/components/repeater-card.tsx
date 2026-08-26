"use client";

export function RepeaterCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-panel space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-label">{title}</h4>
        <button
          type="button"
          onClick={onRemove}
          className="text-small text-error/80 hover:text-error"
        >
          Remove
        </button>
      </div>
      {children}
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-small border-primary/25 text-primary hover:bg-gradient-ion-soft w-full rounded-lg border border-dashed py-2.5 font-medium transition-colors"
    >
      + {label}
    </button>
  );
}
