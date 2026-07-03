'use client';

import type { PartnerListItem, PartnerStatus } from '@/types';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiGlobe,
  FiUserPlus,
} from 'react-icons/fi';
import { PiEye, PiEyeSlash, PiUser } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/global/page-header';
import {
  Avatar,
  Badge,
  EmptyState,
  FilterPills,
  FormField,
  Modal,
  Pagination,
  SearchFilterBar,
  TableRowSkeleton,
} from '@/components/ui';
import {
  useCreatePartnerMutation,
  useGetAllPartnersQuery,
} from '@/services';

type OnboardFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  region: string;
  tag: string;
  password: string;
};

const STATUS_BADGE: Record<PartnerStatus, { badge: string; dot: string }> = {
  active: { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  pending: { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  suspended: { badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  cancelled: { badge: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
};

export default function Partners() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PartnerStatus>('all');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const limit = 10;
  const { data, isLoading } = useGetAllPartnersQuery({ page, limit, search: searchTerm || undefined });
  const [createPartner, { isLoading: isCreating }] = useCreatePartnerMutation();

  const partners = data?.data?.data || [];
  const meta = data?.data?.meta;

  const filteredPartners = partners.filter(p => statusFilter === 'all' || p.status === statusFilter);

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
          <FormField
            label="First Name"
            id="first_name"
            placeholder="Segun"
            error={errors.first_name?.message}
            {...register('first_name', { required: 'First name is required' })}
          />

          <FormField
            label="Last Name"
            id="last_name"
            placeholder="Afolabi"
            error={errors.last_name?.message}
            {...register('last_name', { required: 'Last name is required' })}
          />

          <FormField
            label="Email"
            id="email"
            type="email"
            placeholder="segun@afolabi.com"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />

          <FormField
            label="Region"
            id="region"
            placeholder="US"
            error={errors.region?.message}
            {...register('region', { required: 'Region is required' })}
          />

          <FormField
            label="Tag"
            id="tag"
            placeholder="RUFUS"
            error={errors.tag?.message}
            {...register('tag', { required: 'Tag is required' })}
          />

          <FormField label="Password" id="password" error={errors.password?.message}>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-11 pl-3.5 text-sm text-slate-700 transition-all outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
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
          </FormField>

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
        <SearchFilterBar
          search={searchTerm}
          onSearch={(v) => {
            setSearchTerm(v);
            setPage(1);
          }}
          placeholder="Search by name..."
        >
          <FilterPills
            options={[
              { value: 'all', label: 'All' },
              { value: 'pending', label: 'Pending' },
              { value: 'active', label: 'Active' },
              { value: 'suspended', label: 'Suspended' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            value={statusFilter}
            onChange={(f) => {
              setStatusFilter(f);
              setPage(1);
            }}
          />
        </SearchFilterBar>

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
                  <EmptyState
                    icon={<PiUser />}
                    message="No partners found"
                    onClear={searchTerm || statusFilter !== 'all'
                      ? () => {
                          setSearchTerm('');
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
                                <Avatar name={`${partner.first_name} ${partner.last_name}`} size="md" />
                                <span className="font-semibold text-slate-800">
                                  {partner.first_name}
                                  {' '}
                                  {partner.last_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <Badge
                                className={STATUS_BADGE[partner.status]?.badge ?? STATUS_BADGE.pending.badge}
                                dot={STATUS_BADGE[partner.status]?.dot ?? STATUS_BADGE.pending.dot}
                              >
                                {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <Link
                                href={`/partners/${partner.id}`}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-primary-600 transition-all hover:bg-primary-50"
                              >
                                <PiEye className="h-4 w-4" />
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

          <Pagination page={page} totalPages={meta?.pages ?? 1} total={meta?.total} itemLabel="partner" onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
