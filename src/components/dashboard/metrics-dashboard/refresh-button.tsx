'use client';

import { FiRefreshCw } from 'react-icons/fi';
import {
  useGetDashboardGrowthQuery,
  useGetDashboardLeaderboardsQuery,
  useGetDashboardOverviewQuery,
  useGetDashboardSupportActivityQuery,
} from '@/services';

export function DashboardRefreshButton() {
  const { isFetching: overviewFetching, refetch: refetchOverview } = useGetDashboardOverviewQuery();
  const { isFetching: leaderboardsFetching, refetch: refetchLeaderboards } = useGetDashboardLeaderboardsQuery();
  const { isFetching: growthFetching, refetch: refetchGrowth } = useGetDashboardGrowthQuery();
  const { isFetching: supportFetching, refetch: refetchSupport } = useGetDashboardSupportActivityQuery();

  const isFetching = overviewFetching || leaderboardsFetching || growthFetching || supportFetching;

  const handleRefresh = () => {
    refetchOverview();
    refetchLeaderboards();
    refetchGrowth();
    refetchSupport();
  };

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isFetching}
      className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/20 px-4 py-2.5 text-sm font-bold text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/30 disabled:opacity-70"
    >
      <FiRefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
      Refresh
    </button>
  );
}
