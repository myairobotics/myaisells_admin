import type { ReactNode } from 'react';

type BadgeVariant = 'pill' | 'rounded';

type BadgeProps = {
  children: ReactNode;
  className?: string;
  variant?: BadgeVariant;
  dot?: string;
  icon?: ReactNode;
};

export function Badge({ children, className = '', variant = 'pill', dot, icon }: BadgeProps) {
  const shape = variant === 'pill' ? 'rounded-full' : 'rounded-md';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold ${shape} ${className}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
      {icon}
      {children}
    </span>
  );
}
