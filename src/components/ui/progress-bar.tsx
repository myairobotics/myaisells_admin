type ProgressBarProps = {
  value: number;
  colorized?: boolean;
  barWidth?: string;
};

export function ProgressBar({ value, colorized = false, barWidth = 'w-16' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const barColor = colorized
    ? clamped >= 75 ? 'bg-emerald-500' : clamped >= 40 ? 'bg-amber-500' : 'bg-red-400'
    : 'bg-primary-500';

  return (
    <div className="flex items-center gap-2">
      <div className={`h-1.5 ${barWidth} overflow-hidden rounded-full bg-slate-200`}>
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${clamped}%` }} />
      </div>
      <span className="text-xs font-medium text-slate-500">
        {clamped}
        %
      </span>
    </div>
  );
}
