'use client';

import type {
  GetAppointmentMetricsResponse,
  GetCampaignConversationMetricsResponse,
  GetCampaignsMetricsResponse,
  GetSubscriptionMetricResponse,
  GetUpgradeOrDowngradeMetricsResponse,
  GetUserCountMetricsResponse,
  GetUsersByCountryResponse,
} from '@/types';
import { AgCharts } from 'ag-charts-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { MetricCard } from '@/components/global/metric-card';
import { Loader, Select } from '@/components/ui';
import {
  useLazyGetAppointmentMetricsQuery,
  useLazyGetCampaignConversationMetricsQuery,
  useLazyGetCampaignsMetricsQuery,
  useLazyGetSubscriptionsMetricsQuery,
  useLazyGetUpgradeOrDowngradeMetricsQuery,
  useLazyGetUserCountMetricsQuery,
  useLazyGetUsersByCountryQuery,
} from '@/services';

type MetricKey
  = | 'Number of Registered Users'
    | 'Number of Users by Country'
    | 'Number of Verified / Active users'
    | 'Number of Users by Plan'
    | 'Number of Different Campaign Types Created'
    | 'Number of Upgrades / Downgrades'
    | 'Number of Appointments Booked'
    | 'Number of Conversations';

type MetricToResponse = {
  'Number of Registered Users': GetUserCountMetricsResponse;
  'Number of Users by Country': GetUsersByCountryResponse;
  'Number of Verified / Active users': GetUserCountMetricsResponse;
  'Number of Users by Plan': GetSubscriptionMetricResponse;
  'Number of Different Campaign Types Created': GetCampaignsMetricsResponse;
  'Number of Upgrades / Downgrades': GetUpgradeOrDowngradeMetricsResponse;
  'Number of Appointments Booked': GetAppointmentMetricsResponse;
  'Number of Conversations': GetCampaignConversationMetricsResponse;
};

type MetricDataFor<K extends MetricKey>
  = MetricToResponse[K] extends { data: infer D } ? D : never;

type ChartOptions = Record<string, unknown>;

const baseLegend = {
  enabled: true,
  position: 'bottom',
} as const;

const chartConfigFactory = (): Record<MetricKey, ChartOptions> => ({
  'Number of Verified / Active users': {
    data: [],
    series: [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'unverified',
        legendItemName: 'Unverified',
        stroke: '#ef4444',
        marker: { fill: '#ef4444', stroke: '#ef4444' },
      },
      {
        type: 'line',
        xKey: 'date',
        yKey: 'verified',
        legendItemName: 'Verified',
        stroke: '#3b82f6',
        marker: { fill: '#3b82f6', stroke: '#3b82f6' },
      },
    ],
    legend: baseLegend,
    axes: [
      { type: 'category', position: 'bottom' },
      { type: 'number', position: 'left' },
    ],
  },
  'Number of Registered Users': {
    type: 'card',
    data: [],
  },
  'Number of Users by Country': {
    data: [],
    series: [{
      type: 'pie',
      angleKey: 'count',
      labelKey: 'country',
      fills: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c026d3'],
    }],
    legend: baseLegend,
  },
  'Number of Users by Plan': {
    data: [],
    series: [
      {
        type: 'bar',
        xKey: 'plan',
        yKey: 'count',
        legendItemName: 'Users',
        fill: '#3b82f6',
      },
    ],
    axes: [
      { type: 'category', position: 'bottom' },
      { type: 'number', position: 'left' },
    ],
    legend: baseLegend,
  },
  'Number of Different Campaign Types Created': {
    data: [],
    series: [
      {
        type: 'bar',
        xKey: 'date',
        yKey: 'outreach',
        legendItemName: 'Outreach',
        fill: '#3b82f6',
      },
      {
        type: 'bar',
        xKey: 'date',
        yKey: 'sales',
        legendItemName: 'Sales',
        fill: '#6366f1',
      },
    ],
    axes: [
      { type: 'category', position: 'bottom' },
      { type: 'number', position: 'left' },
    ],
    legend: baseLegend,
  },
  'Number of Upgrades / Downgrades': {
    data: [],
    series: [
      {
        type: 'line',
        xKey: 'month',
        yKey: 'upgraded',
        legendItemName: 'Upgrades',
        stroke: '#10b981',
        marker: { fill: '#10b981', stroke: '#10b981' },
      },
      {
        type: 'line',
        xKey: 'month',
        yKey: 'downgraded',
        legendItemName: 'Downgrades',
        stroke: '#ef4444',
        marker: { fill: '#ef4444', stroke: '#ef4444' },
      },
    ],
    axes: [
      { type: 'category', position: 'bottom' },
      { type: 'number', position: 'left' },
    ],
    legend: baseLegend,
  },
  'Number of Appointments Booked': {
    data: [],
    series: [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'count',
        legendItemName: 'Appointments',
        stroke: '#3b82f6',
        marker: { fill: '#3b82f6', stroke: '#3b82f6' },
      },
    ],
    axes: [
      { type: 'category', position: 'bottom' },
      { type: 'number', position: 'left' },
    ],
    legend: baseLegend,
  },
  'Number of Conversations': {
    data: [],
    series: [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'web_agents',
        legendItemName: 'Web Agents',
        stroke: '#3b82f6',
        marker: { fill: '#3b82f6', stroke: '#3b82f6' },
      },
      {
        type: 'line',
        xKey: 'date',
        yKey: 'web_agent_chat',
        legendItemName: 'Agent Chat',
        stroke: '#6366f1',
        marker: { fill: '#6366f1', stroke: '#6366f1' },
      },
      {
        type: 'line',
        xKey: 'date',
        yKey: 'outreach',
        legendItemName: 'Outreach',
        stroke: '#8b5cf6',
        marker: { fill: '#8b5cf6', stroke: '#8b5cf6' },
      },
      {
        type: 'line',
        xKey: 'date',
        yKey: 'sales',
        legendItemName: 'Sales',
        stroke: '#a855f7',
        marker: { fill: '#a855f7', stroke: '#a855f7' },
      },
    ],
    axes: [
      { type: 'category', position: 'bottom' },
      { type: 'number', position: 'left' },
    ],
    legend: baseLegend,
  },
});

