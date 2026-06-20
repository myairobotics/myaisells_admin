'use client';

import SkeletonLib, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  count?: number;
  borderRadius?: number | string;
  className?: string;
  inline?: boolean;
};

export function Skeleton(props: SkeletonProps) {
  return (
    <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e8edf5">
      <SkeletonLib {...props} />
    </SkeletonTheme>
  );
}

export function TableRowSkeleton({ cols = 4, rows = 6 }: { cols?: number; rows?: number }) {
  return (
    <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e8edf5">
      {Array.from({ length: rows }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <tr key={i} className="border-b border-slate-100 last:border-0">
          {Array.from({ length: cols }).map((_, j) => (
            // eslint-disable-next-line react/no-array-index-key
            <td key={j} className="px-5 py-3.5">
              <SkeletonLib height={16} borderRadius={6} />
            </td>
          ))}
        </tr>
      ))}
    </SkeletonTheme>
  );
}

export function StatCardSkeleton() {
  return (
    <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e8edf5">
      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between">
          <SkeletonLib width={44} height={44} borderRadius={12} />
          <SkeletonLib width={60} height={20} borderRadius={99} />
        </div>
        <SkeletonLib width={100} height={14} borderRadius={6} className="mb-1.5" />
        <SkeletonLib width={70} height={28} borderRadius={6} />
      </div>
    </SkeletonTheme>
  );
}

export function AuditStatSkeleton() {
  return (
    <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e8edf5">
      <div className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
        <SkeletonLib width={80} height={12} borderRadius={6} className="mb-2" />
        <SkeletonLib width={50} height={24} borderRadius={6} />
      </div>
    </SkeletonTheme>
  );
}
