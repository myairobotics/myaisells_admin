'use client';

import type { AdminBusiness, BusinessStatus } from '@/types';
import { useState } from 'react';
import {
  FiBriefcase,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiGlobe,
  FiHash,
  FiLayers,
  FiMail,
  FiPercent,
  FiPhone,
  FiRefreshCw,
  FiUser,
  FiX,
  FiZap,
} from 'react-icons/fi';
import { PageHeader } from '@/components/global/page-header';
import { SearchInput, TableRowSkeleton } from '@/components/ui';
import { useGetAdminBusinessesQuery } from '@/services';

type StatusFilter = 'all' | BusinessStatus;

const STATUS_CONFIG: Record<BusinessStatus, { label: string; dot: string; badge: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  pending_setup: { label: 'Pending Setup', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
  suspended: { label: 'Suspended', dot: 'bg-red-500', badge: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-500' },
};

function StatusBadge({ status }: { status: BusinessStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.cancelled;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function SetupBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-primary-500 transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs text-slate-500">
        {clamped}
        %
      </span>
    </div>
  );
}

function BusinessDetailPanel({
  business,
  onClose,
}: {
  business: AdminBusiness;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close panel"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-bold text-slate-800">Business Profile</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary-500 to-primary-700 text-xl font-bold text-white">
              {business.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{business.name}</h2>
              {business.country && <p className="text-sm text-slate-500">{business.country}</p>}
              <div className="mt-1.5">
                <StatusBadge status={business.status} />
              </div>
            </div>
          </div>

          {/* Setup progress */}
          {business.setup_completion !== undefined && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">Setup Progress</p>
              <SetupBar pct={business.setup_completion} />
            </div>
          )}

          {/* Details grid */}
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
            {[
              { icon: <FiMail />, label: 'Email', value: business.email },
              ...(business.phone ? [{ icon: <FiPhone />, label: 'Phone', value: business.phone }] : []),
              ...(business.website ? [{ icon: <FiGlobe />, label: 'Website', value: business.website }] : []),
              ...(business.industry ? [{ icon: <FiBriefcase />, label: 'Industry', value: business.industry }] : []),
              ...(business.subscription_plan ? [{ icon: <FiLayers />, label: 'Plan', value: business.subscription_plan }] : []),
              ...(business.token_balance !== undefined ? [{ icon: <FiZap />, label: 'Token Balance', value: business.token_balance.toLocaleString() }] : []),
              ...(business.referral_code ? [{ icon: <FiHash />, label: 'Referral Code', value: business.referral_code, mono: true }] : []),
              ...(business.created_by ? [{ icon: <FiUser />, label: 'Created By', value: business.created_by }] : []),
              { icon: <FiCalendar />, label: 'Joined', value: new Date(business.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
              { icon: <FiHash />, label: 'Business ID', value: business.id, mono: true },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 shrink-0 text-slate-400">{row.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-400">{row.label}</p>
                  <p className={`mt-0.5 text-sm break-all text-slate-700 ${'mono' in row && row.mono ? 'font-mono' : 'font-medium'}`}>
                    {String(row.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending_setup', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function BusinessesManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [selectedBusiness, setSelectedBusiness] = useState<AdminBusiness | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetAdminBusinessesQuery({
    page,
    limit: 15,
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(search.trim() && { search: search.trim() }),
  });

  const businesses: AdminBusiness[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const totalPages = meta?.pages ?? 1;

  const totalActive = businesses.filter(b => b.status === 'active').length;
  const totalPending = businesses.filter(b => b.status === 'pending_setup').length;
  const totalSuspended = businesses.filter(b => b.status === 'suspended').length;

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilter = (f: StatusFilter) => {
    setStatusFilter(f);
    setPage(1);
  };

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Businesses"
        subtitle="Onboard and manage client business accounts"
        icon={<FiBriefcase />}
        actions={(
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25 disabled:opacity-60"
          >
            <FiRefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      />

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total', value: meta?.total ?? businesses.length, icon: <FiBriefcase />, iconBg: 'bg-violet-100 text-violet-600', color: 'text-violet-700' },
          { label: 'Active', value: totalActive, icon: <FiZap />, iconBg: 'bg-emerald-100 text-emerald-600', color: 'text-emerald-700' },
          { label: 'Pending Setup', value: totalPending, icon: <FiPercent />, iconBg: 'bg-amber-100 text-amber-600', color: 'text-amber-700' },
          { label: 'Suspended', value: totalSuspended, icon: <FiLayers />, iconBg: 'bg-red-100 text-red-500', color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${s.iconBg}`}>
              <span className="text-lg">{s.icon}</span>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/60 bg-white p-3 shadow-sm">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Search by name, email or country…"
          className="min-w-48 flex-1"
        />

        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {FILTERS.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => handleFilter(f.value)}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-all ${
                statusFilter === f.value
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        {isLoading
          ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    <TableRowSkeleton cols={6} rows={8} />
                  </tbody>
                </table>
              </div>
            )
          : businesses.length === 0
            ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3">
                  <FiBriefcase className="h-12 w-12 text-slate-300" />
                  <p className="text-slate-500">No businesses found</p>
                  {(search || statusFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        setStatusFilter('all');
                      }}
                      className="text-sm font-medium text-primary-600 hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )
            : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50/70">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Business</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase sm:table-cell">Email</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase md:table-cell">Country</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase lg:table-cell">Plan</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase xl:table-cell">Setup</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {businesses.map(biz => (
                        <tr
                          key={biz.id}
                          className="cursor-pointer transition-colors hover:bg-slate-50/70"
                          onClick={() => setSelectedBusiness(biz)}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-sm font-bold text-violet-700">
                                {biz.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-slate-800">{biz.name}</span>
                            </div>
                          </td>
                          <td className="hidden px-5 py-3.5 text-slate-500 sm:table-cell">{biz.email}</td>
                          <td className="hidden px-5 py-3.5 text-slate-500 md:table-cell">{biz.country ?? '—'}</td>
                          <td className="hidden px-5 py-3.5 md:table-cell lg:table-cell">
                            {biz.subscription_plan
                              ? (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                    <FiLayers className="h-3 w-3" />
                                    {biz.subscription_plan}
                                  </span>
                                )
                              : <span className="text-slate-400">—</span>}
                          </td>
                          <td className="hidden px-5 py-3.5 xl:table-cell">
                            {biz.setup_completion !== undefined
                              ? <SetupBar pct={biz.setup_completion} />
                              : <span className="text-slate-400">—</span>}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={biz.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
            <p className="text-sm text-slate-500">
              {meta?.total?.toLocaleString() ?? businesses.length}
              {' '}
              business
              {(meta?.total ?? businesses.length) !== 1 ? 'es' : ''}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition-all hover:bg-slate-50 disabled:opacity-40"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-sm text-slate-600">
                {page}
                {' '}
                /
                {' '}
                {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition-all hover:bg-slate-50 disabled:opacity-40"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail slide-over */}
      {selectedBusiness && (
        <BusinessDetailPanel
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
        />
      )}
    </div>
  );
}
