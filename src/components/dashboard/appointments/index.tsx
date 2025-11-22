'use client';

import { AgCharts } from 'ag-charts-react';
import { useMemo } from 'react';
import { PiCalendar, PiChartLine, PiTrendUp } from 'react-icons/pi';
import { Loader } from '@/components/ui';
import { useGetAppointmentMetricsQuery } from '@/services';

type ChartOptions = Record<string, unknown>;

export default function Appointments() {
  const { data, isLoading } = useGetAppointmentMetricsQuery();

  const appointments = data?.data;

  const chartOptions: ChartOptions = useMemo(() => ({
    data: appointments?.dailyAppointments || [],
    series: [
      {
        type: 'line',
        xKey: 'date',
        yKey: 'count',
        legendItemName: 'Appointments Booked',
        stroke: '#3b82f6',
        marker: {
          fill: '#3b82f6',
          stroke: '#3b82f6',
          size: 8,
        },
        strokeWidth: 3,
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
        title: { text: 'Number of Appointments' },
      },
    ],
    legend: {
      enabled: true,
      position: 'bottom',
    },
  }), [appointments]);

  // Calculate additional stats
  const avgPerDay = useMemo(() => {
    if (!appointments?.dailyAppointments || appointments.dailyAppointments.length === 0) {
      return 0;
    }
    const total = appointments.dailyAppointments.reduce((sum, day) => sum + day.count, 0);
    return Math.round(total / appointments.dailyAppointments.length);
  }, [appointments]);

  const peakDay = useMemo(() => {
    if (!appointments?.dailyAppointments || appointments.dailyAppointments.length === 0) {
      return null;
    }
    return appointments.dailyAppointments.reduce((max, day) =>
      day.count > max.count ? day : max,
    );
  }, [appointments]);

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
              Appointments Analytics 📅
            </h1>
            <p className="text-base font-medium text-white/90 md:text-lg">
              Track and analyze appointment booking trends
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 rounded-xl border-2 border-white/30 bg-white/20 px-5 py-3 shadow-lg backdrop-blur-sm">
              <PiTrendUp className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white">Performance Tracking</span>
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
                          <PiCalendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Appointments</p>
                          <p className="text-2xl font-bold text-slate-800">
                            {appointments?.totalAppointments || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-green-50/30 to-emerald-50/20 blur-xl" />
                    <div className="relative rounded-xl border border-green-100/50 bg-white/80 p-6 shadow-xl shadow-green-500/5 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-green-500 to-emerald-600">
                          <PiChartLine className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Average per Day</p>
                          <p className="text-2xl font-bold text-slate-800">{avgPerDay}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-linear-to-br from-purple-50/30 to-violet-50/20 blur-xl" />
                    <div className="relative rounded-xl border border-purple-100/50 bg-white/80 p-6 shadow-xl shadow-purple-500/5 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-violet-600">
                          <PiTrendUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Peak Day</p>
                          <p className="text-xl font-bold text-slate-800">
                            {peakDay ? `${peakDay.count} on ${peakDay.date}` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointments Chart */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
                  <div className="relative rounded-2xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-1 w-12 rounded-full bg-linear-to-r from-blue-500 to-indigo-500" />
                      <h2 className="bg-linear-to-r from-slate-800 to-blue-900 bg-clip-text font-inter text-xl font-bold text-transparent">
                        Daily Appointment Bookings
                      </h2>
                    </div>
                    <AgCharts
                      options={chartOptions}
                      style={{ width: '100%', height: '500px' }}
                    />
                  </div>
                </div>

                {/* Insights Section */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
                  <div className="relative rounded-xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-1 w-12 rounded-full bg-linear-to-r from-blue-500 to-indigo-500" />
                      <h2 className="bg-linear-to-r from-slate-800 to-blue-900 bg-clip-text font-inter text-xl font-bold text-transparent">
                        Key Insights
                      </h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg bg-blue-50/50 p-4">
                        <h3 className="mb-2 font-semibold text-slate-800">Booking Trend</h3>
                        <p className="text-sm text-slate-600">
                          {appointments?.totalAppointments && appointments.totalAppointments > 0
                            ? `You have ${appointments.totalAppointments} total appointments with an average of ${avgPerDay} bookings per day.`
                            : 'No appointment data available yet.'}
                        </p>
                      </div>
                      <div className="rounded-lg bg-green-50/50 p-4">
                        <h3 className="mb-2 font-semibold text-slate-800">Performance</h3>
                        <p className="text-sm text-slate-600">
                          {peakDay
                            ? `Your busiest day was ${peakDay.date} with ${peakDay.count} appointments booked.`
                            : 'Continue tracking to identify peak booking periods.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
      </div>
    </div>
  );
}
