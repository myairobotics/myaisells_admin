'use client';

import {
  FiActivity,
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiCreditCard,
  FiGlobe,
  FiUser,
  FiUserCheck,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import { StatCardSkeleton } from '@/components/ui';
import { useGetDashboardOverviewQuery } from '@/services';

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ReactElement;
  color: 'blue' | 'green' | 'amber' | 'purple' | 'rose' | 'cyan' | 'indigo' | 'teal';
  sub?: string;
};

const COLOR_MAP: Record<StatCardProps['color'], { bg: string; ring: string; icon: string; text: string; bar: string }> = {
  blue: { bg: 'from-blue-500 to-blue-700', ring: 'ring-blue-200', icon: 'text-blue-600', text: 'text-blue-700', bar: 'from-blue-600 via-blue-500 to-blue-600' },
  green: { bg: 'from-emerald-500 to-emerald-700', ring: 'ring-emerald-200', icon: 'text-emerald-600', text: 'text-emerald-700', bar: 'from-emerald-600 via-emerald-500 to-emerald-600' },
  amber: { bg: 'from-amber-500 to-amber-600', ring: 'ring-amber-200', icon: 'text-amber-600', text: 'text-amber-700', bar: 'from-amber-500 via-amber-400 to-amber-500' },
  purple: { bg: 'from-purple-500 to-purple-700', ring: 'ring-purple-200', icon: 'text-purple-600', text: 'text-purple-700', bar: 'from-purple-600 via-purple-500 to-purple-600' },
  rose: { bg: 'from-rose-500 to-rose-700', ring: 'ring-rose-200', icon: 'text-rose-600', text: 'text-rose-700', bar: 'from-rose-600 via-rose-500 to-rose-600' },
  cyan: { bg: 'from-cyan-500 to-cyan-700', ring: 'ring-cyan-200', icon: 'text-cyan-600', text: 'text-cyan-700', bar: 'from-cyan-600 via-cyan-500 to-cyan-600' },
  indigo: { bg: 'from-indigo-500 to-indigo-700', ring: 'ring-indigo-200', icon: 'text-indigo-600', text: 'text-indigo-700', bar: 'from-indigo-600 via-indigo-500 to-indigo-600' },
  teal: { bg: 'from-teal-500 to-teal-700', ring: 'ring-teal-200', icon: 'text-teal-600', text: 'text-teal-700', bar: 'from-teal-600 via-teal-500 to-teal-600' },
};

function StatCard({ label, value, icon, color, sub }: StatCardProps) {
  const c = COLOR_MAP[color];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className={`absolute top-0 right-0 left-0 h-0.5 bg-linear-to-r ${c.bar}`} />
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br ${c.bg} shadow-md`}>
            <span className="text-lg text-white">{icon}</span>
          </div>
          {sub && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">{sub}</span>
          )}
        </div>
        <p className="mb-0.5 text-sm font-medium text-slate-500">{label}</p>
        <p className={`text-3xl font-bold ${c.text}`}>
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default function MetricsDashboard() {
  const { data, isLoading } = useGetDashboardOverviewQuery();
  const overview = data?.data;

  const stats: StatCardProps[] = overview
    ? [
        { label: 'Total Users', value: overview.totalUsers, icon: <FiUsers />, color: 'blue' },
        { label: 'Active Users', value: overview.activeUsers, icon: <FiUserCheck />, color: 'green' },
        { label: 'Inactive Users', value: overview.inactiveUsers, icon: <FiUser />, color: 'rose' },
        { label: 'Partner Users', value: overview.partnerUsers, icon: <FiGlobe />, color: 'purple' },
        { label: 'Total Partners', value: overview.totalPartners, icon: <FiBriefcase />, color: 'indigo' },
        { label: 'Total Campaigns', value: overview.totalCampaigns, icon: <FiActivity />, color: 'cyan' },
        { label: 'Appointments', value: overview.totalAppointments, icon: <FiCalendar />, color: 'teal' },
        { label: 'Subscriptions', value: overview.totalSubscriptions, icon: <FiCreditCard />, color: 'amber' },
        { label: 'Sales Agents', value: overview.totalSalesAgents, icon: <FiZap />, color: 'blue' },
      ]
    : [];

  return (
    <div className="flex h-full w-full flex-col space-y-6 overflow-x-hidden overflow-y-auto">
      {/* Stats Grid */}
      {isLoading
        ? (
            <>
              <div>
                <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-400 uppercase">Key Metrics</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map(key => <StatCardSkeleton key={key} />)}
                </div>
              </div>
              <div>
                <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-400 uppercase">Platform Activity</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 5 }, (_, i) => `skel-${i}`).map(key => <StatCardSkeleton key={key} />)}
                </div>
              </div>
            </>
          )
        : !overview
          ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/60 bg-white">
                <FiBarChart2 className="h-12 w-12 text-slate-300" />
                <p className="text-sm font-medium text-slate-500">Could not load dashboard data</p>
                <p className="text-xs text-slate-400">Check your connection and try refreshing</p>
              </div>
            )
          : (
              <>
                <div>
                  <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-400 uppercase">Key Metrics</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {stats.slice(0, 4).map(s => (
                      <StatCard key={s.label} {...s} />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-400 uppercase">Platform Activity</h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {stats.slice(4).map(s => (
                      <StatCard key={s.label} {...s} />
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-400 uppercase">Quick Actions</h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: 'Onboard Partner', href: '/partners', icon: <FiGlobe />, color: 'bg-blue-600' },
                      { label: 'Add Business', href: '/businesses', icon: <FiBriefcase />, color: 'bg-indigo-600' },
                      { label: 'View Audit Logs', href: '/audit-logs', icon: <FiBarChart2 />, color: 'bg-purple-600' },
                      { label: 'Manage Roles', href: '/roles-permissions', icon: <FiUserCheck />, color: 'bg-emerald-600' },
                    ].map(action => (
                      <a
                        key={action.label}
                        href={action.href}
                        className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${action.color} text-white shadow-sm`}>
                          <span className="text-base">{action.icon}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{action.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
    </div>
  );
}
