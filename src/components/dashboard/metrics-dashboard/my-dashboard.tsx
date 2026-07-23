'use client';

import { EmptyState, SectionDivider, StatCard, StatCardSkeleton } from '@myairobotics/ui';
import {
  FiActivity,
  FiBriefcase,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiTrendingUp,
  FiUserCheck,
  FiZap,
} from 'react-icons/fi';
import { useGetDashboardMyQuery } from '@/services';

/**
 * Self-service dashboard for Sales-Agent-role admins, scoped to only their
 * own attributed businesses. Role gating currently checks for
 * `session.user.role === 'sales_agent'`, inferred from the doc's
 * `RoleNames.ADMIN.SALES_AGENT` constant and the naming pattern of the
 * partner-side roles (`partner_owner`, `partner_sales_agent`); not directly
 * confirmed against a live Sales Agent admin account since none existed to
 * test against as of 2026-07-20.
 */
export default function MySalesAgentDashboard() {
  const { data, isLoading } = useGetDashboardMyQuery();
  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => `skel-${i}`).map(k => <StatCardSkeleton key={k} />)}
      </div>
    );
  }

  if (!stats) {
    return <EmptyState icon={<FiBriefcase />} message="No dashboard data available" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <SectionDivider label="Your Businesses" />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard label="Total" value={stats.businesses.total} icon={<FiBriefcase />} iconBg="bg-primary-100 text-primary-600" valueColor="text-primary-700" />
          <StatCard label="Active" value={stats.businesses.active} icon={<FiUserCheck />} iconBg="bg-emerald-100 text-emerald-600" valueColor="text-emerald-700" />
          <StatCard label="Pending Setup" value={stats.businesses.pendingSetup} icon={<FiActivity />} iconBg="bg-amber-100 text-amber-600" valueColor="text-amber-700" />
        </div>
      </div>

      <div>
        <SectionDivider label="Campaigns & Appointments" />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total Campaigns" value={stats.campaigns.totalCampaigns} icon={<FiActivity />} iconBg="bg-violet-100 text-violet-600" valueColor="text-violet-700" />
          <StatCard label="Active Campaigns" value={stats.campaigns.activeCampaigns} icon={<FiActivity />} iconBg="bg-sky-100 text-sky-600" valueColor="text-sky-700" />
          <StatCard label="Appointments" value={stats.appointments.total} icon={<FiCalendar />} iconBg="bg-primary-100 text-primary-600" valueColor="text-primary-700" />
          <StatCard label="Completed" value={stats.appointments.completed} icon={<FiCalendar />} iconBg="bg-emerald-100 text-emerald-600" valueColor="text-emerald-700" />
        </div>
      </div>

      <div>
        <SectionDivider label="Revenue & Conversion" />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Revenue Attributed" value={`$${stats.revenue.totalRevenueAttributed.toLocaleString()}`} icon={<FiDollarSign />} iconBg="bg-emerald-100 text-emerald-600" valueColor="text-emerald-700" />
          <StatCard label="Active Subscriptions" value={stats.revenue.activeSubscriptions} icon={<FiCreditCard />} iconBg="bg-primary-100 text-primary-600" valueColor="text-primary-700" />
          <StatCard label="Conversion Rate" value={`${stats.conversion.conversionRatePercentage}%`} icon={<FiTrendingUp />} iconBg="bg-sky-100 text-sky-600" valueColor="text-sky-700" />
          <StatCard label="Wallet Balance" value={stats.tokenUsage.currentWalletBalance.toLocaleString()} icon={<FiZap />} iconBg="bg-amber-100 text-amber-600" valueColor="text-amber-700" />
        </div>
      </div>

      {stats.recentlyOnboarded.length > 0 && (
        <div>
          <SectionDivider label="Recently Onboarded" />
          <div className="mt-3 space-y-2">
            {stats.recentlyOnboarded.map(b => (
              <div key={b.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{b.name}</p>
                  <p className="text-xs text-slate-500">{b.email}</p>
                </div>
                <p className="text-xs text-slate-400">{new Date(b.dateJoined).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
