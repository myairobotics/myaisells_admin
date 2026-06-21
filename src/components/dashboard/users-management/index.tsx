'use client';

import type { UserItem } from '@/types';
import { useState } from 'react';
import {
  FiActivity,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiRefreshCw,
  FiShield,
  FiToggleLeft,
  FiToggleRight,
  FiUser,
  FiUserCheck,
  FiUserX,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/global/page-header';
import { SearchInput, TableRowSkeleton } from '@/components/ui';
import {
  useGetViewUsersQuery,
  useUpdateUserStatusMutation,
} from '@/services';

type StatusFilter = 'all' | 'active' | 'inactive';

function StatusBadge({ active }: { active: boolean }) {
  return active
    ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      )
    : (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Inactive
        </span>
      );
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const [first = '', second = ''] = name.split(' ');
  const initials = `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
  const sizeClass = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg' }[size];
  return (
    <div className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-700 font-bold text-white`}>
      {initials || '?'}
    </div>
  );
}

function UserDetailPanel({
  user,
  onClose,
  onToggle,
  isToggling,
}: {
  user: UserItem;
  onClose: () => void;
  onToggle: () => void;
  isToggling: boolean;
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
        {/* Panel header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-base font-bold text-slate-800">User Profile</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <Avatar name={`${user.first_name} ${user.last_name}`} size="lg" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {user.first_name}
                {' '}
                {user.last_name}
              </h2>
              <p className="text-sm text-slate-500">@{user.username}</p>
              <div className="mt-1.5">
                <StatusBadge active={user.is_active} />
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 divide-y divide-slate-100">
            {[
              { icon: <FiMail />, label: 'Email', value: user.email },
              { icon: <FiUser />, label: 'Username', value: `@${user.username}` },
              { icon: <FiCalendar />, label: 'Member Since', value: new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
              { icon: <FiShield />, label: 'User ID', value: user.id, mono: true },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 shrink-0 text-slate-400">{row.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-400">{row.label}</p>
                  <p className={`mt-0.5 text-sm text-slate-700 break-all ${row.mono ? 'font-mono' : 'font-medium'}`}>
                    {row.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Activity placeholder */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <FiActivity className="h-3.5 w-3.5" />
              Recent Activity
            </h4>
            <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
              Activity log coming soon
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onToggle}
            disabled={isToggling}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all disabled:opacity-60 ${
              user.is_active
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
            }`}
          >
            {isToggling
              ? <FiRefreshCw className="h-4 w-4 animate-spin" />
              : user.is_active
                ? <FiUserX className="h-4 w-4" />
                : <FiUserCheck className="h-4 w-4" />}
            {user.is_active ? 'Deactivate User' : 'Activate User'}
          </button>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 15;

export default function UsersManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetViewUsersQuery();
  const [updateUserStatus, { isLoading: isToggling }] = useUpdateUserStatusMutation();

  const allUsers: UserItem[] = data?.data?.data || [];

  const filtered = allUsers.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch
      = !q
        || u.first_name.toLowerCase().includes(q)
        || u.last_name.toLowerCase().includes(q)
        || u.email.toLowerCase().includes(q)
        || u.username.toLowerCase().includes(q);
    const matchesStatus
      = statusFilter === 'all'
        || (statusFilter === 'active' && u.is_active)
        || (statusFilter === 'inactive' && !u.is_active);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalActive = allUsers.filter(u => u.is_active).length;
  const totalInactive = allUsers.filter(u => !u.is_active).length;

  const handleToggle = async (user: UserItem) => {
    try {
      await updateUserStatus({ userId: Number(user.id), status: !user.is_active }).unwrap();
      toast.success(`${user.first_name} ${user.is_active ? 'deactivated' : 'activated'} successfully`);
      refetch();
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...user, is_active: !user.is_active });
      }
    } catch {
      toast.error('Failed to update user status');
    }
  };

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Users"
        subtitle="Manage and monitor all registered platform users"
        icon={<FiUsers />}
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
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Users', value: allUsers.length, icon: <FiUsers />, color: 'text-primary-700', bg: 'bg-primary-50', iconBg: 'bg-primary-100 text-primary-600' },
          { label: 'Active', value: totalActive, icon: <FiUserCheck />, color: 'text-emerald-700', bg: 'bg-emerald-50', iconBg: 'bg-emerald-100 text-emerald-600' },
          { label: 'Inactive', value: totalInactive, icon: <FiUserX />, color: 'text-slate-700', bg: 'bg-slate-50', iconBg: 'bg-slate-100 text-slate-500' },
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
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by name, email or username…"
          className="min-w-48 flex-1"
        />

        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(['all', 'active', 'inactive'] as StatusFilter[]).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => { setStatusFilter(f); setPage(1); }}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                statusFilter === f
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
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
          : paged.length === 0
            ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3">
                  <FiUser className="h-12 w-12 text-slate-300" />
                  <p className="text-slate-500">No users match your search</p>
                  {(search || statusFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => { setSearch(''); setStatusFilter('all'); }}
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
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">User</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 sm:table-cell">Email</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 md:table-cell">Username</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 lg:table-cell">Joined</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paged.map(user => (
                        <tr
                          key={user.id}
                          className="cursor-pointer transition-colors hover:bg-slate-50/70"
                          onClick={() => setSelectedUser(user)}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Avatar name={`${user.first_name} ${user.last_name}`} size="sm" />
                              <span className="font-semibold text-slate-800">
                                {user.first_name}
                                {' '}
                                {user.last_name}
                              </span>
                            </div>
                          </td>
                          <td className="hidden px-5 py-3.5 text-slate-500 sm:table-cell">{user.email}</td>
                          <td className="hidden px-5 py-3.5 text-slate-400 md:table-cell">
                            @
                            {user.username}
                          </td>
                          <td className="hidden px-5 py-3.5 text-slate-400 lg:table-cell whitespace-nowrap">
                            {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge active={user.is_active} />
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleToggle(user); }}
                              disabled={isToggling}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all disabled:opacity-50 ${
                                user.is_active
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={user.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {user.is_active
                                ? <FiToggleRight className="h-4 w-4" />
                                : <FiToggleLeft className="h-4 w-4" />}
                              {user.is_active ? 'Deactivate' : 'Activate'}
                            </button>
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
              {filtered.length.toLocaleString()}
              {' '}
              user
              {filtered.length !== 1 ? 's' : ''}
              {statusFilter !== 'all' || search ? ' (filtered)' : ''}
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

      {/* User detail slide-over */}
      {selectedUser && (
        <UserDetailPanel
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onToggle={() => handleToggle(selectedUser)}
          isToggling={isToggling}
        />
      )}
    </div>
  );
}
