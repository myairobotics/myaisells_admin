interface LoaderProps {
  size?: number;
  colorClass?: string;
  backgroundClass?: string;
}

export default function Loader({
  size = 32,
  colorClass = 'text-primary',
  backgroundClass = 'text-muted',
}: LoaderProps) {
  const radius = size / 2;
  const strokeWidth = 4;

  return (
    <div role="status" className="flex items-center justify-center">
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth}
          className={backgroundClass}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth}
          className={colorClass}
          strokeWidth={strokeWidth}
          strokeDasharray={2 * Math.PI * (radius - strokeWidth)}
          strokeDashoffset={1.5 * Math.PI * (radius - strokeWidth)}
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
