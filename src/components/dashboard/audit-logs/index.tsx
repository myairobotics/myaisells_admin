'use client';

import type { AuditLog, AuditLogsFilters } from '@/types';
import { Badge, DatePicker, EmptyState, FormField, Loader, PageHeader, Pagination, SearchInput, SidePanel, TableRowSkeleton } from '@myairobotics/ui';
import { useState } from 'react';
import {
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiFilter,
  FiList,
  FiMonitor,
  FiRefreshCw,
  FiX,
} from 'react-icons/fi';
import {
  useGetAuditLogsQuery,
  useGetAuditLogStatsQuery,
  useGetOneAuditLogQuery,
} from '@/services';

const POOL_OPTIONS = ['', 'admin', 'partner', 'partner_team'] as const;
const STATUS_OPTIONS = ['', 'success', 'failed'] as const;

function StatusBadge({ status }: { status: string }) {
  if (status === 'success') {
    return <Badge className="bg-emerald-100 text-emerald-700" icon={<FiCheckCircle className="h-3 w-3" />}>Success</Badge>;
  }
  return <Badge className="bg-red-100 text-red-700" icon={<FiAlertCircle className="h-3 w-3" />}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}

function PoolBadge({ pool }: { pool: string }) {
  const colorMap: Record<string, string> = {
    admin: 'bg-blue-100 text-blue-700',
    partner: 'bg-purple-100 text-purple-700',
    partner_team: 'bg-indigo-100 text-indigo-700',
  };
  return (
    <Badge className={`capitalize ${colorMap[pool] ?? 'bg-slate-100 text-slate-600'}`}>
      {pool.replace('_', ' ')}
    </Badge>
  );
}

