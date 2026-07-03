'use client';

import type { AttributionSource, ReferredUser } from '@/types';
import { useState } from 'react';
import {
  FiArrowRight,
  FiLink,
  FiPercent,
  FiRefreshCw,
  FiUsers,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/global/page-header';
import { Badge, EmptyState, FormField, Modal, Pagination, StatCard, TableRowSkeleton } from '@/components/ui';
import {
  useGetReferralMetricsQuery,
  useGetReferredUsersQuery,
  useReassignReferralCodeMutation,
} from '@/services';

/* ─── Config ──────────────────────────────────────────────────────── */

const SOURCE_LABELS: Record<AttributionSource, { label: string; badge: string }> = {
  partner: { label: 'Partner', badge: 'bg-violet-100 text-violet-700' },
  partner_team_member: { label: 'Partner Agent', badge: 'bg-orange-100 text-orange-700' },
  admin: { label: 'Admin', badge: 'bg-sky-100 text-sky-700' },
  direct: { label: 'Direct', badge: 'bg-slate-100 text-slate-600' },
};

function SourceBadge({ source }: { source: AttributionSource }) {
  const cfg = SOURCE_LABELS[source] ?? SOURCE_LABELS.direct;
  return <Badge variant="rounded" className={cfg.badge}>{cfg.label}</Badge>;
}

/* ─── Reassign Modal content ──────────────────────────────────────── */

function ReassignForm({ user, onClose }: { user: ReferredUser; onClose: () => void }) {
  const [referralCode, setReferralCode] = useState('');
  const [reason, setReason] = useState('');
  const [reassign, { isLoading }] = useReassignReferralCodeMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralCode.trim() || !reason.trim()) {
      return;
    }
    try {
      await reassign({ userId: user.appUserId, referralCode: referralCode.trim(), reason: reason.trim() }).unwrap();
      toast.success('Referral code reassigned successfully');
      onClose();
    } catch {
      toast.error('Failed to reassign referral code');
    }
  };

  return (
    <>
      <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
        <p className="text-xs text-slate-500">Reassigning for</p>
        <p className="font-semibold text-slate-800">
          {user.firstName}
          {' '}
          {user.lastName}
        </p>
        <p className="text-sm text-slate-500">{user.email}</p>
        <p className="mt-1 font-mono text-xs text-slate-500">
          Current:
          {' '}
          {user.referralCode}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="New Referral Code" id="referral-code">
          <input
            id="referral-code"
            type="text"
            value={referralCode}
            onChange={e => setReferralCode(e.target.value)}
            placeholder="e.g. AGT-202F3F6F9B"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            required
          />
        </FormField>

        <FormField label="Reason" id="reason">
          <textarea
            id="reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Explain why the referral code is being reassigned…"
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            required
          />
        </FormField>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !referralCode.trim() || !reason.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {isLoading ? 'Reassigning…' : 'Reassign'}
          </button>
        </div>
      </form>
    </>
  );
}

/* ─── Main ────────────────────────────────────────────────────────── */

