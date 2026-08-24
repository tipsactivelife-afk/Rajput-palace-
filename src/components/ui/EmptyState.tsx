import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-stone bg-white/60 px-6 py-14 text-center">
      <h3 className="font-display text-xl text-charcoal">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm text-charcoal-soft max-w-md mx-auto">{description}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

