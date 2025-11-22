'use client';

import { AgCharts } from 'ag-charts-react';
import { useMemo } from 'react';
import { PiChartBar, PiCrown, PiTrendUp } from 'react-icons/pi';
import { Loader } from '@/components/ui';
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
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Plan Type' },
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Number of Users' },
      },
    ],
    legend: {
      enabled: true,
      position: 'bottom',
    },
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
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Month' },
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Number of Users' },
      },
    ],
    legend: {
      enabled: true,
      position: 'bottom',
    },
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
      {/* Header Section */}
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-linear-to-r from-primary-600 via-primary-500 to-primary-600" />
        <div className="absolute inset-0 bg-linear-to-br from-primary-400/30 to-transparent" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-300/20 blur-3xl" />

        <div className="relative flex flex-col justify-between space-y-4 px-6 py-8 md:px-8 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
              Subscription Analytics 💎
            </h1>
            <p className="text-base font-medium text-white/90 md:text-lg">
              Monitor user subscriptions and plan changes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 rounded-xl border-2 border-white/30 bg-white/20 px-5 py-3 shadow-lg backdrop-blur-sm">
              <PiCrown className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white">
                {totalUsers}
                {' '}
                Subscribers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 space-y-6 px-4 md:px-6">
        {isLoading
          ? (
              <div className="flex h-96 items-center justify-center">
                <Loader />
              </div>
            )
          : (
              <>
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
                    <div className="relative rounded-xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600">
                          <PiCrown className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Subscribers</p>
                          <p className="text-2xl font-bold text-slate-800">{totalUsers}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-green-50/30 to-emerald-50/20 blur-xl" />
                    <div className="relative rounded-xl border border-green-100/50 bg-white/80 p-6 shadow-xl shadow-green-500/5 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-green-500 to-emerald-600">
                          <PiTrendUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Upgrades</p>
                          <p className="text-2xl font-bold text-slate-800">{totalUpgrades}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-red-50/30 to-rose-50/20 blur-xl" />
                    <div className="relative rounded-xl border border-red-100/50 bg-white/80 p-6 shadow-xl shadow-red-500/5 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-red-500 to-rose-600">
                          <PiChartBar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Downgrades</p>
                          <p className="text-2xl font-bold text-slate-800">{totalDowngrades}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Plans Distribution */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
                  <div className="relative rounded-2xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-1 w-12 rounded-full bg-linear-to-r from-blue-500 to-indigo-500" />
                      <h2 className="bg-linear-to-r from-slate-800 to-blue-900 bg-clip-text font-inter text-xl font-bold text-transparent">
                        Users by Subscription Plan
                      </h2>
                    </div>
                    <AgCharts
                      options={subscriptionChartOptions}
                      style={{ width: '100%', height: '400px' }}
                    />
                  </div>
                </div>

                {/* Upgrades vs Downgrades Trend */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
                  <div className="relative rounded-2xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-1 w-12 rounded-full bg-linear-to-r from-blue-500 to-indigo-500" />
                      <h2 className="bg-linear-to-r from-slate-800 to-blue-900 bg-clip-text font-inter text-xl font-bold text-transparent">
                        Upgrades vs Downgrades Over Time
                      </h2>
                    </div>
                    <AgCharts
                      options={upgradesChartOptions}
                      style={{ width: '100%', height: '500px' }}
                    />
                  </div>
                </div>

                {/* Plan Breakdown Table */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
                  <div className="relative rounded-2xl border border-blue-100/50 bg-white/80 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-blue-100 bg-blue-50/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Plan</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Users</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Percentage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {Array.isArray(subscriptions) && subscriptions.map(plan => (
                            <tr key={plan.plan} className="transition-colors hover:bg-blue-50/30">
                              <td className="px-6 py-4">
                                <span className="font-semibold text-slate-800">{plan.plan}</span>
                              </td>
                              <td className="px-6 py-4 text-slate-600">{plan.count}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                                    <div
                                      className="h-full bg-linear-to-r from-blue-500 to-indigo-600"
                                      style={{ width: `${(plan.count / totalUsers) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-semibold text-slate-700">
                                    {((plan.count / totalUsers) * 100).toFixed(1)}
                                    %
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}
      </div>
    </div>
  );
}
