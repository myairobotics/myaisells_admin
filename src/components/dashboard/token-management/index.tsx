'use client';

import type { TokenAllocation, TokenTransaction, TokenTransactionType } from '@/types';
import { useState } from 'react';
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiCalendar,
  FiRefreshCw,
  FiRotateCcw,
  FiUser,
  FiZap,
} from 'react-icons/fi';
import { PageHeader } from '@/components/global/page-header';
import { EmptyState, Pagination, SearchFilterBar, SidePanel, StatCard, TableRowSkeleton } from '@/components/ui';
import { useGetTokenAllocationsQuery, useGetTokenTransactionsQuery } from '@/services';

/* ─── Helpers ─────────────────────────────────────────────────────── */

function formatTokens(n: number) {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1)}K`;
  }
  return n.toLocaleString();
}

function consumptionPct(consumed: number, allocated: number) {
  if (!allocated) {
    return 0;
  }
  return Math.min(100, Math.round((consumed / allocated) * 100));
}

function pctColor(pct: number) {
  if (pct >= 90) {
    return { bar: 'bg-red-500', text: 'text-red-600' };
  }
  if (pct >= 70) {
    return { bar: 'bg-amber-500', text: 'text-amber-600' };
  }
  return { bar: 'bg-indigo-500', text: 'text-indigo-600' };
}

/* ─── Transaction type config ─────────────────────────────────────── */

const TX_CONFIG: Record<TokenTransactionType, { label: string; icon: React.ReactNode; badge: string; sign: string }> = {
  topup: { label: 'Top-up', icon: <FiArrowUpRight />, badge: 'bg-emerald-100 text-emerald-700', sign: '+' },
  allocation: { label: 'Allocation', icon: <FiZap />, badge: 'bg-indigo-100 text-indigo-700', sign: '+' },
  deduct: { label: 'Deduction', icon: <FiArrowDownLeft />, badge: 'bg-red-100 text-red-700', sign: '-' },
  refund: { label: 'Refund', icon: <FiRotateCcw />, badge: 'bg-teal-100 text-teal-700', sign: '+' },
  expiry: { label: 'Expiry', icon: <FiArrowDownLeft />, badge: 'bg-slate-100 text-slate-500', sign: '-' },
};

/* ─── Token usage bar ─────────────────────────────────────────────── */

function UsageBar({ consumed, allocated }: { consumed: number; allocated: number }) {
  const pct = consumptionPct(consumed, allocated);
  const { bar, text } = pctColor(pct);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full transition-all ${bar}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-medium ${text}`}>
        {pct}
        %
      </span>
    </div>
  );
}

/* ─── Transaction history panel ───────────────────────────────────── */

