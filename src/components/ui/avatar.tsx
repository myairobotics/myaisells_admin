type AvatarProps = {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'rounded';
  gradient?: string;
};

const SIZE = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-14 w-14 text-xl',
  xl: 'h-20 w-20 text-2xl',
};

const SHAPE = {
  circle: 'rounded-full',
  rounded: 'rounded-xl',
};

export function Avatar({
  name,
  size = 'md',
  shape = 'circle',
  gradient = 'from-primary-500 to-primary-700',
}: AvatarProps) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? '';
  const last = parts.length >= 2 ? (parts[parts.length - 1] ?? '') : '';
  const initials = last
    ? `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    : (first.slice(0, 2) || name.slice(0, 2)).toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-linear-to-br font-bold text-white ${SIZE[size]} ${SHAPE[shape]} ${gradient}`}
    >
      {initials || '?'}
    </div>
  );
}
