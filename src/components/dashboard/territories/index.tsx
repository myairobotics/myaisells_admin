'use client';

import type { CreateTerritoryRequest, Territory, TerritoryType } from '@/types';
import {
  Badge,
  EmptyState,
  FilterPills,
  FormField,
  Modal,
  PageHeader,
  SearchFilterBar,
  TableRowSkeleton,
} from '@myairobotics/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiMap,
  FiPlus,
  FiTrash2,
  FiUserPlus,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  useAssignTerritoryMutation,
  useCreateTerritoryMutation,
  useDeleteTerritoryMutation,
  useGetTerritoriesQuery,
} from '@/services';

type TypeFilter = 'all' | TerritoryType;

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'country', label: 'Country' },
  { value: 'region', label: 'Region' },
  { value: 'state', label: 'State' },
  { value: 'city', label: 'City' },
];

const TYPE_BADGE: Record<TerritoryType, string> = {
  country: 'bg-violet-100 text-violet-700',
  region: 'bg-sky-100 text-sky-700',
  state: 'bg-amber-100 text-amber-700',
  city: 'bg-emerald-100 text-emerald-700',
};

function AssignForm({ territory, onClose }: { territory: Territory; onClose: () => void }) {
  const [assign, { isLoading }] = useAssignTerritoryMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<{ ownerType: 'admin' | 'partner' | 'partner_team_member'; ownerId: string }>();

  const onSubmit = async (values: { ownerType: 'admin' | 'partner' | 'partner_team_member'; ownerId: string }) => {
    try {
      await assign({ territoryId: territory.id, body: values }).unwrap();
      toast.success(`Assigned ${territory.name}`);
      onClose();
    } catch {
      toast.error('Failed to assign territory');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
      <FormField label="Owner Type" id="ownerType" error={errors.ownerType ? 'Required' : undefined}>
        <select
          id="ownerType"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
          {...register('ownerType', { required: true })}
        >
          <option value="admin">Admin</option>
          <option value="partner">Partner</option>
          <option value="partner_team_member">Partner Team Member</option>
        </select>
      </FormField>
      <FormField
        label="Owner ID"
        id="ownerId"
        placeholder="UUID of the admin/partner/team member"
        error={errors.ownerId ? 'Required' : undefined}
        {...register('ownerId', { required: true })}
      />
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60">
          {isLoading ? 'Assigning…' : 'Assign'}
        </button>
      </div>
    </form>
  );
}

function CreateTerritoryForm({ onClose }: { onClose: () => void }) {
  const [createTerritory, { isLoading }] = useCreateTerritoryMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTerritoryRequest>();

  const onSubmit = async (values: CreateTerritoryRequest) => {
    try {
      await createTerritory(values).unwrap();
      toast.success('Territory created');
      onClose();
    } catch {
      toast.error('Failed to create territory');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
      <FormField
        label="Name"
        id="name"
        placeholder="Lagos"
        error={errors.name ? 'Required' : undefined}
        {...register('name', { required: true })}
      />
      <FormField label="Type" id="type" error={errors.type ? 'Required' : undefined}>
        <select
          id="type"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
          {...register('type', { required: true })}
        >
          <option value="country">Country</option>
          <option value="region">Region</option>
          <option value="state">State</option>
          <option value="city">City</option>
        </select>
      </FormField>
      <FormField
        label="Parent Territory ID"
        id="parentId"
        placeholder="Optional"
        {...register('parentId')}
      />
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60">
          {isLoading ? 'Creating…' : 'Create Territory'}
        </button>
      </div>
    </form>
  );
}

export default function TerritoriesManagement() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assigningTerritory, setAssigningTerritory] = useState<Territory | null>(null);

  const { data, isLoading } = useGetTerritoriesQuery({
    ...(typeFilter !== 'all' && { type: typeFilter }),
    ...(search.trim() && { search: search.trim() }),
  });
  const [deleteTerritory] = useDeleteTerritoryMutation();

  const territories: Territory[] = data?.data ?? [];

  const handleDelete = async (territory: Territory) => {
    try {
      await deleteTerritory(territory.id).unwrap();
      toast.success(`${territory.name} deleted`);
    } catch {
      toast.error('Failed to delete territory');
    }
  };

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Territories"
        subtitle="Manage sales territories and their assignments"
        icon={<FiMap />}
        actions={(
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl border border-white/30 bg-white px-4 py-2.5 text-sm font-bold text-primary-600 shadow-sm transition-all hover:bg-white/90"
          >
            <FiPlus className="h-4 w-4" />
            New Territory
          </button>
        )}
      />

      <SearchFilterBar search={search} onSearch={setSearch} placeholder="Search territories…">
        <FilterPills options={TYPE_FILTERS} value={typeFilter} onChange={setTypeFilter} />
      </SearchFilterBar>

      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        {isLoading
          ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><tbody><TableRowSkeleton cols={4} rows={8} /></tbody></table>
              </div>
            )
          : territories.length === 0
            ? <EmptyState icon={<FiMap />} message="No territories found" />
            : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50/70">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Name</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Type</th>
                        <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase md:table-cell">Parent</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {territories.map(t => (
                        <tr key={t.id} className="transition-colors hover:bg-slate-50/70">
                          <td className="px-5 py-3.5 font-semibold text-slate-800">{t.name}</td>
                          <td className="px-5 py-3.5">
                            <Badge variant="rounded" className={TYPE_BADGE[t.type] ?? 'bg-slate-100 text-slate-600'}>{t.type}</Badge>
                          </td>
                          <td className="hidden px-5 py-3.5 text-slate-500 md:table-cell">{t.parent?.name ?? 'N/A'}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setAssigningTerritory(t)}
                                className="rounded-lg border border-sky-200 px-2.5 py-1.5 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-50"
                              >
                                <span className="flex items-center gap-1">
                                  <FiUserPlus className="h-3 w-3" />
                                  Assign
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(t)}
                                className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                              >
                                <FiTrash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
      </div>

      <Modal
        open={showCreateModal}
        onOpenChange={open => !open && setShowCreateModal(false)}
        title="New Territory"
        className="max-w-md"
      >
        <CreateTerritoryForm onClose={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        open={assigningTerritory !== null}
        onOpenChange={open => !open && setAssigningTerritory(null)}
        title={`Assign ${assigningTerritory?.name ?? ''}`}
        className="max-w-md"
      >
        {assigningTerritory && <AssignForm territory={assigningTerritory} onClose={() => setAssigningTerritory(null)} />}
      </Modal>
    </div>
  );
}
