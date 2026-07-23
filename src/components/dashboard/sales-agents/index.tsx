'use client';

import type { SalesAgent, SalesAgentStatus } from '@/types';
import {
  Avatar,
  Badge,
  EmptyState,
  FilterPills,
  PageHeader,
  Pagination,
  SearchFilterBar,
  SidePanel,
  StatCard,
  TableRowSkeleton,
} from '@myairobotics/ui';
import { useState } from 'react';
import {
  FiAward,
  FiCalendar,
  FiClock,
  FiGlobe,
  FiHash,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiTag,
  FiUser,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi';
import { useGetAdminSalesAgentsQuery } from '@/services';

type StatusFilter = 'all' | SalesAgentStatus;

const STATUS_CONFIG: Record<SalesAgentStatus, { label: string; dot: string; badge: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  pending: { label: 'Pending', dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
  suspended: { label: 'Suspended', dot: 'bg-red-500', badge: 'bg-red-100 text-red-700' },
  deactivated: { label: 'Deactivated', dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-500' },
  archived: { label: 'Archived', dot: 'bg-slate-300', badge: 'bg-slate-100 text-slate-400' },
};

const AGENT_TYPE_CONFIG = {
  global: { label: 'Global', badge: 'bg-orange-100 text-orange-700' },
  partner: { label: 'Partner', badge: 'bg-teal-100 text-teal-700' },
};

function StatusBadge({ status }: { status: SalesAgentStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return <Badge className={cfg.badge} dot={cfg.dot}>{cfg.label}</Badge>;
}

function AgentTypeBadge({ type }: { type: 'global' | 'partner' }) {
  const cfg = AGENT_TYPE_CONFIG[type] ?? AGENT_TYPE_CONFIG.global;
  return (
    <Badge variant="rounded" className={cfg.badge} icon={type === 'global' ? <FiGlobe className="h-3 w-3" /> : <FiAward className="h-3 w-3" />}>
      {cfg.label}
    </Badge>
  );
}

function agentFullName(agent: SalesAgent) {
  return `${agent.first_name} ${agent.last_name}`;
}

function agentTerritory(agent: SalesAgent) {
  const parts = [agent.city, agent.state, agent.country].filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}

function SalesAgentDetailPanel({ agent, onClose }: { agent: SalesAgent; onClose: () => void }) {
  const territory = agentTerritory(agent);

  return (
    <SidePanel open={true} onClose={onClose} title="Agent Profile">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar name={agentFullName(agent)} size="lg" shape="rounded" gradient="from-orange-500 to-amber-600" />
          <div>
            <h2 className="text-xl font-bold text-slate-800">{agentFullName(agent)}</h2>
            {territory && <p className="mt-0.5 text-sm text-slate-500">{territory}</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge status={agent.status} />
              <AgentTypeBadge type={agent.agent_type} />
            </div>
          </div>
        </div>

        {agent.assigned_businesses_count !== undefined && (
          <div className="rounded-xl border border-slate-100 bg-orange-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                <FiUsers className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Assigned Businesses</p>
                <p className="text-2xl font-bold text-orange-700">{agent.assigned_businesses_count.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
          {[
            { icon: <FiMail />, label: 'Email', value: agent.email },
            ...(agent.phone ? [{ icon: <FiPhone />, label: 'Phone', value: agent.phone }] : []),
            ...(agent.referral_code ? [{ icon: <FiHash />, label: 'Referral Code', value: agent.referral_code, mono: true }] : []),
            ...(territory ? [{ icon: <FiMapPin />, label: 'Territory', value: territory }] : []),
            ...(agent.region ? [{ icon: <FiGlobe />, label: 'Region', value: agent.region }] : []),
            ...(agent.partner_name ? [{ icon: <FiAward />, label: 'Partner Account', value: agent.partner_name }] : []),
            ...(agent.created_by ? [{ icon: <FiUser />, label: 'Created By', value: agent.created_by }] : []),
            ...(agent.last_login_at ? [{ icon: <FiClock />, label: 'Last Login', value: new Date(agent.last_login_at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }] : []),
            { icon: <FiCalendar />, label: 'Joined', value: new Date(agent.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
            { icon: <FiTag />, label: 'Agent ID', value: agent.id, mono: true },
          ].map(row => (
            <div key={row.label} className="flex items-start gap-3 px-4 py-3">
              <span className="mt-0.5 shrink-0 text-slate-400">{row.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-400">{row.label}</p>
                <p className={`mt-0.5 text-sm break-all text-slate-700 ${'mono' in row && row.mono ? 'font-mono' : 'font-medium'}`}>{String(row.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidePanel>
  );
}

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'deactivated', label: 'Deactivated' },
];

export default function SalesAgentsManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [selectedAgent, setSelectedAgent] = useState<SalesAgent | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetAdminSalesAgentsQuery({
    page,
    limit: 15,
    ...(statusFilter !== 'all' && { status: statusFilter }),
    ...(search.trim() && { search: search.trim() }),
  });

  const agents: SalesAgent[] = data?.data?.data ?? [];
  const meta = data?.data?.meta;
  const totalPages = meta?.pages ?? 1;

  const totalActive = agents.filter(a => a.status === 'active').length;
  const totalPending = agents.filter(a => a.status === 'pending').length;
  const totalSuspended = agents.filter(a => a.status === 'suspended').length;

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
        title="Sales Agents"
        subtitle="Manage global and partner sales representatives"
        icon={<FiUserCheck />}
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Agents" value={meta?.total ?? agents.length} icon={<FiUserCheck />} iconBg="bg-orange-100 text-orange-600" valueColor="text-orange-700" />
        <StatCard label="Active" value={totalActive} icon={<FiUsers />} iconBg="bg-emerald-100 text-emerald-600" valueColor="text-emerald-700" />
        <StatCard label="Pending" value={totalPending} icon={<FiClock />} iconBg="bg-amber-100 text-amber-600" valueColor="text-amber-700" />
        <StatCard label="Suspended" value={totalSuspended} icon={<FiGlobe />} iconBg="bg-red-100 text-red-500" valueColor="text-red-600" />
      </div>

      <SearchFilterBar
        search={search}
        onSearch={handleSearch}
        placeholder="Search by name, email or territory…"
      >
        <FilterPills options={FILTERS} value={statusFilter} onChange={handleFilter} />
      </SearchFilterBar>

      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        {isLoading
          ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody><TableRowSkeleton cols={6} rows={8} /></tbody>
                </table>
              </div>
            )
          : agents.length === 0
            ? (
                <EmptyState
                  icon={<FiUserCheck />}
                  message="No sales agents found"
                  onClear={search || statusFilter !== 'all'
                    ? () => {
                        setSearch('');
                        setStatusFilter('all');
                      }
                    : undefined}
                />
              )
            : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50/70">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Agent</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase sm:table-cell">Email</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase md:table-cell">Territory</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase lg:table-cell">Type</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase xl:table-cell">Referral Code</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {agents.map(agent => (
                        <tr key={agent.id} className="cursor-pointer transition-colors hover:bg-slate-50/70" onClick={() => setSelectedAgent(agent)}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Avatar name={agentFullName(agent)} size="md" shape="rounded" gradient="from-orange-400 to-amber-500" />
                              <div>
                                <p className="font-semibold text-slate-800">{agentFullName(agent)}</p>
                                {agent.assigned_businesses_count !== undefined && (
                                  <p className="text-xs text-slate-400">
                                    {agent.assigned_businesses_count}
                                    {' '}
                                    {agent.assigned_businesses_count === 1 ? 'business' : 'businesses'}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-5 py-3.5 text-slate-500 sm:table-cell">{agent.email}</td>
                          <td className="hidden px-5 py-3.5 text-slate-500 md:table-cell">{agentTerritory(agent) ?? <span className="text-slate-400">N/A</span>}</td>
                          <td className="hidden px-5 py-3.5 lg:table-cell"><AgentTypeBadge type={agent.agent_type} /></td>
                          <td className="hidden px-5 py-3.5 xl:table-cell">
                            {agent.referral_code ? <span className="font-mono text-xs text-slate-600">{agent.referral_code}</span> : <span className="text-slate-400">N/A</span>}
                          </td>
                          <td className="px-5 py-3.5"><StatusBadge status={agent.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

        <Pagination page={page} totalPages={totalPages} total={meta?.total ?? agents.length} itemLabel="agent" onPageChange={setPage} />
      </div>

      {selectedAgent && (
        <SalesAgentDetailPanel agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
}
