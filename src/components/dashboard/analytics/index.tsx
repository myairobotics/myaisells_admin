'use client';

import type { AnalyticsDataPoint, AnalyticsPeriod } from '@/types';
import { useState } from 'react';
import {
  FiActivity,
  FiBarChart2,
  FiRefreshCw,
  FiTrendingDown,
  FiTrendingUp,
  FiUserPlus,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import { PageHeader } from '@/components/global/page-header';
import { useGetAnalyticsOverviewQuery } from '@/services';

/* ─── SVG sparkline ───────────────────────────────────────────────── */

function SparkLine({
  data,
  color = '#14b8a6',
  fill = false,
  height = 48,
  width = 120,
}: {
  data: number[];
  color?: string;
  fill?: boolean;
  height?: number;
  width?: number;
}) {
  if (!data.length) {
    return null;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);
  const pts = data.map((v, i) => ({
    x: i * step,
    y: height - ((v - min) / range) * height * 0.85 - height * 0.05,
  }));
  const first = pts[0];
  const last = pts[pts.length - 1];
  if (!first || !last) {
    return null;
  }
  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  const fillPath = `M${first.x},${height} L${polyline} L${last.x},${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {fill && (
        <path d={fillPath} fill={color} fillOpacity={0.12} />
      )}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last.x} cy={last.y} r={2.5} fill={color} />
    </svg>
  );
}

/* ─── Bar chart ───────────────────────────────────────────────────── */

function BarChart({
  data,
  color = '#14b8a6',
  height = 80,
}: {
  data: AnalyticsDataPoint[];
  color?: string;
  height?: number;
}) {
  if (!data.length) {
    return <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />;
  }
  const values = data.map(d => d.value);
  const max = Math.max(...values) || 1;
  return (
    <div className="flex h-full w-full items-end gap-1" style={{ height }}>
      {data.map((d, i) => (
        <div
          key={d.date}
          title={`${d.date}: ${d.value.toLocaleString()}`}
          className="flex-1 rounded-t transition-all hover:opacity-80"
          style={{
            height: `${Math.max(4, (d.value / max) * 100)}%`,
            backgroundColor: color,
            opacity: 0.75 + (i / data.length) * 0.25,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────── */

function formatCurrency(n: number) {
  if (n >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `$${(n / 1_000).toFixed(1)}K`;
  }
  return `$${n.toLocaleString()}`;
}

function formatNumber(n: number) {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1)}K`;
  }
  return n.toLocaleString();
}

/* ─── Skeleton ────────────────────────────────────────────────────── */

function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
      <div className="mb-3 h-3 w-24 rounded bg-slate-200" />
      <div className="mb-2 h-8 w-32 rounded bg-slate-200" />
      <div className="h-3 w-16 rounded bg-slate-200" />
    </div>
  );
}

/* ─── Period selector ─────────────────────────────────────────────── */

const PERIODS: { value: AnalyticsPeriod; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: '1y', label: '1 year' },
];

