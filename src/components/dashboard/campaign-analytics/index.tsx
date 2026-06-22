'use client';

import { AgCharts } from 'ag-charts-react';
import { useMemo } from 'react';
import { PiChartLine, PiUsers } from 'react-icons/pi';
import { PageHeader } from '@/components/global/page-header';
import { StatCardSkeleton } from '@/components/ui';
import {
  useGetCampaignConversationMetricsQuery,
  useGetCampaignsMetricsQuery,
} from '@/services';

type ChartOptions = Record<string, unknown>;

export default function CampaignsAnalytics() {
  const { data: campaignsData, isLoading: campaignsLoading } = useGetCampaignsMetricsQuery();
  const { data: conversationsData, isLoading: conversationsLoading } = useGetCampaignConversationMetricsQuery();

  const campaigns = campaignsData?.data;
  const conversations = conversationsData?.data;

  const campaignsChartOptions: ChartOptions = useMemo(() => ({
    data: campaigns?.dailyCounts || [],
    series: [
      {
        type: 'bar',
        xKey: 'date',
        yKey: 'outreach',
        legendItemName: 'Outreach Campaigns',
        fill: '#3b82f6',
      },
      {
        type: 'bar',
        xKey: 'date',
        yKey: 'sales',
        legendItemName: 'Sales Campaigns',
        fill: '#6366f1',
      },
    ],
    axes: [
      { type: 'category', position: 'bottom', title: { text: 'Date' } },
      { type: 'number', position: 'left', title: { text: 'Number of Campaigns' } },
    ],
    legend: { enabled: true, position: 'bottom' },
  }), [campaigns]);

  const conversationsChartOptions: ChartOptions = useMemo(() => ({
    data: conversations?.dailyCounts || [],
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
      { type: 'category', position: 'bottom', title: { text: 'Date' } },
      { type: 'number', position: 'left', title: { text: 'Number of Conversations' } },
    ],
    legend: { enabled: true, position: 'bottom' },
  }), [conversations]);

  const isLoading = campaignsLoading || conversationsLoading;

  return (
    <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Campaign Analytics"
        subtitle="Monitor campaign performance and conversation metrics"
        icon={<PiChartLine />}
      />

      <div className="flex-1 space-y-4">
        {isLoading
          ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map(key => <StatCardSkeleton key={key} />)}
              </div>
            )
          : (
              <>
                {/* Campaign Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                        <PiChartLine className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Outreach Campaigns</p>
                        <p className="text-2xl font-bold text-slate-800">{campaigns?.totalOutreach || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                        <PiChartLine className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Sales Campaigns</p>
                        <p className="text-2xl font-bold text-slate-800">{campaigns?.totalSales || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaigns Chart */}
                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-base font-semibold text-slate-800">
                    Campaign Types Created Over Time
                  </h2>
                  <AgCharts options={campaignsChartOptions} style={{ width: '100%', height: '400px' }} />
                </div>

                {/* Conversation Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                  {[
                    { label: 'Web Agents', value: conversations?.totalWebAgents || 0 },
                    { label: 'Agent Chat', value: conversations?.totalWebAgentChat || 0 },
                    { label: 'Outreach', value: conversations?.totalOutreach || 0 },
                    { label: 'Sales', value: conversations?.totalSales || 0 },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                          <PiUsers className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500">{label}</p>
                          <p className="text-2xl font-bold text-slate-800">{value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Conversations Chart */}
                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-base font-semibold text-slate-800">
                    Conversation Trends by Channel
                  </h2>
                  <AgCharts options={conversationsChartOptions} style={{ width: '100%', height: '400px' }} />
                </div>
              </>
            )}
      </div>
    </div>
  );
}
