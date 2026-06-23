'use client';

import type { SupportSession, SupportSessionStatus } from '@/types';
import { useState } from 'react';
import {
  FiAlertCircle,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiGlobe,
  FiHash,
  FiLogIn,
  FiMail,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUser,
  FiX,
  FiXCircle,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/global/page-header';
import { TableRowSkeleton } from '@/components/ui';
import { useGetSupportSessionsQuery, useTerminateSupportSessionMutation } from '@/services';

/* ─── Status config ───────────────────────────────────────────────── */

type StatusFilter = 'all' | SupportSessionStatus;

const STATUS_CONFIG: Record<SupportSessionStatus, { label: string; dot: string; badge: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  ended: { label: 'Ended', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-500' },
  expired: { label: 'Expired', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
  terminated: { label: 'Terminated', dot: 'bg-red-500', badge: 'bg-red-100 text-red-700' },
};

const ACCESS_LEVEL_LABELS = {
  read_only: 'Read Only',
  limited_write: 'Limited Write',
  full_admin: 'Full Admin',
};

const ACCESS_LEVEL_BADGE = {
  read_only: 'bg-sky-100 text-sky-700',
  limited_write: 'bg-amber-100 text-amber-700',
  full_admin: 'bg-red-100 text-red-700',
};

/* ─── Helpers ─────────────────────────────────────────────────────── */

function sessionDuration(session: SupportSession) {
  const end = session.ended_at ? new Date(session.ended_at) : new Date();
  const ms = end.getTime() - new Date(session.started_at).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 60) {
    return `${mins}m`;
  }
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function StatusBadge({ status }: { status: SupportSessionStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.ended;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ─── Detail panel ────────────────────────────────────────────────── */

function SessionDetailPanel({
  session,
  onClose,
  onTerminate,
  isTerminating,
}: {
  session: SupportSession;
  onClose: () => void;
  onTerminate: (id: string) => void;
  isTerminating: boolean;
}) {
  const isActive = session.status === 'active';

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
          <h3 className="text-base font-bold text-slate-800">Support Session</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-slate-600 to-slate-800 text-white">
              <FiShield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{session.business_name}</h2>
              <div className="mt-1.5 flex flex-wrap gap-2">
                <StatusBadge status={session.status} />
                <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${ACCESS_LEVEL_BADGE[session.access_level]}`}>
                  {ACCESS_LEVEL_LABELS[session.access_level]}
                </span>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">Reason for Access</p>
            <p className="text-sm text-slate-700">{session.reason}</p>
          </div>

          {/* Active warning */}
          {isActive && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Session is live</p>
                <p className="mt-0.5 text-xs text-amber-600">
                  This admin is currently inside the business workspace. Duration:
                  {' '}
                  <strong>{sessionDuration(session)}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Details grid */}
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
            {[
              { icon: <FiUser />, label: 'Initiated By', value: session.initiated_by_name },
              { icon: <FiMail />, label: 'Initiator Email', value: session.initiated_by_email },
              { icon: <FiCalendar />, label: 'Started At', value: new Date(session.started_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
              ...(session.ended_at
                ? [{ icon: <FiClock />, label: 'Ended At', value: new Date(session.ended_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }]
                : []),
              ...(session.expires_at
                ? [{ icon: <FiClock />, label: 'Expires At', value: new Date(session.expires_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }]
                : []),
              { icon: <FiClock />, label: 'Duration', value: sessionDuration(session) },
              ...(session.ip_address ? [{ icon: <FiGlobe />, label: 'IP Address', value: session.ip_address, mono: true }] : []),
              { icon: <FiHash />, label: 'Session ID', value: session.id, mono: true },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 shrink-0 text-slate-400">{row.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-400">{row.label}</p>
                  <p className={`mt-0.5 text-sm break-all text-slate-700 ${'mono' in row && row.mono ? 'font-mono' : 'font-medium'}`}>
                    {row.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {session.notes && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">Notes</p>
              <p className="text-sm text-slate-700">{session.notes}</p>
            </div>
          )}
        </div>

        {/* Terminate action */}
        {isActive && (
          <div className="border-t border-slate-100 p-4">
            <button
              type="button"
              onClick={() => onTerminate(session.id)}
              disabled={isTerminating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-60"
            >
              <FiXCircle className="h-4 w-4" />
              {isTerminating ? 'Terminating…' : 'Terminate Session'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Filter pills ────────────────────────────────────────────────── */

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'ended', label: 'Ended' },
  { value: 'expired', label: 'Expired' },
  { value: 'terminated', label: 'Terminated' },
];

/* ─── Main component ──────────────────────────────────────────────── */

export default function SupportAccess() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<SupportSession | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetSupportSessionsQuery({
    page,
    limit: 15,
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(search.trim() && { search: search.trim() }),
  });

  const [terminateSession, { isLoading: isTerminating }] = useTerminateSupportSessionMutation();

  const sessions: SupportSession[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const totalPages = meta?.pages ?? 1;

  const activeSessions = sessions.filter(s => s.status === 'active').length;
  const totalSessions = meta?.total ?? sessions.length;

  const handleTerminate = async (id: string) => {
    try {
      await terminateSession(id).unwrap();
      toast.success('Session terminated');
      setSelected(null);
    } catch {
      toast.error('Failed to terminate session');
    }
  };

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
        title="Support Access"
        subtitle="Monitor and control admin access to client business workspaces"
        icon={<FiShield />}
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: 'Total Sessions', value: totalSessions, icon: <FiLogIn />, iconBg: 'bg-slate-100 text-slate-600', color: 'text-slate-700' },
          { label: 'Active Now', value: activeSessions, icon: <FiShield />, iconBg: 'bg-emerald-100 text-emerald-600', color: 'text-emerald-700' },
          { label: 'This Page', value: sessions.length, icon: <FiClock />, iconBg: 'bg-amber-100 text-amber-600', color: 'text-amber-700' },
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

      {/* Search + filter */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/60 bg-white p-3 shadow-sm">
        <div className="relative min-w-48 flex-1">
          <FiSearch className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search by business or admin name…"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-9 text-sm text-slate-700 transition-all outline-none focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-500/20"
          />
        </div>

        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {FILTERS.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => handleFilter(f.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
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
          : sessions.length === 0
            ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3">
                  <FiShield className="h-12 w-12 text-slate-300" />
                  <p className="text-slate-500">No support sessions found</p>
                  {(search || statusFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        setStatusFilter('all');
                      }}
                      className="text-sm font-medium text-slate-600 hover:underline"
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
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase sm:table-cell">Initiated By</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase md:table-cell">Access Level</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase lg:table-cell">Started</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase xl:table-cell">Duration</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sessions.map(session => (
                        <tr
                          key={session.id}
                          className="cursor-pointer transition-colors hover:bg-slate-50/70"
                          onClick={() => setSelected(session)}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                <FiShield className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{session.business_name}</p>
                                <p className="max-w-[200px] truncate text-xs text-slate-400">{session.reason}</p>
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-5 py-3.5 text-slate-600 sm:table-cell">
                            <p className="font-medium">{session.initiated_by_name}</p>
                            <p className="text-xs text-slate-400">{session.initiated_by_email}</p>
                          </td>
                          <td className="hidden px-5 py-3.5 md:table-cell">
                            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${ACCESS_LEVEL_BADGE[session.access_level]}`}>
                              {ACCESS_LEVEL_LABELS[session.access_level]}
                            </span>
                          </td>
                          <td className="hidden px-5 py-3.5 text-slate-500 lg:table-cell">
                            {new Date(session.started_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="hidden px-5 py-3.5 text-slate-500 xl:table-cell">
                            {sessionDuration(session)}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={session.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
            <p className="text-sm text-slate-500">
              {totalSessions.toLocaleString()}
              {' '}
              {totalSessions === 1 ? 'session' : 'sessions'}
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

      {selected && (
        <SessionDetailPanel
          session={selected}
          onClose={() => setSelected(null)}
          onTerminate={handleTerminate}
          isTerminating={isTerminating}
        />
      )}
    </div>
  );
}