/* ─── Main component ──────────────────────────────────────────────── */

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d');

  const { data, isLoading, isFetching, refetch } = useGetAnalyticsOverviewQuery({ period });

  const summary = data?.data?.summary;
  const trends = data?.data?.trends;

  const statCards = summary
    ? [
        {
          label: 'Total Revenue',
          value: formatCurrency(summary.total_revenue),
          sub: `MRR ${formatCurrency(summary.mrr)}`,
          icon: <FiTrendingUp />,
          iconBg: 'bg-teal-100 text-teal-600',
          color: 'text-teal-700',
          sparkData: trends?.revenue.map(d => d.value) ?? [],
          sparkColor: '#14b8a6',
        },
        {
          label: 'ARR',
          value: formatCurrency(summary.arr),
          sub: 'Annual recurring',
          icon: <FiActivity />,
          iconBg: 'bg-cyan-100 text-cyan-600',
          color: 'text-cyan-700',
          sparkData: trends?.revenue.map(d => d.value) ?? [],
          sparkColor: '#0891b2',
        },
        {
          label: 'Active Subscriptions',
          value: formatNumber(summary.active_subscriptions),
          sub: `${summary.churned_subscriptions.toLocaleString()} churned`,
          icon: <FiZap />,
          iconBg: 'bg-violet-100 text-violet-600',
          color: 'text-violet-700',
          sparkData: trends?.subscriptions.map(d => d.value) ?? [],
          sparkColor: '#7c3aed',
        },
        {
          label: 'New Businesses',
          value: formatNumber(summary.new_businesses),
          sub: 'This period',
          icon: <FiBarChart2 />,
          iconBg: 'bg-orange-100 text-orange-600',
          color: 'text-orange-700',
          sparkData: trends?.businesses.map(d => d.value) ?? [],
          sparkColor: '#ea580c',
        },
        {
          label: 'New Users',
          value: formatNumber(summary.new_users),
          sub: 'This period',
          icon: <FiUserPlus />,
          iconBg: 'bg-blue-100 text-blue-600',
          color: 'text-blue-700',
          sparkData: trends?.users.map(d => d.value) ?? [],
          sparkColor: '#2563eb',
        },
        {
          label: 'Tokens Consumed',
          value: formatNumber(summary.total_tokens_consumed),
          sub: 'Platform-wide',
          icon: <FiUsers />,
          iconBg: 'bg-rose-100 text-rose-600',
          color: 'text-rose-700',
          sparkData: [] as number[],
          sparkColor: '#e11d48',
        },
      ]
    : null;

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Analytics"
        subtitle="Platform-wide performance, revenue, and growth metrics"
        icon={<FiBarChart2 />}
        actions={(
          <div className="flex items-center gap-2">
            {/* Period filter */}
            <div className="flex gap-1 rounded-xl border border-white/25 bg-white/15 p-1 backdrop-blur-sm">
              {PERIODS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPeriod(p.value)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                    period === p.value
                      ? 'bg-white text-teal-700 shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25 disabled:opacity-60"
            >
              <FiRefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        )}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => `skel-${i}`).map(key => <StatCardSkeleton key={key} />)
          : (statCards ?? []).map(card => (
              <div key={card.label} className="flex items-start justify-between rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconBg}`}>
                      <span className="text-base">{card.icon}</span>
                    </div>
                    <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{card.label}</p>
                  </div>
                  <p className={`mt-2 text-3xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
                </div>
                {card.sparkData.length > 1 && (
                  <div className="mt-1 ml-4 shrink-0">
                    <SparkLine data={card.sparkData} color={card.sparkColor} fill height={48} width={80} />
                  </div>
                )}
              </div>
            ))}
      </div>

      {/* Trend charts row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Revenue trend */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Revenue Trend</p>
              <p className="text-xs text-slate-400">
                {period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : period === '90d' ? 'Last 90 days' : 'Last 12 months'}
              </p>
            </div>
            <FiTrendingUp className="h-5 w-5 text-teal-500" />
          </div>
          {isLoading
            ? <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />
            : (
                <div className="h-20">
                  <BarChart data={trends?.revenue ?? []} color="#14b8a6" height={80} />
                </div>
              )}
          {!isLoading && trends?.revenue && trends.revenue.length > 0 && (
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{trends.revenue[0]?.date}</span>
              <span>{trends.revenue[trends.revenue.length - 1]?.date}</span>
            </div>
          )}
        </div>

        {/* User growth */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">User Growth</p>
              <p className="text-xs text-slate-400">New registrations over time</p>
            </div>
            <FiUserPlus className="h-5 w-5 text-blue-500" />
          </div>
          {isLoading
            ? <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />
            : (
                <div className="h-20">
                  <BarChart data={trends?.users ?? []} color="#2563eb" height={80} />
                </div>
              )}
          {!isLoading && trends?.users && trends.users.length > 0 && (
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{trends.users[0]?.date}</span>
              <span>{trends.users[trends.users.length - 1]?.date}</span>
            </div>
          )}
        </div>

        {/* Business onboarding */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Business Onboarding</p>
              <p className="text-xs text-slate-400">New businesses over time</p>
            </div>
            <FiBarChart2 className="h-5 w-5 text-orange-500" />
          </div>
          {isLoading
            ? <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />
            : (
                <div className="h-20">
                  <BarChart data={trends?.businesses ?? []} color="#ea580c" height={80} />
                </div>
              )}
          {!isLoading && trends?.businesses && trends.businesses.length > 0 && (
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{trends.businesses[0]?.date}</span>
              <span>{trends.businesses[trends.businesses.length - 1]?.date}</span>
            </div>
          )}
        </div>

        {/* Subscription changes */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">Subscription Growth</p>
              <p className="text-xs text-slate-400">Active subscriptions over time</p>
            </div>
            <FiActivity className="h-5 w-5 text-violet-500" />
          </div>
          {isLoading
            ? <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />
            : (
                <div className="h-20">
                  <BarChart data={trends?.subscriptions ?? []} color="#7c3aed" height={80} />
                </div>
              )}
          {!isLoading && trends?.subscriptions && trends.subscriptions.length > 0 && (
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{trends.subscriptions[0]?.date}</span>
              <span>{trends.subscriptions[trends.subscriptions.length - 1]?.date}</span>
            </div>
          )}
        </div>
      </div>

      {/* Churn insight */}
      {!isLoading && summary && (
        <div className="flex items-center gap-4 rounded-xl border border-rose-100 bg-rose-50 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100">
            <FiTrendingDown className="h-5 w-5 text-rose-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-700">Churn Alert</p>
            <p className="text-xs text-rose-500">
              {summary.churned_subscriptions.toLocaleString()}
              {' '}
              subscription
              {summary.churned_subscriptions !== 1 ? 's' : ''}
              {' '}
              churned this period —
              {' '}
              {summary.active_subscriptions > 0
                ? `${((summary.churned_subscriptions / (summary.active_subscriptions + summary.churned_subscriptions)) * 100).toFixed(1)}% churn rate`
                : 'no active subscriptions'}
            </p>
          </div>
          <p className="text-2xl font-bold text-rose-600">{summary.churned_subscriptions.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