function TransactionPanel({
  allocation,
  onClose,
}: {
  allocation: TokenAllocation;
  onClose: () => void;
}) {
  const [txPage, setTxPage] = useState(1);
  const { data, isLoading } = useGetTokenTransactionsQuery({
    businessId: allocation.business_id,
    page: txPage,
    limit: 20,
  });

  const transactions: TokenTransaction[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const totalPages = meta?.pages ?? 1;
  const pct = consumptionPct(allocation.consumed_tokens, allocation.allocated_tokens);
  const { bar } = pctColor(pct);

  return (
    <SidePanel
      open={true}
      onClose={onClose}
      title={allocation.business_name}
      subtitle="Token history"
      maxWidth="max-w-lg"
      footer={<Pagination page={txPage} totalPages={totalPages} total={meta?.total} itemLabel="transaction" onPageChange={setTxPage} />}
    >
      {/* Summary strip */}
      <div className="-mx-6 -mt-6 mb-4 grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
        {[
          { label: 'Allocated', value: formatTokens(allocation.allocated_tokens), color: 'text-indigo-700' },
          { label: 'Consumed', value: formatTokens(allocation.consumed_tokens), color: 'text-amber-700' },
          { label: 'Remaining', value: formatTokens(allocation.remaining_tokens), color: 'text-emerald-700' },
        ].map(s => (
          <div key={s.label} className="px-4 py-3 text-center">
            <p className="text-xs font-medium text-slate-400">{s.label}</p>
            <p className={`mt-0.5 text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Usage bar */}
      <div className="-mx-6 mb-4 border-b border-slate-100 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Usage</span>
          <span className="font-medium">
            {pct}
            %
          </span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
          <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Transactions list */}
      <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">Transactions</p>
      {isLoading
        ? <div className="space-y-2">{Array.from({ length: 6 }, (_, i) => `skel-${i}`).map(key => <div key={key} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}</div>
        : transactions.length === 0
          ? (
              <div className="flex h-32 items-center justify-center text-sm text-slate-400">
                No transactions found
              </div>
            )
          : (
              <div className="space-y-2">
                {transactions.map((tx) => {
                  const cfg = TX_CONFIG[tx.type] ?? TX_CONFIG.deduct;
                  const isCredit = tx.type === 'topup' || tx.type === 'allocation' || tx.type === 'refund';
                  return (
                    <div key={tx.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${cfg.badge}`}>
                        {cfg.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.badge}`}>{cfg.label}</span>
                          {tx.performed_by && (
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                              <FiUser className="h-3 w-3" />
                              {tx.performed_by}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {new Date(tx.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className={`text-sm font-bold ${isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                          {cfg.sign}
                          {formatTokens(tx.amount)}
                        </p>
                        <p className="text-xs text-slate-400">
                          bal:
                          {formatTokens(tx.balance_after)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
    </SidePanel>
  );
}

/* ─── Main component ──────────────────────────────────────────────── */

export default function TokenManagement() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<TokenAllocation | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetTokenAllocationsQuery({
    page,
    limit: 15,
    ...(search.trim() && { search: search.trim() }),
  });

  const allocations: TokenAllocation[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const summary = data?.data?.summary;
  const totalPages = meta?.pages ?? 1;

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Token Management"
        subtitle="Monitor and manage AI token allocations across all businesses"
        icon={<FiZap />}
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

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Allocated" value={summary ? formatTokens(summary.total_allocated) : '—'} icon={<FiZap />} iconBg="bg-indigo-100 text-indigo-600" valueColor="text-indigo-700" />
        <StatCard label="Total Consumed" value={summary ? formatTokens(summary.total_consumed) : '—'} icon={<FiArrowDownLeft />} iconBg="bg-amber-100 text-amber-600" valueColor="text-amber-700" />
        <StatCard label="Remaining" value={summary ? formatTokens(summary.total_remaining) : '—'} icon={<FiArrowUpRight />} iconBg="bg-emerald-100 text-emerald-600" valueColor="text-emerald-700" />
        <StatCard label="Active Businesses" value={summary ? summary.active_businesses.toLocaleString() : '—'} icon={<FiCalendar />} iconBg="bg-violet-100 text-violet-600" valueColor="text-violet-700" />
      </div>

      <SearchFilterBar
        search={search}
        onSearch={handleSearch}
        placeholder="Search by business name…"
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        {isLoading
          ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    <TableRowSkeleton cols={5} rows={8} />
                  </tbody>
                </table>
              </div>
            )
          : allocations.length === 0
            ? (
                <EmptyState
                  icon={<FiZap />}
                  message="No token allocations found"
                  onClear={search ? () => setSearch('') : undefined}
                  clearLabel="Clear search"
                />
              )
            : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50/70">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Business</th>
                        <th className="hidden px-5 py-3 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase sm:table-cell">Allocated</th>
                        <th className="hidden px-5 py-3 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase md:table-cell">Consumed</th>
                        <th className="hidden px-5 py-3 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase lg:table-cell">Remaining</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Usage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allocations.map((a) => {
                        const pct = consumptionPct(a.consumed_tokens, a.allocated_tokens);
                        return (
                          <tr
                            key={a.id}
                            className="cursor-pointer transition-colors hover:bg-slate-50/70"
                            onClick={() => setSelected(a)}
                          >
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">
                                  {a.business_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-800">{a.business_name}</p>
                                  {a.last_topup_at && (
                                    <p className="text-xs text-slate-400">
                                      Last top-up:
                                      {' '}
                                      {new Date(a.last_topup_at).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="hidden px-5 py-3.5 text-right font-medium text-slate-700 sm:table-cell">
                              {formatTokens(a.allocated_tokens)}
                            </td>
                            <td className="hidden px-5 py-3.5 text-right text-amber-600 md:table-cell">
                              {formatTokens(a.consumed_tokens)}
                            </td>
                            <td className="hidden px-5 py-3.5 text-right text-emerald-600 lg:table-cell">
                              {formatTokens(a.remaining_tokens)}
                            </td>
                            <td className="px-5 py-3.5">
                              {pct >= 90
                                ? (
                                    <div className="flex flex-col gap-1">
                                      <UsageBar consumed={a.consumed_tokens} allocated={a.allocated_tokens} />
                                      <span className="text-xs font-semibold text-red-600">Critical</span>
                                    </div>
                                  )
                                : <UsageBar consumed={a.consumed_tokens} allocated={a.allocated_tokens} />}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

        <Pagination page={page} totalPages={totalPages} total={meta?.total} itemLabel="business" onPageChange={setPage} />
      </div>

      {selected && (
        <TransactionPanel allocation={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
