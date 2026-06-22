'use client';

import { AgCharts } from 'ag-charts-react';
import { useMemo } from 'react';
import { PiCalendar, PiChartLine, PiTrendUp } from 'react-icons/pi';
import { PageHeader } from '@/components/global/page-header';
import { StatCardSkeleton } from '@/components/ui';
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
      <PageHeader
        title="Appointments Analytics"
        subtitle="Track and analyze appointment booking trends"
        icon={<PiCalendar />}
      />

      <div className="flex-1 space-y-4">
        {isLoading
          ? (
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }, (_, i) => `skel-${i}`).map(key => <StatCardSkeleton key={key} />)}
              </div>
            )
          : (
              <>
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                        <PiCalendar className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Appointments</p>
                        <p className="text-2xl font-bold text-slate-800">
                          {appointments?.totalAppointments || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                        <PiChartLine className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Average per Day</p>
                        <p className="text-2xl font-bold text-slate-800">{avgPerDay}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                        <PiTrendUp className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500">Peak Day</p>
                        <p className="text-xl font-bold text-slate-800">
                          {peakDay ? `${peakDay.count} on ${peakDay.date}` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointments Chart */}
                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-base font-semibold text-slate-800">
                    Daily Appointment Bookings
                  </h2>
                  <AgCharts
                    options={chartOptions}
                    style={{ width: '100%', height: '400px' }}
                  />
                </div>

                {/* Insights Section */}
                <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-base font-semibold text-slate-800">Key Insights</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                      <h3 className="mb-1.5 text-sm font-semibold text-slate-800">Booking Trend</h3>
                      <p className="text-sm text-slate-600">
                        {appointments?.totalAppointments && appointments.totalAppointments > 0
                          ? `You have ${appointments.totalAppointments} total appointments with an average of ${avgPerDay} bookings per day.`
                          : 'No appointment data available yet.'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                      <h3 className="mb-1.5 text-sm font-semibold text-slate-800">Performance</h3>
                      <p className="text-sm text-slate-600">
                        {peakDay
                          ? `Your busiest day was ${peakDay.date} with ${peakDay.count} appointments booked.`
                          : 'Continue tracking to identify peak booking periods.'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
      </div>
    </div>
  );
}
