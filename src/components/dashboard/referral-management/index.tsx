'use client';

import type { ReferralCode, ReferralCodeOwnerType, ReferralCodeStatus } from '@/types';
import { useState } from 'react';
import {
  FiAward,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiHash,
  FiLink,
  FiRefreshCw,
  FiSearch,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { PageHeader } from '@/components/global/page-header';
import { TableRowSkeleton } from '@/components/ui';
import { useGetReferralCodesQuery } from '@/services';

/* ─── Config ──────────────────────────────────────────────────────── */

type StatusFilter = 'all' | ReferralCodeStatus;
type OwnerFilter = 'all' | ReferralCodeOwnerType;

const STATUS_CONFIG: Record<ReferralCodeStatus, { label: string; dot: string; badge: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  inactive: { label: 'Inactive', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-500' },
  expired: { label: 'Expired', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
};

const OWNER_CONFIG: Record<ReferralCodeOwnerType, { label: string; badge: string; icon: React.ReactNode }> = {
  partner: { label: 'Partner', badge: 'bg-violet-100 text-violet-700', icon: <FiAward className="h-3 w-3" /> },
  sales_agent: { label: 'Sales Agent', badge: 'bg-orange-100 text-orange-700', icon: <FiUser className="h-3 w-3" /> },
  admin: { label: 'Admin', badge: 'bg-sky-100 text-sky-700', icon: <FiUsers className="h-3 w-3" /> },
};

/* ─── Sub-components ──────────────────────────────────────────────── */

function StatusBadge({ status }: { status: ReferralCodeStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.inactive;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function OwnerBadge({ type }: { type: ReferralCodeOwnerType }) {
  const cfg = OWNER_CONFIG[type] ?? OWNER_CONFIG.admin;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${cfg.badge}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

/* ─── Detail panel ────────────────────────────────────────────────── */

function ReferralDetailPanel({ code, onClose }: { code: ReferralCode; onClose: () => void }) {
  const conversionRate = code.total_uses > 0
    ? Math.round((code.successful_conversions / code.total_uses) * 100)
    : 0;

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
          <h3 className="text-base font-bold text-slate-800">Referral Code</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {/* Code display */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 text-white">
              <FiLink className="h-6 w-6" />
            </div>
            <div>
              <p className="font-mono text-2xl font-bold tracking-widest text-slate-800">{code.code}</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                <StatusBadge status={code.status} />
                <OwnerBadge type={code.owner_type} />
              </div>
            </div>
          </div>

          {/* Metrics strip */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 overflow-hidden rounded-xl border border-slate-100">
            {[
              { label: 'Total Uses', value: code.total_uses.toLocaleString(), color: 'text-slate-700' },
              { label: 'Conversions', value: code.successful_conversions.toLocaleString(), color: 'text-emerald-700' },
              { label: 'Conv. Rate', value: `${conversionRate}%`, color: 'text-teal-700' },
            ].map(m => (
              <div key={m.label} className="bg-slate-50 px-4 py-3 text-center">
                <p className="text-xs font-medium text-slate-400">{m.label}</p>
                <p className={`mt-0.5 text-xl font-bold ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Commission */}
          {code.commission_earned !== undefined && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                <FiDollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-600">Commission Earned</p>
                <p className="text-2xl font-bold text-emerald-700">
                  $
                  {code.commission_earned.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
            {[
              { icon: <FiUser />, label: 'Owner', value: code.owner_name },
              { icon: <FiAward />, label: 'Owner Type', value: OWNER_CONFIG[code.owner_type]?.label ?? code.owner_type },
              { icon: <FiTrendingUp />, label: 'Conversion Rate', value: `${conversionRate}%` },
              ...(code.expires_at
                ? [{ icon: <FiCalendar />, label: 'Expires At', value: new Date(code.expires_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }]
                : []),
              { icon: <FiCalendar />, label: 'Created At', value: new Date(code.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
              { icon: <FiHash />, label: 'Code ID', value: code.id, mono: true },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 shrink-0 text-slate-400">{row.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-400">{row.label}</p>
                  <p className={`mt-0.5 break-all text-sm text-slate-700 ${'mono' in row && row.mono ? 'font-mono' : 'font-medium'}`}>
                    {row.value}
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

/* ─── Filters ─────────────────────────────────────────────────────── */

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'expired', label: 'Expired' },
];

const OWNER_FILTERS: { value: OwnerFilter; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'partner', label: 'Partner' },
  { value: 'sales_agent', label: 'Sales Agent' },
  { value: 'admin', label: 'Admin' },
];

/* ─── Main ────────────────────────────────────────────────────────── */

export default function ReferralManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ReferralCode | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetReferralCodesQuery({
    page,
    limit: 15,
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(ownerFilter !== 'all' && { owner_type: ownerFilter }),
    ...(search.trim() && { search: search.trim() }),
  });

  const codes: ReferralCode[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const totalPages = meta?.pages ?? 1;

  const totalActive = codes.filter(c => c.status === 'active').length;
  const totalUses = codes.reduce((sum, c) => sum + c.total_uses, 0);
  const totalConversions = codes.reduce((sum, c) => sum + c.successful_conversions, 0);

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Referral Management"
        subtitle="Track referral codes, attribution, and conversion performance"
        icon={<FiLink />}
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Codes', value: meta?.total ?? codes.length, icon: <FiLink />, iconBg: 'bg-emerald-100 text-emerald-600', color: 'text-emerald-700' },
          { label: 'Active', value: totalActive, icon: <FiTrendingUp />, iconBg: 'bg-teal-100 text-teal-600', color: 'text-teal-700' },
          { label: 'Total Uses', value: totalUses, icon: <FiUsers />, iconBg: 'bg-sky-100 text-sky-600', color: 'text-sky-700' },
          { label: 'Conversions', value: totalConversions, icon: <FiDollarSign />, iconBg: 'bg-violet-100 text-violet-600', color: 'text-violet-700' },
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

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/60 bg-white p-3 shadow-sm">
        <div className="relative min-w-48 flex-1">
          <FiSearch className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search by code or owner name…"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-9 text-sm text-slate-700 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${statusFilter === f.value ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {OWNER_FILTERS.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => { setOwnerFilter(f.value); setPage(1); }}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${ownerFilter === f.value ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
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
                <table className="w-full text-sm"><tbody><TableRowSkeleton cols={6} rows={8} /></tbody></table>
              </div>
            )
          : codes.length === 0
            ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3">
                  <FiLink className="h-12 w-12 text-slate-300" />
                  <p className="text-slate-500">No referral codes found</p>
                  {(search || statusFilter !== 'all' || ownerFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => { setSearch(''); setStatusFilter('all'); setOwnerFilter('all'); }}
                      className="text-sm font-medium text-emerald-600 hover:underline"
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
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Code</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">Owner</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">Type</th>
                        <th className="hidden px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">Uses</th>
                        <th className="hidden px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 xl:table-cell">Conversions</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {codes.map(c => (
                        <tr
                          key={c.id}
                          className="cursor-pointer transition-colors hover:bg-slate-50/70"
                          onClick={() => setSelected(c)}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                                <FiLink className="h-3.5 w-3.5 text-emerald-600" />
                              </div>
                              <span className="font-mono text-sm font-bold tracking-wider text-slate-800">{c.code}</span>
                            </div>
                          </td>
                          <td className="hidden px-5 py-3.5 sm:table-cell">
                            <p className="font-medium text-slate-700">{c.owner_name}</p>
                          </td>
                          <td className="hidden px-5 py-3.5 md:table-cell">
                            <OwnerBadge type={c.owner_type} />
                          </td>
                          <td className="hidden px-5 py-3.5 text-right font-medium text-slate-600 lg:table-cell">
                            {c.total_uses.toLocaleString()}
                          </td>
                          <td className="hidden px-5 py-3.5 text-right lg:table-cell xl:table-cell">
                            <span className="font-medium text-emerald-600">{c.successful_conversions.toLocaleString()}</span>
                            {c.total_uses > 0 && (
                              <span className="ml-1 text-xs text-slate-400">
                                ({Math.round((c.successful_conversions / c.total_uses) * 100)}%)
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={c.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
            <p className="text-sm text-slate-500">{meta?.total?.toLocaleString()} codes</p>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40">
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-sm text-slate-600">{page} / {totalPages}</span>
              <button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40">
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selected && <ReferralDetailPanel code={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
