'use client';

import type { UserItem } from '@/types';
import { useState } from 'react';
import { FiSearch, FiToggleLeft, FiToggleRight, FiUsers } from 'react-icons/fi';
import { PiCheckCircle, PiUser, PiXCircle } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { Loader } from '@/components/ui';
import {
  useGetViewUsersQuery,
  useUpdateUserStatusMutation,
} from '@/services';

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const { data, isLoading, refetch } = useGetViewUsersQuery('');
  const [updateUserStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

  const users = data?.data?.data || [];
  const meta = data?.data?.meta;

  const filteredUsers = users.filter((user) => {
    const matchesSearch
      = user.email.toLowerCase().includes(searchTerm.toLowerCase())
        || user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
        || user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
        || user.username.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus
      = statusFilter === 'all'
        || (statusFilter === 'active' && user.is_active)
        || (statusFilter === 'inactive' && !user.is_active);

    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (user: UserItem) => {
    try {
      await updateUserStatus({
        userId: Number(user.id),
        status: !user.is_active,
      }).unwrap();

      toast.success(
        `User ${user.is_active ? 'deactivated' : 'activated'} successfully!`,
      );
      refetch();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update user status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const activeUsers = users.filter(u => u.is_active).length;
  const inactiveUsers = users.filter(u => !u.is_active).length;

  return (
    <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-auto">
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-linear-to-r from-primary-600 via-primary-500 to-primary-600" />
        <div className="absolute inset-0 bg-linear-to-br from-primary-400/30 to-transparent" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-300/20 blur-3xl" />

        <div className="relative flex flex-col justify-between space-y-4 px-6 py-8 md:px-8 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
              Users Management 👥
            </h1>
            <p className="text-base font-medium text-white/90 md:text-lg">
              Manage and monitor all registered users
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-xl border-2 border-white/30 bg-white/20 px-5 py-3 shadow-lg backdrop-blur-sm">
              <PiCheckCircle className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white">
                {activeUsers}
                {' '}
                Active
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border-2 border-white/30 bg-white/20 px-5 py-3 shadow-lg backdrop-blur-sm">
              <PiXCircle className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white">
                {inactiveUsers}
                {' '}
                Inactive
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 space-y-6 px-4 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
            <div className="relative rounded-xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600">
                  <FiUsers className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold text-slate-800">{meta?.total || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-green-50/30 to-emerald-50/20 blur-xl" />
            <div className="relative rounded-xl border border-green-100/50 bg-white/80 p-6 shadow-xl shadow-green-500/5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-green-500 to-emerald-600">
                  <PiCheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Active</p>
                  <p className="text-2xl font-bold text-slate-800">{activeUsers}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-red-50/30 to-rose-50/20 blur-xl" />
            <div className="relative rounded-xl border border-red-100/50 bg-white/80 p-6 shadow-xl shadow-red-500/5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-red-500 to-rose-600">
                  <PiXCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Inactive</p>
                  <p className="text-2xl font-bold text-slate-800">{inactiveUsers}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
          <div className="relative rounded-xl border border-blue-100/50 bg-white/80 p-4 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <FiSearch className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or username..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input pl-12"
                />
              </div>

              <div className="flex gap-2">
                {(['all', 'active', 'inactive'] as const).map(filter => (
                  <button
                    type="button"
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      statusFilter === filter
                        ? 'bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
          <div className="relative rounded-2xl border border-blue-100/50 bg-white/80 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
            {isLoading
              ? (
                  <div className="flex h-96 items-center justify-center">
                    <Loader />
                  </div>
                )
              : filteredUsers.length === 0
                ? (
                    <div className="flex h-96 flex-col items-center justify-center p-12">
                      <PiUser className="mb-4 h-16 w-16 text-slate-300" />
                      <h3 className="mb-2 text-xl font-bold text-slate-700">No users found</h3>
                      <p className="text-slate-500">Try adjusting your search or filters</p>
                    </div>
                  )
                : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-blue-100 bg-blue-50/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">User</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Username</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Joined</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredUsers.map(user => (
                            <tr key={user.id} className="transition-colors hover:bg-blue-50/30">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 font-semibold text-white">
                                    {user.first_name.charAt(0)}
                                    {user.last_name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-800">
                                      {user.first_name}
                                      {' '}
                                      {user.last_name}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                @
                                {user.username}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">{formatDate(user.created_at)}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                  user.is_active
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                                >
                                  {user.is_active
                                    ? (
                                        <>
                                          <PiCheckCircle className="h-3.5 w-3.5" />
                                          {' '}
                                          Active
                                        </>
                                      )
                                    : (
                                        <>
                                          <PiXCircle className="h-3.5 w-3.5" />
                                          {' '}
                                          Inactive
                                        </>
                                      )}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(user)}
                                  disabled={isUpdating}
                                  className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:bg-blue-50 disabled:opacity-50"
                                >
                                  {user.is_active
                                    ? (
                                        <>
                                          <FiToggleRight className="h-5 w-5 text-green-600" />
                                          <span className="text-slate-700">Deactivate</span>
                                        </>
                                      )
                                    : (
                                        <>
                                          <FiToggleLeft className="h-5 w-5 text-red-600" />
                                          <span className="text-slate-700">Activate</span>
                                        </>
                                      )}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
          </div>
        </div>
      </div>
    </div>
  );
}