function LogDetailPanel({ logId, onClose }: { logId: string; onClose: () => void }) {
  const { data, isLoading } = useGetOneAuditLogQuery(logId);
  const log = data?.data;

  return (
    <SidePanel open={true} onClose={onClose} title="Log Detail" maxWidth="max-w-lg">
      {isLoading
        ? <div className="flex h-32 items-center justify-center"><Loader /></div>
        : !log
            ? <p className="text-slate-500">Log not found.</p>
            : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">Action</p>
                      <p className="font-semibold text-slate-800 capitalize">{log.action}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">Module</p>
                      <p className="font-semibold text-slate-800 capitalize">{log.module}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">Status</p>
                      <StatusBadge status={log.status} />
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">Pool</p>
                      <PoolBadge pool={log.actorPool} />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">Actor</p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-700 text-sm font-bold text-white">
                        {log.actor.firstName.charAt(0)}
                        {log.actor.lastName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {log.actor.firstName}
                          {' '}
                          {log.actor.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{log.actor.email}</p>
                        <p className="text-xs text-slate-400 capitalize">{log.actor.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">Timestamp</p>
                      <div className="flex items-center gap-1.5 text-sm text-slate-700">
                        <FiClock className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">IP Address</p>
                      <div className="flex items-center gap-1.5 text-sm text-slate-700">
                        <FiMonitor className="h-3.5 w-3.5 text-slate-400" />
                        {log.ipAddress}
                      </div>
                    </div>
                    {log.deviceInfo?.userAgent && (
                      <div>
                        <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">User Agent</p>
                        <p className="text-sm break-all text-slate-600">{log.deviceInfo.userAgent}</p>
                      </div>
                    )}
                  </div>

                  {(log.oldValue !== null || log.newValue !== null) && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">Changes</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="mb-1 text-xs font-medium text-slate-500">Before</p>
                          <pre className="overflow-auto rounded-lg bg-red-50 p-2 text-xs text-red-700">
                            {JSON.stringify(log.oldValue, null, 2) || 'null'}
                          </pre>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-medium text-slate-500">After</p>
                          <pre className="overflow-auto rounded-lg bg-emerald-50 p-2 text-xs text-emerald-700">
                            {JSON.stringify(log.newValue, null, 2) || 'null'}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {log.reason && (
                    <div>
                      <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">Reason</p>
                      <p className="text-sm text-slate-700">{log.reason}</p>
                    </div>
                  )}

                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-wider text-slate-400 uppercase">Log ID</p>
                    <p className="font-mono text-xs break-all text-slate-500">{log.id}</p>
                  </div>
                </div>
              )}
    </SidePanel>
  );
}

export default function AuditLogs() {
  const [filters, setFilters] = useState<AuditLogsFilters>({ page: 1, limit: 20 });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching, refetch } = useGetAuditLogsQuery(filters);
  const { data: statsData } = useGetAuditLogStatsQuery({});

  const logs = data?.data || [];
  const meta = data?.meta;
  const stats = statsData?.data;

  const handleFilterChange = (key: keyof AuditLogsFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 20 });
    setSearch('');
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => !['page', 'limit'].includes(k) && v,
  ).length;

  return (
    <div className="flex h-full w-full flex-col space-y-6 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Audit Logs"
        subtitle="Track every action across your platform"
        icon={<FiActivity />}
        actions={(
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 disabled:opacity-60"
          >
            <FiRefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      />

      {/* Stats Strip */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Total Events', value: stats.total, color: 'text-slate-800' },
            ...stats.byPool.map(p => ({
              label: p.actor_pool.replace('_', ' '),
              value: Number(p.count),
              color: 'text-blue-700',
            })),
          ].slice(0, 4).map(s => (
            <div key={s.label} className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
              <p className="mb-1 text-xs font-medium text-slate-500 capitalize">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters bar */}
      <div className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              handleFilterChange('actorId', v);
            }}
            placeholder="Search by actor ID..."
            className="min-w-48 flex-1"
          />

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${showFilters || activeFilterCount > 0 ? 'border-primary-300 bg-primary-50 text-primary-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            <FiFilter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
            <FiChevronDown className={`h-3.5 w-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
            >
              <FiX className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3 lg:grid-cols-5">
            <FormField label="Pool" id="filter-pool" labelClassName="mb-1 block text-xs font-medium text-slate-500">
              <select
                id="filter-pool"
                value={filters.pool || ''}
                onChange={e => handleFilterChange('pool', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
              >
                {POOL_OPTIONS.map(o => (
                  <option key={o} value={o}>{o || 'All Pools'}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Status" id="filter-status" labelClassName="mb-1 block text-xs font-medium text-slate-500">
              <select
                id="filter-status"
                value={filters.status || ''}
                onChange={e => handleFilterChange('status', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
              >
                {STATUS_OPTIONS.map(o => (
                  <option key={o} value={o}>{o || 'All Statuses'}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Action" id="filter-action" labelClassName="mb-1 block text-xs font-medium text-slate-500">
              <input
                id="filter-action"
                type="text"
                placeholder="e.g. login"
                value={filters.action || ''}
                onChange={e => handleFilterChange('action', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
              />
            </FormField>

            <FormField label="From" id="filter-from" labelClassName="mb-1 block text-xs font-medium text-slate-500">
              <DatePicker
                value={filters.from ? new Date(filters.from) : null}
                onChange={date => handleFilterChange('from', date ? date.toISOString().slice(0, 10) : '')}
                maxDate={filters.to ? new Date(filters.to) : undefined}
                placeholder="From"
                className="w-full"
              />
            </FormField>

            <FormField label="To" id="filter-to" labelClassName="mb-1 block text-xs font-medium text-slate-500">
              <DatePicker
                value={filters.to ? new Date(filters.to) : null}
                onChange={date => handleFilterChange('to', date ? date.toISOString().slice(0, 10) : '')}
                minDate={filters.from ? new Date(filters.from) : undefined}
                placeholder="To"
                className="w-full"
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        {isLoading || isFetching
          ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    <TableRowSkeleton cols={6} rows={8} />
                  </tbody>
                </table>
              </div>
            )
          : logs.length === 0
            ? (
                <EmptyState
                  icon={<FiList />}
                  message="No audit logs found"
                  onClear={activeFilterCount > 0 ? clearFilters : undefined}
                />
              )
            : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50/70">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Actor</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Action</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Module</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Pool</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Status</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {logs.map((log: AuditLog) => (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedLogId(log.id)}
                          className="cursor-pointer transition-colors hover:bg-primary-50/40"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-700 text-xs font-bold text-white">
                                {log.actor.firstName.charAt(0)}
                                {log.actor.lastName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">
                                  {log.actor.firstName}
                                  {' '}
                                  {log.actor.lastName}
                                </p>
                                <p className="text-xs text-slate-400">{log.actor.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-medium text-slate-700 capitalize">{log.action}</span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 capitalize">{log.module}</td>
                          <td className="px-5 py-3.5">
                            <PoolBadge pool={log.actorPool} />
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={log.status} />
                          </td>
                          <td className="px-5 py-3.5 text-xs whitespace-nowrap text-slate-400">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

        {meta && (
          <Pagination
            page={filters.page || 1}
            totalPages={meta.pages}
            total={meta.total}
            itemLabel="log"
            onPageChange={p => setFilters(prev => ({ ...prev, page: p }))}
          />
        )}
      </div>

      {selectedLogId && (
        <LogDetailPanel logId={selectedLogId} onClose={() => setSelectedLogId(null)} />
      )}
    </div>
  );
}
