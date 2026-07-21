'use client';

import type { AdminBusiness, CreateBusinessRequest } from '@/types';
import {
  Badge,
  EmptyState,
  FilterPills,
  FormField,
  Modal,
  PageHeader,
  Pagination,
  SearchFilterBar,
  StatCard,
  TableRowSkeleton,
} from '@myairobotics/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiBriefcase,
  FiLayers,
  FiRefreshCw,
  FiUserPlus,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  useCreateBusinessOnboardingMutation,
  useGetAdminBusinessesQuery,
} from '@/services';
import BusinessDetail from './BusinessDetail';

type StatusFilter = 'all' | 'active' | 'inactive';

function StatusBadge({ isActive }: { isActive: boolean }) {
  return isActive
    ? <Badge className="bg-emerald-100 text-emerald-700" dot="bg-emerald-500">Active</Badge>
    : <Badge className="bg-red-100 text-red-700" dot="bg-red-500">Inactive</Badge>;
}

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export default function BusinessesManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, isFetching, refetch } = useGetAdminBusinessesQuery({
    page,
    limit: 15,
    ...(statusFilter !== 'all' && { status: statusFilter === 'active' ? 'active' : 'suspended' }),
    ...(search.trim() && { search: search.trim() }),
  });

  const [createBusiness, { isLoading: isCreating }] = useCreateBusinessOnboardingMutation();

  const businesses: AdminBusiness[] = data?.data?.data ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBusinessRequest>();

  const closeCreateModal = () => {
    setShowCreateModal(false);
    reset();
  };

  const onSubmit = async (values: CreateBusinessRequest) => {
    try {
      await createBusiness(values).unwrap();
      toast.success('Business created successfully!');
      closeCreateModal();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create business');
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
        title="Businesses"
        subtitle="Onboard and manage client business accounts"
        icon={<FiBriefcase />}
        actions={(
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25 disabled:opacity-60"
            >
              <FiRefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white px-4 py-2.5 text-sm font-bold text-primary-600 shadow-sm transition-all hover:bg-white/90"
            >
              <FiUserPlus className="h-4 w-4" />
              Create Business
            </button>
          </div>
        )}
      />

      {/* Create Business Modal */}
      <Modal
        open={showCreateModal}
        onOpenChange={(open) => {
          if (!open) {
            closeCreateModal();
          }
        }}
        title="Create Business Account"
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 sm:grid-cols-2">
          <FormField
            label="Business Name"
            id="name"
            placeholder="Acme Corp"
            error={errors.name?.message}
            {...register('name', { required: 'Business name is required' })}
          />
          <FormField
            label="Business Email"
            id="biz-email"
            type="email"
            placeholder="hello@acme.com"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />
          <FormField
            label="Phone"
            id="phone"
            placeholder="+1 555 0100"
            {...register('phone')}
          />
          <FormField
            label="Website"
            id="website"
            placeholder="https://acme.com"
            {...register('website')}
          />
          <FormField
            label="Country"
            id="country"
            placeholder="United States"
            {...register('country')}
          />
          <FormField
            label="Subscription Plan"
            id="subscription_plan"
            placeholder="Pro"
            {...register('subscription_plan')}
          />
          <FormField
            label="Address"
            id="address"
            placeholder="123 Main St, Suite 400"
            className="sm:col-span-2"
            {...register('address')}
          />
          <div className="flex items-center justify-end gap-3 sm:col-span-2">
            <button type="button" onClick={closeCreateModal} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={isCreating} className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-700 disabled:opacity-50">
              {isCreating ? 'Creating…' : 'Create Business'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={pagination?.total ?? 0} icon={<FiBriefcase />} iconBg="bg-violet-100 text-violet-600" valueColor="text-violet-700" />
      </div>

      {/* Search + filter bar */}
      <SearchFilterBar search={search} onSearch={handleSearch} placeholder="Search by name, email or country…">
        <FilterPills options={FILTERS} value={statusFilter} onChange={handleFilter} />
      </SearchFilterBar>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        {isLoading
          ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody><TableRowSkeleton cols={5} rows={8} /></tbody>
                </table>
              </div>
            )
          : businesses.length === 0
            ? (
                <EmptyState
                  icon={<FiBriefcase />}
                  message="No businesses found"
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
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Business</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase sm:table-cell">Email</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase lg:table-cell">Plan</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase xl:table-cell">Wallet</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {businesses.map((biz: AdminBusiness) => (
                        <tr key={biz.id} className="cursor-pointer transition-colors hover:bg-slate-50/70" onClick={() => setSelectedBusinessId(biz.id)}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-sm font-bold text-violet-700">
                                {biz.name.slice(0, 2).toUpperCase()}
                              </div>
                              <span className="font-semibold text-slate-800">{biz.name}</span>
                            </div>
                          </td>
                          <td className="hidden px-5 py-3.5 text-slate-500 sm:table-cell">{biz.email}</td>
                          <td className="hidden px-5 py-3.5 lg:table-cell">
                            {biz.subscription
                              ? (
                                  <Badge variant="rounded" className="bg-slate-100 text-slate-600" icon={<FiLayers className="h-3 w-3" />}>
                                    {biz.subscription.planName}
                                  </Badge>
                                )
                              : <span className="text-slate-400">N/A</span>}
                          </td>
                          <td className="hidden px-5 py-3.5 text-slate-500 xl:table-cell">{biz.walletBalance.toLocaleString()}</td>
                          <td className="px-5 py-3.5">
                            <StatusBadge isActive={biz.isActive} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

        <Pagination page={page} totalPages={totalPages} total={pagination?.total} itemLabel="business" onPageChange={setPage} />
      </div>

      {/* Business detail modal */}
      <Modal
        open={selectedBusinessId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedBusinessId(null);
          }
        }}
        title="Business Profile"
        className="max-w-lg"
      >
        {selectedBusinessId && <BusinessDetail businessId={selectedBusinessId} />}
      </Modal>
    </div>
  );
}
