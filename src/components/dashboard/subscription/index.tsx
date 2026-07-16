'use client';

import { PageHeader, StatCardSkeleton, TableRowSkeleton } from '@myairobotics/ui';
import { AgCharts } from 'ag-charts-react';
import { useMemo } from 'react';
import { PiChartBar, PiCrown, PiTrendUp } from 'react-icons/pi';
import {
  useGetSubscriptionsMetricsQuery,
  useGetUpgradeOrDowngradeMetricsQuery,
} from '@/services';

type ChartOptions = Record<string, unknown>;

export default function Subscription() {
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useGetSubscriptionsMetricsQuery();
  const { data: upgradesData, isLoading: upgradesLoading } = useGetUpgradeOrDowngradeMetricsQuery();

  const subscriptions = subscriptionsData?.data;
  const upgrades = upgradesData?.data;

  const subscriptionChartOptions: ChartOptions = useMemo(() => ({
    data: Array.isArray(subscriptions) ? subscriptions : [],
    series: [
      {
        type: 'bar',
        xKey: 'plan',
        yKey: 'count',
        legendItemName: 'Users by Plan',
        fill: '#3b82f6',
      },
    ],
    axes: [
      { type: 'category', position: 'bottom', title: { text: 'Plan Type' } },
      { type: 'number', position: 'left', title: { text: 'Number of Users' } },
    ],
    legend: { enabled: true, position: 'bottom' },
  }), [subscriptions]);

  const upgradesChartOptions: ChartOptions = useMemo(() => ({
    data: Array.isArray(upgrades)
      ? upgrades.map(item => ({
          ...item,
          month: `${item.year}-${String(item.month).padStart(2, '0')}`,
        }))
      : [],
    series: [
      {
        type: 'line',
        xKey: 'month',
        yKey: 'upgraded',
        legendItemName: 'Upgrades',
        stroke: '#10b981',
        marker: { fill: '#10b981', stroke: '#10b981', size: 8 },
        strokeWidth: 3,
      },
      {
        type: 'line',
        xKey: 'month',
        yKey: 'downgraded',
        legendItemName: 'Downgrades',
        stroke: '#ef4444',
        marker: { fill: '#ef4444', stroke: '#ef4444', size: 8 },
        strokeWidth: 3,
      },
    ],
    axes: [
      { type: 'category', position: 'bottom', title: { text: 'Month' } },
      { type: 'number', position: 'left', title: { text: 'Number of Users' } },
    ],
    legend: { enabled: true, position: 'bottom' },
  }), [upgrades]);

  const totalUsers = useMemo(() => {
    if (!Array.isArray(subscriptions)) {
      return 0;
    }
    return subscriptions.reduce((sum, plan) => sum + plan.count, 0);
  }, [subscriptions]);

  const totalUpgrades = useMemo(() => {
    if (!Array.isArray(upgrades)) {
      return 0;
    }
    return upgrades.reduce((sum, item) => sum + item.upgraded, 0);
  }, [upgrades]);

  const totalDowngrades = useMemo(() => {
    if (!Array.isArray(upgrades)) {
      return 0;
    }
    return upgrades.reduce((sum, item) => sum + item.downgraded, 0);
  }, [upgrades]);

  const isLoading = subscriptionsLoading || upgradesLoading;

  return (
    <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Subscription Analytics"
        subtitle="Monitor user subscriptions and plan changes"
        icon={<PiCrown />}
        actions={(
          <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
            <PiCrown className="h-4 w-4" />
            {totalUsers}
            {' '}
            Subscribers
          </div>
        )}
      />

      <div className="flex-1 space-y-4">
        {isLoading
          ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {Array.from({ length: 3 }, (_, i) => `skel-${i}`).map(key => <StatCardSkeleton key={key} />)}
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
                  <table className="w-full text-sm">
                    <tbody>
                      <TableRowSkeleton cols={3} rows={6} />
                    </tbody>
                  </table>
                </div>
              </div>
            )
          : (
              <>
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                        <PiCrown className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Subscribers</p>
                        <p className="text-2xl font-bold text-slate-800">{totalUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <PiTrendUp className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Upgrades</p>
                        <p className="text-2xl font-bold text-slate-800">{totalUpgrades}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                        <PiChartBar className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Downgrades</p>
                        <p className="text-2xl font-bold text-slate-800">{totalDowngrades}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Plans Distribution */}
                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-base font-semibold text-slate-800">
                    Users by Subscription Plan
                  </h2>
                  <AgCharts options={subscriptionChartOptions} style={{ width: '100%', height: '400px' }} />
                </div>

                {/* Upgrades vs Downgrades Trend */}
                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-base font-semibold text-slate-800">
                    Upgrades vs Downgrades Over Time
                  </h2>
                  <AgCharts options={upgradesChartOptions} style={{ width: '100%', height: '400px' }} />
                </div>

                {/* Plan Breakdown Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
                  <table className="w-full">
                    <thead className="border-b border-slate-100 bg-slate-50/70">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Users</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Array.isArray(subscriptions) && subscriptions.map(plan => (
                        <tr key={plan.plan} className="transition-colors hover:bg-slate-50/70">
                          <td className="px-6 py-4">
                            <span className="font-semibold text-slate-800">{plan.plan}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{plan.count}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                                <div
                                  className="h-full bg-primary-500"
                                  style={{ width: `${totalUsers ? (plan.count / totalUsers) * 100 : 0}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-slate-700">
                                {totalUsers ? ((plan.count / totalUsers) * 100).toFixed(1) : 0}
                                %
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
      </div>
    </div>
  );
}
