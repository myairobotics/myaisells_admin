import type { ReactElement, ReactNode } from 'react';

type PageHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactElement;
  actions?: ReactNode;
  gradient?: string;
};

export function PageHeader({ title, subtitle, icon, actions, gradient = 'from-primary-600 via-primary-500 to-primary-600' }: PageHeaderProps) {
  return (
    <div className={`relative mb-6 overflow-hidden rounded-2xl bg-linear-to-r ${gradient}`}>
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
      <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-black/10 blur-2xl" />

      <div className="relative flex flex-col justify-between gap-4 px-6 py-7 md:px-8 lg:flex-row lg:items-center">
        {/* Left: icon + text */}
        <div className="flex items-center gap-4">
          {icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <span className="text-2xl text-white">{icon}</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">{title}</h1>
            {subtitle && (
              <p className="mt-0.5 text-sm font-medium text-white/75">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: actions */}
        {actions && (
          <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
