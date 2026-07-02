import type { ComponentType, SVGAttributes } from 'react';

type InfoFieldProps = {
  icon: ComponentType<SVGAttributes<SVGElement> & { className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
};

export function InfoField({ icon: Icon, label, value, mono = false }: InfoFieldProps) {
  return (
    <div className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3.5 transition-colors hover:bg-slate-50">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/60">
        <Icon className="h-3.5 w-3.5 text-slate-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">{label}</p>
        <p className={`mt-0.5 text-sm font-semibold break-all text-slate-800 ${mono ? 'font-mono' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