export default function ReferralManagement() {
  const [page, setPage] = useState(1);
  const [reassignTarget, setReassignTarget] = useState<ReferredUser | null>(null);

  const { data: metricsData, isLoading: metricsLoading, refetch } = useGetReferralMetricsQuery();
  const { data: usersData, isLoading: usersLoading, isFetching } = useGetReferredUsersQuery({ page, limit: 15 });

  const metrics = metricsData?.data;
  const rows = usersData?.data?.rows ?? [];
  const total = usersData?.data?.total ?? 0;
  const pageSize = usersData?.data?.pageSize ?? 15;
  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Referral Management"
        subtitle="Track referral attribution, source breakdown, and user reassignment"
        icon={<FiLink />}
        actions={(
          <button
            type="button"
            onClick={() => refetch()}
            disabled={metricsLoading}
            className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25 disabled:opacity-60"
          >
            <FiRefreshCw className={`h-4 w-4 ${metricsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      />

      {/* Metrics strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Users" value={metrics?.totalUsers ?? 0} icon={<FiUsers />} iconBg="bg-sky-100 text-sky-600" valueColor="text-sky-700" />
        <StatCard label="Referred" value={metrics?.totalReferred ?? 0} icon={<FiLink />} iconBg="bg-emerald-100 text-emerald-600" valueColor="text-emerald-700" />
        <StatCard label="Direct" value={metrics?.totalDirect ?? 0} icon={<FiArrowRight />} iconBg="bg-slate-100 text-slate-600" valueColor="text-slate-700" />
        <StatCard label="Referred %" value={`${(metrics?.referredPercentage ?? 0).toFixed(1)}%`} icon={<FiPercent />} iconBg="bg-violet-100 text-violet-600" valueColor="text-violet-700" />
      </div>

      {/* Source breakdown + Top partners */}
      {!metricsLoading && metrics && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* By source */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Attribution by Source</h3>
            <div className="space-y-2.5">
              {metrics.bySource.map(s => (
                <div key={s.source} className="flex items-center gap-3">
                  <SourceBadge source={s.source as AttributionSource} />
                  <div className="flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                  <span className="w-14 text-right text-xs font-semibold text-slate-600">
                    {s.count}
                    {' '}
                    (
                    {s.percentage.toFixed(0)}
                    %)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top partners */}
          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Top Partners</h3>
            {metrics.topPartners.length === 0
              ? (
                  <p className="text-sm text-slate-400">No partner data yet</p>
                )
              : (
                  <div className="space-y-2">
                    {metrics.topPartners.map((p, i) => (
                      <div key={p.partnerId} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                            {i + 1}
                          </span>
                          <span className="text-sm font-medium text-slate-700">{p.partnerName}</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">
                          {p.referredCount}
                          {' '}
                          <span className="text-xs font-normal text-slate-400">referred</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
          </div>
        </div>
      )}

      {/* Referred users table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-3.5">
          <h3 className="text-sm font-semibold text-slate-700">
            Referred Users
            {total > 0 && (
              <Badge className="ml-2 bg-emerald-100 text-emerald-700">{total.toLocaleString()}</Badge>
            )}
          </h3>
        </div>

        {usersLoading
          ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><tbody><TableRowSkeleton cols={5} rows={8} /></tbody></table>
              </div>
            )
          : rows.length === 0
            ? (
                <EmptyState icon={<FiUsers />} message="No referred users yet" />
              )
            : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50/70">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">User</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase md:table-cell">Referral Code</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase lg:table-cell">Source</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase xl:table-cell">Partner / Agent</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Joined</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rows.map(user => (
                        <tr key={user.appUserId} className="transition-colors hover:bg-slate-50/70">
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-slate-800">
                              {user.firstName}
                              {' '}
                              {user.lastName}
                            </p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </td>
                          <td className="hidden px-5 py-3.5 md:table-cell">
                            <span className="font-mono text-xs font-bold tracking-wider text-slate-700">{user.referralCode}</span>
                          </td>
                          <td className="hidden px-5 py-3.5 lg:table-cell">
                            <SourceBadge source={user.attributionSource} />
                          </td>
                          <td className="hidden px-5 py-3.5 text-sm text-slate-600 xl:table-cell">
                            {user.partnerName ?? user.adminName ?? '—'}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-slate-500">
                            {new Date(user.dateJoined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => setReassignTarget(user)}
                              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              Reassign
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          itemLabel="user"
          onPageChange={(p) => {
            if (!isFetching) {
              setPage(p);
            }
          }}
        />
      </div>

      <Modal
        open={reassignTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setReassignTarget(null);
          }
        }}
        title="Reassign Referral Code"
        className="max-w-md"
      >
        {reassignTarget && (
          <ReassignForm user={reassignTarget} onClose={() => setReassignTarget(null)} />
        )}
      </Modal>
    </div>
  );
}
