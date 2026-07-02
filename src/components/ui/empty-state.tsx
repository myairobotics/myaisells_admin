import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon: ReactNode;
  message: string;
  onClear?: () => void;
  clearLabel?: string;
};

export function EmptyState({ icon, message, onClear, clearLabel = 'Clear filters' }: EmptyStateProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3">
      <span className="text-slate-300 [&>svg]:h-12 [&>svg]:w-12">{icon}</span>
      <p className="text-slate-500">{message}</p>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-primary-600 hover:underline"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
}
