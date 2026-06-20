'use client';

import { FiRefreshCw } from 'react-icons/fi';
import { useGetDashboardOverviewQuery } from '@/services';

export function DashboardRefreshButton() {
  const { isFetching, refetch } = useGetDashboardOverviewQuery();

  return (
    <button
      type="button"
      onClick={() => refetch()}
      disabled={isFetching}
      className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/20 px-4 py-2.5 text-sm font-bold text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/30 disabled:opacity-70"
    >
      <FiRefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
      Refresh
    </button>
  );
}
