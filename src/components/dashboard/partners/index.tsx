'use client';

import type { PartnerListItem } from '@/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiChevronLeft,
  FiChevronRight,
  FiGlobe,
  FiUserPlus,
} from 'react-icons/fi';
import { PiEye, PiEyeSlash, PiUser } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/global/page-header';
import { Modal, SearchInput, TableRowSkeleton } from '@/components/ui';
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
  const [showModal, setShowModal] = useState(false);
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
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OnboardFormValues>();

  const closeModal = () => {
    setShowModal(false);
    reset();
    setShowPassword(false);
  };

  const onSubmit = async (values: OnboardFormValues) => {
    try {
      await createPartner(values).unwrap();
      toast.success('Partner onboarded successfully!');
      closeModal();
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
      <PageHeader
        title="Partners"
        subtitle="Onboard and manage your partners"
        icon={<FiGlobe />}
        actions={(
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl border border-white/30 bg-white px-4 py-2.5 text-sm font-bold text-primary-600 shadow-sm transition-all hover:bg-white/90"
          >
            <FiUserPlus className="h-4 w-4" />
            Onboard Partner
          </button>
        )}
      />

      {/* Onboard modal */}
      <Modal
        open={showModal}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
          }
        }}
        title="Onboard New Partner"
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="mb-1 block text-sm font-medium text-slate-700">First Name</label>
            <input
              id="first_name"
              {...register('first_name', { required: 'First name is required' })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 transition-all outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
              placeholder="Segun"
            />
            {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name.message}</p>}
          </div>

          <div>
            <label htmlFor="last_name" className="mb-1 block text-sm font-medium text-slate-700">Last Name</label>
            <input
              id="last_name"
              {...register('last_name', { required: 'Last name is required' })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 transition-all outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
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
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 transition-all outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
              placeholder="segun@afolabi.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="region" className="mb-1 block text-sm font-medium text-slate-700">Region</label>
            <input
              id="region"
              {...register('region', { required: 'Region is required' })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 transition-all outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
              placeholder="US"
            />
            {errors.region && <p className="mt-1 text-xs text-red-500">{errors.region.message}</p>}
          </div>

          <div>
            <label htmlFor="tag" className="mb-1 block text-sm font-medium text-slate-700">Tag</label>
            <input
              id="tag"
              {...register('tag', { required: 'Tag is required' })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 transition-all outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
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
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pr-11 pl-3.5 text-sm text-slate-700 transition-all outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
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

          <div className="flex items-center justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-700 disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Partner'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="relative flex-1 space-y-4">
        {/* Search + filter bar */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/60 bg-white p-3 shadow-sm">
          <SearchInput
            value={searchTerm}
            onChange={(v) => {
              setSearchTerm(v);
              setPage(1);
            }}
            placeholder="Search by name..."
            className="min-w-48 flex-1"
          />

          <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {(['all', 'pending', 'active'] as const).map(filter => (
              <button
                type="button"
                key={filter}
                onClick={() => {
                  setStatusFilter(filter);
                  setPage(1);
                }}
                className={`rounded-md px-3.5 py-2 text-xs font-semibold capitalize transition-all ${
                  statusFilter === filter
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Partners Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
          {isLoading
            ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      <TableRowSkeleton cols={3} rows={8} />
                    </tbody>
                  </table>
                </div>
              )
            : filteredPartners.length === 0
              ? (
                  <div className="flex h-64 flex-col items-center justify-center gap-3">
                    <PiUser className="h-12 w-12 text-slate-300" />
                    <p className="text-slate-500">No partners found</p>
                    {(searchTerm || statusFilter !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
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
                          <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Partner</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Status</th>
                          <th className="px-5 py-3 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPartners.map((partner: PartnerListItem) => (
                          <tr key={partner.id} className="transition-colors hover:bg-slate-50/70">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-700 text-sm font-bold text-white">
                                  {partner.first_name.charAt(0)}
                                  {partner.last_name.charAt(0)}
                                </div>
                                <span className="font-semibold text-slate-800">
                                  {partner.first_name}
                                  {' '}
                                  {partner.last_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                partner.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${partner.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedPartnerId(partner.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-primary-600 transition-all hover:bg-primary-50"
                              >
                                <PiEye className="h-4 w-4" />
                                View
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
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5">
              <p className="text-sm text-slate-500">
                Page
                {' '}
                {meta.page}
                {' '}
                of
                {' '}
                {meta.pages}
                {' '}
                (
                {meta.total}
                {' '}
                total)
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
                <button
                  type="button"
                  onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
                  disabled={page >= meta.pages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition-all hover:bg-slate-50 disabled:opacity-40"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
