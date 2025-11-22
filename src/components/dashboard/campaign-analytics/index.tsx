'use client';

import { AgCharts } from 'ag-charts-react';
import { useMemo } from 'react';
import { PiChartLine, PiTrendUp, PiUsers } from 'react-icons/pi';
import { Loader } from '@/components/ui';
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
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Date' },
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Number of Campaigns' },
      },
    ],
    legend: {
      enabled: true,
      position: 'bottom',
    },
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
      {
        type: 'category',
        position: 'bottom',
        title: { text: 'Date' },
      },
      {
        type: 'number',
        position: 'left',
        title: { text: 'Number of Conversations' },
      },
    ],
    legend: {
      enabled: true,
      position: 'bottom',
    },
  }), [conversations]);

  const isLoading = campaignsLoading || conversationsLoading;

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
              Campaign Analytics 📊
            </h1>
            <p className="text-base font-medium text-white/90 md:text-lg">
              Monitor campaign performance and conversation metrics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 rounded-xl border-2 border-white/30 bg-white/20 px-5 py-3 shadow-lg backdrop-blur-sm">
              <PiTrendUp className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white">Live Analytics</span>
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
                {/* Campaign Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
                    <div className="relative rounded-xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600">
                          <PiChartLine className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Outreach Campaigns</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {campaigns?.totalOutreach || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-purple-50/30 to-violet-50/20 blur-xl" />
                    <div className="relative rounded-xl border border-purple-100/50 bg-white/80 p-6 shadow-xl shadow-purple-500/5 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-violet-600">
                          <PiChartLine className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Sales Campaigns</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {campaigns?.totalSales || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaigns Chart */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
                  <div className="relative rounded-2xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-1 w-12 rounded-full bg-linear-to-r from-blue-500 to-indigo-500" />
                      <h2 className="bg-linear-to-r from-slate-800 to-blue-900 bg-clip-text font-inter text-xl font-bold text-transparent">
                        Campaign Types Created Over Time
                      </h2>
                    </div>
                    <AgCharts
                      options={campaignsChartOptions}
                      style={{ width: '100%', height: '400px' }}
                    />
                  </div>
                </div>

                {/* Conversation Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
                    <div className="relative rounded-xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600">
                          <PiUsers className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Web Agents</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {conversations?.totalWebAgents || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-indigo-50/30 to-purple-50/20 blur-xl" />
                    <div className="relative rounded-xl border border-indigo-100/50 bg-white/80 p-6 shadow-xl shadow-indigo-500/5 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600">
                          <PiUsers className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Agent Chat</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {conversations?.totalWebAgentChat || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-purple-50/30 to-violet-50/20 blur-xl" />
                    <div className="relative rounded-xl border border-purple-100/50 bg-white/80 p-6 shadow-xl shadow-purple-500/5 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-violet-600">
                          <PiUsers className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Outreach</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {conversations?.totalOutreach || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-violet-50/30 to-fuchsia-50/20 blur-xl" />
                    <div className="relative rounded-xl border border-violet-100/50 bg-white/80 p-6 shadow-xl shadow-violet-500/5 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-600">
                          <PiUsers className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Sales</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {conversations?.totalSales || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversations Chart */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
                  <div className="relative rounded-2xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-1 w-12 rounded-full bg-linear-to-r from-blue-500 to-indigo-500" />
                      <h2 className="bg-linear-to-r from-slate-800 to-blue-900 bg-clip-text font-inter text-xl font-bold text-transparent">
                        Conversation Trends by Channel
                      </h2>
                    </div>
                    <AgCharts
                      options={conversationsChartOptions}
                      style={{ width: '100%', height: '500px' }}
                    />
                  </div>
                </div>
              </>
            )}
      </div>
    </div>
  );
}
