'use client';

import type { PartnerListItem } from '@/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiUserPlus,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { PiEye, PiEyeSlash, PiUser } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { Loader } from '@/components/ui';
import {
  useCreatePartnerMutation,
  useGetAllPartnersQuery,
} from '@/services';
import PartnerDetail from './PartnerDetail';

type OnboardFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  region: string;
  tag: string;
  password: string;
};

export default function Partners() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active'>('all');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const limit = 10;
  const { data, isLoading } = useGetAllPartnersQuery({ page, limit });
  const [createPartner, { isLoading: isCreating }] = useCreatePartnerMutation();

  const partners = data?.data?.data || [];
  const meta = data?.data?.meta;

  const filteredPartners = partners.filter((p) => {
    const matchesSearch
      = p.first_name.toLowerCase().includes(searchTerm.toLowerCase())
        || p.last_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus
      = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OnboardFormValues>();

  const onSubmit = async (values: OnboardFormValues) => {
    try {
      await createPartner(values).unwrap();
      toast.success('Partner onboarded successfully!');
      reset();
      setShowForm(false);
      setShowPassword(false);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to create partner');
    }
  };

  if (selectedPartnerId) {
    return (
      <PartnerDetail
        partnerId={selectedPartnerId}
        onBackAction={() => setSelectedPartnerId(null)}
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-auto">
      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-linear-to-r from-primary-600 via-primary-500 to-primary-600" />
        <div className="absolute inset-0 bg-linear-to-br from-primary-400/30 to-transparent" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-300/20 blur-3xl" />

        <div className="relative flex flex-col justify-between space-y-4 px-6 py-8 md:px-8 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
              Partners
            </h1>
            <p className="text-base font-medium text-white/90 md:text-lg">
              Onboard and manage your partners
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-xl border-2 border-white/30 bg-white/20 px-5 py-3 shadow-lg backdrop-blur-sm">
              <FiUsers className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white">
                {meta?.total ?? 0}
                {' '}
                Total
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-white/30 bg-white px-5 py-3 text-sm font-bold text-primary-600 shadow-lg transition-all hover:bg-white/90"
            >
              <FiUserPlus className="h-5 w-5" />
              Onboard Partner
            </button>
          </div>
        </div>
      </div>

      {/* Onboard Form */}
      {showForm && (
        <div className="relative mb-6 px-4 md:px-6">
          <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
          <div className="relative rounded-xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Onboard New Partner</h2>
              <button
                type="button"
                onClick={() => { setShowForm(false); reset(); setShowPassword(false); }}
                className="rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor="first_name" className="mb-1 block text-sm font-medium text-slate-700">First Name</label>
                <input
                  id="first_name"
                  {...register('first_name', { required: 'First name is required' })}
                  className="input"
                  placeholder="Segun"
                />
                {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name.message}</p>}
              </div>

              <div>
                <label htmlFor="last_name" className="mb-1 block text-sm font-medium text-slate-700">Last Name</label>
                <input
                  id="last_name"
                  {...register('last_name', { required: 'Last name is required' })}
                  className="input"
                  placeholder="Afolabi"
                />
                {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="input"
                  placeholder="segun@afolabi.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="region" className="mb-1 block text-sm font-medium text-slate-700">Region</label>
                <input
                  id="region"
                  {...register('region', { required: 'Region is required' })}
                  className="input"
                  placeholder="US"
                />
                {errors.region && <p className="mt-1 text-xs text-red-500">{errors.region.message}</p>}
              </div>

              <div>
                <label htmlFor="tag" className="mb-1 block text-sm font-medium text-slate-700">Tag</label>
                <input
                  id="tag"
                  {...register('tag', { required: 'Tag is required' })}
                  className="input"
                  placeholder="RUFUS"
                />
                {errors.tag && <p className="mt-1 text-xs text-red-500">{errors.tag.message}</p>}
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
                    className="input pr-11"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? <PiEyeSlash className="h-5 w-5" /> : <PiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div className="flex items-end sm:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-linear-to-br from-primary-500 to-primary-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-500/30 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="relative flex-1 space-y-6 px-4 md:px-6">
        {/* Filters */}
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
          <div className="relative rounded-xl border border-blue-100/50 bg-white/80 p-4 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <FiSearch className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input pl-12"
                />
              </div>

              <div className="flex gap-2">
                {(['all', 'pending', 'active'] as const).map(filter => (
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

        {/* Partners Table */}
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
          <div className="relative rounded-2xl border border-blue-100/50 bg-white/80 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
            {isLoading
              ? (
                  <div className="flex h-96 items-center justify-center">
                    <Loader />
                  </div>
                )
              : filteredPartners.length === 0
                ? (
                    <div className="flex h-96 flex-col items-center justify-center p-12">
                      <PiUser className="mb-4 h-16 w-16 text-slate-300" />
                      <h3 className="mb-2 text-xl font-bold text-slate-700">No partners found</h3>
                      <p className="text-slate-500">Try adjusting your search or filters</p>
                    </div>
                  )
                : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-blue-100 bg-blue-50/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Partner</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredPartners.map((partner: PartnerListItem) => (
                            <tr key={partner.id} className="transition-colors hover:bg-blue-50/30">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 font-semibold text-white">
                                    {partner.first_name.charAt(0)}
                                    {partner.last_name.charAt(0)}
                                  </div>
                                  <p className="font-semibold text-slate-800">
                                    {partner.first_name}
                                    {' '}
                                    {partner.last_name}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                  partner.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                                >
                                  {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  type="button"
                                  onClick={() => setSelectedPartnerId(partner.id)}
                                  className="group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:bg-blue-50"
                                >
                                  <PiEye className="h-5 w-5 text-blue-600" />
                                  <span className="text-slate-700">View</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

            {/* Pagination */}
            {meta && meta.pages > 1 && (
              <div className="flex items-center justify-between border-t border-blue-100 px-6 py-4">
                <p className="text-sm text-slate-600">
                  Page
                  {' '}
                  {meta.page}
                  {' '}
                  of
                  {' '}
                  {meta.pages}
                  {' '}
                  ({meta.total}
                  {' '}
                  total)
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="rounded-lg border border-slate-200 p-2 transition-all hover:bg-slate-50 disabled:opacity-40"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
                    disabled={page >= meta.pages}
                    className="rounded-lg border border-slate-200 p-2 transition-all hover:bg-slate-50 disabled:opacity-40"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