function extractDataForMetric<K extends MetricKey>(
  metric: K,
  data: MetricDataFor<K>,
) {
  switch (metric) {
    case 'Number of Registered Users':
      return (data as unknown as { totalUsers?: number }).totalUsers ?? 0;
    case 'Number of Users by Country':
      return data as MetricDataFor<'Number of Users by Country'>;
    case 'Number of Users by Plan':
      return data as MetricDataFor<'Number of Users by Plan'>;
    case 'Number of Verified / Active users':
      return (data as unknown as { dailyCounts?: unknown }).dailyCounts ?? [];
    case 'Number of Different Campaign Types Created':
      return (data as unknown as { dailyCounts?: unknown }).dailyCounts ?? [];
    case 'Number of Upgrades / Downgrades':
      return data as MetricDataFor<'Number of Upgrades / Downgrades'>;
    case 'Number of Appointments Booked':
      return (
        (data as unknown as { dailyAppointments?: unknown }).dailyAppointments
        ?? []
      );
    case 'Number of Conversations':
      return (data as unknown as { dailyCounts?: unknown }).dailyCounts ?? [];
    default:
      return [];
  }
}

export default function MetricsDashboard() {
  const [loading, setLoading] = useState(false);
  const [metric, setMetric] = useState<MetricKey>(
    'Number of Verified / Active users',
  );
  const [options, setOptions] = useState(() => chartConfigFactory());

  const [rawTriggerGetUserCount] = useLazyGetUserCountMetricsQuery();
  const [rawTriggerGetUsersByCountry] = useLazyGetUsersByCountryQuery();
  const [rawTriggerGetSubscriptions] = useLazyGetSubscriptionsMetricsQuery();
  const [rawTriggerGetCampaigns] = useLazyGetCampaignsMetricsQuery();
  const [rawTriggerGetConversationMetrics]
    = useLazyGetCampaignConversationMetricsQuery();
  const [rawTriggerGetAppointments] = useLazyGetAppointmentMetricsQuery();
  const [rawTriggerGetUpgradesDowngrades]
    = useLazyGetUpgradeOrDowngradeMetricsQuery();

  const triggerGetUserCount = useCallback(
    async (...args: unknown[]) => {
      const res = await (
        rawTriggerGetUserCount as (...a: unknown[]) => Promise<unknown>
      )(...args);
      if (res && typeof res === 'object' && 'data' in (res as object)) {
        return (res as { data: MetricDataFor<'Number of Registered Users'> })
          .data;
      }
      return res as MetricDataFor<'Number of Registered Users'>;
    },
    [rawTriggerGetUserCount],
  );

  const triggerGetUsersByCountry = useCallback(
    async (...args: unknown[]) => {
      const res = await (
        rawTriggerGetUsersByCountry as (...a: unknown[]) => Promise<unknown>
      )(...args);
      if (res && typeof res === 'object' && 'data' in (res as object)) {
        return (res as { data: MetricDataFor<'Number of Users by Country'> })
          .data;
      }
      return res as MetricDataFor<'Number of Users by Country'>;
    },
    [rawTriggerGetUsersByCountry],
  );

  const triggerGetSubscriptions = useCallback(
    async (...args: unknown[]) => {
      const res = await (
        rawTriggerGetSubscriptions as (...a: unknown[]) => Promise<unknown>
      )(...args);
      if (res && typeof res === 'object' && 'data' in (res as object)) {
        return (res as { data: MetricDataFor<'Number of Users by Plan'> }).data;
      }
      return res as MetricDataFor<'Number of Users by Plan'>;
    },
    [rawTriggerGetSubscriptions],
  );

  const triggerGetCampaigns = useCallback(
    async (...args: unknown[]) => {
      const res = await (
        rawTriggerGetCampaigns as (...a: unknown[]) => Promise<unknown>
      )(...args);
      if (res && typeof res === 'object' && 'data' in (res as object)) {
        return (res as {
          data: MetricDataFor<'Number of Different Campaign Types Created'>;
        }).data;
      }
      return res as MetricDataFor<'Number of Different Campaign Types Created'>;
    },
    [rawTriggerGetCampaigns],
  );

  const triggerGetConversationMetrics = useCallback(
    async (...args: unknown[]) => {
      const res = await (
        rawTriggerGetConversationMetrics as (
          ...a: unknown[]
        ) => Promise<unknown>
      )(...args);
      if (res && typeof res === 'object' && 'data' in (res as object)) {
        return (res as { data: MetricDataFor<'Number of Conversations'> }).data;
      }
      return res as MetricDataFor<'Number of Conversations'>;
    },
    [rawTriggerGetConversationMetrics],
  );

  const triggerGetAppointments = useCallback(
    async (...args: unknown[]) => {
      const res = await (
        rawTriggerGetAppointments as (...a: unknown[]) => Promise<unknown>
      )(...args);
      if (res && typeof res === 'object' && 'data' in (res as object)) {
        return (res as { data: MetricDataFor<'Number of Appointments Booked'> })
          .data;
      }
      return res as MetricDataFor<'Number of Appointments Booked'>;
    },
    [rawTriggerGetAppointments],
  );

  const triggerGetUpgradesDowngrades = useCallback(
    async (...args: unknown[]) => {
      const res = await (
        rawTriggerGetUpgradesDowngrades as (
          ...a: unknown[]
        ) => Promise<unknown>
      )(...args);
      if (res && typeof res === 'object' && 'data' in (res as object)) {
        return (res as { data: MetricDataFor<'Number of Upgrades / Downgrades'> })
          .data;
      }
      return res as MetricDataFor<'Number of Upgrades / Downgrades'>;
    },
    [rawTriggerGetUpgradesDowngrades],
  );

  const triggerMap = useMemo(
    () => ({
      'Number of Registered Users': triggerGetUserCount,
      'Number of Users by Country': triggerGetUsersByCountry,
      'Number of Verified / Active users': triggerGetUserCount,
      'Number of Users by Plan': triggerGetSubscriptions,
      'Number of Different Campaign Types Created': triggerGetCampaigns,
      'Number of Upgrades / Downgrades': triggerGetUpgradesDowngrades,
      'Number of Appointments Booked': triggerGetAppointments,
      'Number of Conversations': triggerGetConversationMetrics,
    }),
    [
      triggerGetUserCount,
      triggerGetUsersByCountry,
      triggerGetSubscriptions,
      triggerGetCampaigns,
      triggerGetUpgradesDowngrades,
      triggerGetAppointments,
      triggerGetConversationMetrics,
    ],
  );

  const selected = options[metric];
  const chartType = selected?.type as string | undefined;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const typedTrigger = triggerMap[
          metric
        ] as () => Promise<MetricDataFor<typeof metric>>;
        const data = await typedTrigger();

        if (!mounted) {
          return;
        }

        const extracted = extractDataForMetric(
          metric as MetricKey,
          data as MetricDataFor<typeof metric>,
        );

        setOptions(prev => ({
          ...prev,
          [metric]: {
            ...(prev[metric] as ChartOptions),
            data: extracted,
          },
        }));
      } catch (err) {
        console.error(err);
        toast.error('Error fetching chart data');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [metric, triggerMap]);

  return (
    <div className="h-full space-y-6 p-4 md:p-6">
      <div className="relative">
        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/5 to-indigo-500/5 blur-xl" />
        <div className="relative max-w-md rounded-xl border border-blue-100/50 bg-white/50 p-5 shadow-lg shadow-blue-500/5 backdrop-blur-sm">
          <label htmlFor="metrics" className="mb-3 block text-sm font-semibold text-slate-700">
            📊 Select Metric to Visualize
          </label>
          <Select
            onValueChangeAction={v => setMetric(v as MetricKey)}
            defaultValue={metric}
            options={Object.keys(options).map(key => ({
              label: key,
              value: key,
            }))}
          />
        </div>
      </div>

      {loading
        ? (
            <div className="flex h-96 w-full items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-linear-to-r from-blue-500 to-indigo-500 opacity-50 blur-xl" />
                <Loader />
              </div>
            </div>
          )
        : chartType === 'card'
          ? (
              <MetricCard
                title={metric}
                value={Number(
                  ((selected as ChartOptions) as { data?: unknown }).data ?? 0,
                )}
                icon="/assets/total_sales.svg"
                background_color="#f0f9ff"
              />
            )
          : (
              selected && (
                <div className="relative space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="h-1 w-12 rounded-full bg-linear-to-r from-blue-500 to-indigo-500" />
                    <h2 className="bg-linear-to-r from-slate-800 to-blue-900 bg-clip-text font-inter text-xl font-bold text-transparent md:text-2xl">
                      Analytics Overview
                    </h2>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
                    <div className="relative rounded-2xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
                      <AgCharts
                        options={selected}
                        className="bg-transparent!"
                        style={{ width: '100%', height: '700px' }}
                      />
                    </div>
                  </div>
                </div>
              )
            )}
    </div>
  );
}
