import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: string;
};

export function Card({ children, className = '', padding = 'p-4' }: CardProps) {
  return (
    <div className={`rounded-xl border border-slate-200/60 bg-white shadow-sm ${padding} ${className}`}>
      {children}
    </div>
  );
}
