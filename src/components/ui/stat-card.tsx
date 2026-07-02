import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: number | string;
  icon: ReactNode;
  iconBg?: string;
  valueColor?: string;
};

export function StatCard({ label, value, icon, iconBg = 'bg-slate-100 text-slate-600', valueColor = 'text-slate-800' }: StatCardProps) {
  const display = typeof value === 'number' ? value.toLocaleString() : value;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className={`text-2xl font-bold ${valueColor}`}>{display}</p>
      </div>
    </div>
  );
}
