'use client';

import { Badge, EmptyState, StatCardSkeleton, StatCard as UiStatCard } from '@myairobotics/ui';
import {
  FiActivity,
  FiAlertTriangle,
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiCreditCard,
  FiGlobe,
  FiHeadphones,
  FiTrendingDown,
  FiTrendingUp,
  FiUser,
  FiUserCheck,
  FiUsers,
  FiZap,
} from 'react-icons/fi';
import {
  useGetDashboardGrowthQuery,
  useGetDashboardLeaderboardsQuery,
  useGetDashboardOverviewQuery,
  useGetDashboardSupportActivityQuery,
} from '@/services';

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
  const { data: leaderboardsData, isLoading: leaderboardsLoading } = useGetDashboardLeaderboardsQuery();
  const { data: growthData, isLoading: growthLoading } = useGetDashboardGrowthQuery();
  const { data: supportData, isLoading: supportLoading } = useGetDashboardSupportActivityQuery();

  const overview = data?.data;
  const leaderboards = leaderboardsData?.data;
  const growth = growthData?.data;
  const support = supportData?.data;
  const totalNewSignups = growth?.newSignupsByPeriod.reduce((sum, p) => sum + p.count, 0) ?? 0;

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

                  {/* Growth & Retention */}
                  <div>
                    <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-400 uppercase">Growth & Retention</h2>
                    {growthLoading
                      ? (
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {Array.from({ length: 4 }, (_, i) => `growth-skel-${i}`).map(key => <StatCardSkeleton key={key} />)}
                          </div>
                        )
                      : (
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <UiStatCard label="New Signups" value={totalNewSignups} icon={<FiTrendingUp />} iconBg="bg-emerald-100 text-emerald-600" valueColor="text-emerald-700" />
                            <UiStatCard label="Churned Subscriptions" value={growth?.churn.cancelledSubscriptions ?? 0} icon={<FiTrendingDown />} iconBg="bg-red-100 text-red-600" valueColor="text-red-700" />
                            <UiStatCard label="Churned Businesses" value={growth?.churn.churnedBusinesses ?? 0} icon={<FiTrendingDown />} iconBg="bg-amber-100 text-amber-600" valueColor="text-amber-700" />
                            <UiStatCard label="Failed Payments" value={growth?.failedPayments.total ?? 0} icon={<FiAlertTriangle />} iconBg="bg-rose-100 text-rose-600" valueColor="text-rose-700" />
                          </div>
                        )}
                    {!growthLoading && growth && (growth.pendingSetup.awaitingSetup.count > 0 || growth.pendingSetup.incompleteProfile.count > 0) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge className="bg-amber-100 text-amber-700">
                          {growth.pendingSetup.awaitingSetup.count}
                          {' '}
                          awaiting setup
                        </Badge>
                        <Badge className="bg-slate-100 text-slate-600">
                          {growth.pendingSetup.incompleteProfile.count}
                          {' '}
                          incomplete profiles
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Leaderboards */}
                  <div>
                    <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-400 uppercase">Leaderboards</h2>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                        <p className="mb-3 text-sm font-semibold text-slate-700">Top Partners</p>
                        {leaderboardsLoading
                          ? <StatCardSkeleton />
                          : !leaderboards?.topPartners.length
                              ? <EmptyState icon={<FiGlobe />} message="No partner data yet" />
                              : (
                                  <ul className="space-y-2.5">
                                    {leaderboards.topPartners.slice(0, 5).map(p => (
                                      <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
                                        <span className="truncate font-medium text-slate-700">{p.name}</span>
                                        <span className="shrink-0 text-xs text-slate-400">
                                          {p.businessesReferred}
                                          {' '}
                                          referred
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                      </div>

                      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                        <p className="mb-3 text-sm font-semibold text-slate-700">Top Sales Agents</p>
                        {leaderboardsLoading
                          ? <StatCardSkeleton />
                          : !leaderboards?.topSalesAgents.length
                              ? <EmptyState icon={<FiUserCheck />} message="No sales agent data yet" />
                              : (
                                  <ul className="space-y-2.5">
                                    {leaderboards.topSalesAgents.slice(0, 5).map(a => (
                                      <li key={a.id} className="flex items-center justify-between gap-2 text-sm">
                                        <span className="truncate font-medium text-slate-700">{a.name}</span>
                                        <span className="shrink-0 text-xs text-slate-400">
                                          {a.businessesReferred}
                                          {' '}
                                          referred
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                      </div>

                      <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                        <p className="mb-3 text-sm font-semibold text-slate-700">Top Countries</p>
                        {leaderboardsLoading
                          ? <StatCardSkeleton />
                          : !leaderboards?.topCountries.length
                              ? <EmptyState icon={<FiBarChart2 />} message="No country data yet" />
                              : (
                                  <ul className="space-y-2.5">
                                    {leaderboards.topCountries.slice(0, 5).map(c => (
                                      <li key={c.country} className="flex items-center justify-between gap-2 text-sm">
                                        <span className="truncate font-medium text-slate-700 capitalize">{c.country}</span>
                                        <span className="shrink-0 text-xs text-slate-400">
                                          {c.businessCount}
                                          {' '}
                                          businesses
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                      </div>
                    </div>
                  </div>

                  {/* Support Activity */}
                  <div>
                    <h2 className="mb-3 text-xs font-bold tracking-widest text-slate-400 uppercase">Support Activity</h2>
                    {supportLoading
                      ? <StatCardSkeleton />
                      : (
                          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                  <FiHeadphones className="text-lg" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-slate-500">Total Support Sessions</p>
                                  <p className="text-2xl font-bold text-slate-800">{(support?.total ?? 0).toLocaleString()}</p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {support?.byActorPool.length
                                  ? support.byActorPool.map((p, i) => (
                                      <Badge key={p.actor_pool ?? `unknown-${i}`} className="bg-slate-100 text-slate-600 capitalize">
                                        {(p.actor_pool ?? 'unknown').replace('_', ' ')}
                                        :
                                        {' '}
                                        {p.count}
                                      </Badge>
                                    ))
                                  : <span className="text-xs text-slate-400">No support sessions recorded</span>}
                              </div>
                            </div>
                          </div>
                        )}
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
