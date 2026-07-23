'use client';

import type { Permission, Role } from '@/types';
import { Badge, FormField, PageHeader, Skeleton } from '@myairobotics/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiAlertTriangle,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiLock,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiTrash2,
  FiX,
  FiZap,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  useAddPermissionsToRoleMutation,
  useCreatePermissionMutation,
  useFlushPermissionCacheMutation,
  useGetPermissionsQuery,
  useGetRolesQuery,
  useRemovePermissionFromRoleMutation,
} from '@/services';

type CreatePermissionForm = {
  key: string;
  name: string;
  description: string;
  group: string;
};

const GROUP_COLORS: Record<string, string> = {
  user: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700',
  partner: 'bg-emerald-100 text-emerald-700',
  partner_staff: 'bg-teal-100 text-teal-700',
  role: 'bg-orange-100 text-orange-700',
  settings: 'bg-slate-100 text-slate-700',
  reports: 'bg-cyan-100 text-cyan-700',
};

function GroupBadge({ group }: { group: string }) {
  return (
    <Badge variant="rounded" className={`text-[11px] tracking-wide uppercase ${GROUP_COLORS[group.toLowerCase()] ?? 'bg-slate-100 text-slate-600'}`}>
      {group}
    </Badge>
  );
}

function PermissionKey({ permKey }: { permKey: string }) {
  return (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-600">
      {permKey}
    </code>
  );
}

function RoleCard({
  role,
  allPermissions,
}: {
  role: Role;
  allPermissions: Permission[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [addPermissions, { isLoading: isAdding }] = useAddPermissionsToRoleMutation();
  const [removePermission, { isLoading: isRemoving }] = useRemovePermissionFromRoleMutation();

  const assignedIds = new Set(role.permissions.map(p => p.id));
  const unassigned = allPermissions.filter(p => !assignedIds.has(p.id));
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAdd = async () => {
    if (!selected.length) {
      return;
    }
    try {
      await addPermissions({ roleId: role.id, permissionIds: selected }).unwrap();
      toast.success(`${selected.length} permission(s) added to ${role.label}`);
      setSelected([]);
    } catch {
      toast.error('Failed to add permissions');
    }
  };

  const handleRemove = async (permissionId: string, permissionName: string) => {
    try {
      await removePermission({ roleId: role.id, permissionId }).unwrap();
      toast.success(`"${permissionName}" removed from ${role.label}`);
    } catch {
      toast.error('Failed to remove permission');
    }
  };

  const poolColor: Record<string, string> = {
    admin: 'from-blue-500 to-blue-700',
    partner: 'from-emerald-500 to-emerald-700',
    partner_team: 'from-purple-500 to-purple-700',
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
      {/* Role header */}
      <div className={`h-1 bg-linear-to-r ${poolColor[role.pool] || 'from-slate-400 to-slate-600'}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${poolColor[role.pool] || 'from-slate-400 to-slate-600'} shadow-sm`}>
              <FiShield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{role.label}</h3>
              <p className="text-xs text-slate-500">{role.description || 'No description'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {role.permissions.length}
              {' '}
              permissions
            </span>
            {!role.isSystem || role.isEditable
              ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">Editable</span>
                )
              : (
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">System</span>
                )}
            <button
              type="button"
              onClick={() => setExpanded(e => !e)}
              className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
            >
              {expanded ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
            {/* Assigned permissions */}
            <div>
              <p className="mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">Assigned Permissions</p>
              {role.permissions.length === 0
                ? (
                    <p className="text-sm text-slate-400">No permissions assigned.</p>
                  )
                : (
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map(p => (
                        <div
                          key={p.id}
                          className="group flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-1.5 pl-2.5"
                        >
                          <FiCheck className="h-3 w-3 shrink-0 text-emerald-500" />
                          <span className="text-xs font-medium text-slate-700">{p.name}</span>
                          <PermissionKey permKey={p.permKey} />
                          {role.isEditable && (
                            <button
                              type="button"
                              onClick={() => handleRemove(p.id, p.name)}
                              disabled={isRemoving}
                              title={`Remove "${p.name}"`}
                              className="ml-0.5 rounded p-0.5 text-slate-300 transition-all hover:bg-red-100 hover:text-red-500 disabled:opacity-40"
                            >
                              <FiX className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
            </div>

            {/* Add permissions (only if editable) */}
            {role.isEditable && unassigned.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">Add Permissions</p>
                <div className="mb-3 flex flex-wrap gap-2">
                  {unassigned.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleSelect(p.id)}
                      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                        selected.includes(p.id)
                          ? 'border-primary-300 bg-primary-50 text-primary-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {selected.includes(p.id) && <FiCheck className="h-3 w-3" />}
                      {p.name}
                    </button>
                  ))}
                </div>
                {selected.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={isAdding}
                    className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 disabled:opacity-60"
                  >
                    {isAdding ? <FiRefreshCw className="h-3.5 w-3.5 animate-spin" /> : <FiPlus className="h-3.5 w-3.5" />}
                    Add
                    {' '}
                    {selected.length}
                    {' '}
                    permission
                    {selected.length !== 1 ? 's' : ''}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RolesPermissions() {
  const [tab, setTab] = useState<'roles' | 'permissions'>('roles');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: rolesData, isLoading: rolesLoading } = useGetRolesQuery();
  const { data: permsData, isLoading: permsLoading } = useGetPermissionsQuery();
  const [createPermission, { isLoading: isCreating }] = useCreatePermissionMutation();
  const [flushCache, { isLoading: isFlushing }] = useFlushPermissionCacheMutation();

  const roles = rolesData?.data || [];
  const permissions = permsData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePermissionForm>();

  const onCreatePermission = async (values: CreatePermissionForm) => {
    try {
      await createPermission(values).unwrap();
      toast.success('Permission created');
      reset();
      setShowCreateForm(false);
    } catch {
      toast.error('Failed to create permission');
    }
  };

  const handleFlushCache = async () => {
    try {
      await flushCache().unwrap();
      toast.success('Permission cache cleared, changes are now live');
    } catch {
      toast.error('Failed to flush cache');
    }
  };

  // Group permissions by group
  const grouped = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    const g = p.group.toLowerCase();
    if (!acc[g]) {
      acc[g] = [];
    }
    acc[g].push(p);
    return acc;
  }, {});

  return (
    <div className="flex h-full w-full flex-col space-y-6 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Roles & Permissions"
        subtitle="Control what each role can see and do"
        icon={<FiLock />}
        actions={(
          <button
            type="button"
            onClick={handleFlushCache}
            disabled={isFlushing}
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 disabled:opacity-60"
          >
            <FiZap className={`h-4 w-4 ${isFlushing ? 'animate-pulse' : ''}`} />
            {isFlushing ? 'Flushing...' : 'Flush Cache'}
          </button>
        )}
      />

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-slate-200/60 bg-white p-1 shadow-sm">
        {(['roles', 'permissions'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold capitalize transition-all ${
              tab === t
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
            {t === 'roles' && ` (${roles.length})`}
            {t === 'permissions' && ` (${permissions.length})`}
          </button>
        ))}
      </div>

      {/* Roles tab */}
      {tab === 'roles' && (
        rolesLoading
          ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, i) => `skel-${i}`).map(key => (
                  <div key={key} className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
                    <Skeleton height={20} width={180} borderRadius={6} />
                    <div className="mt-2">
                      <Skeleton height={14} width={280} borderRadius={6} />
                    </div>
                  </div>
                ))}
              </div>
            )
          : (
              <div className="space-y-3">
                {roles.map(role => (
                  <RoleCard key={role.id} role={role} allPermissions={permissions} />
                ))}
              </div>
            )
      )}

      {/* Permissions tab */}
      {tab === 'permissions' && (
        <div className="space-y-5">
          {/* Create permission */}
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
              All Permissions
            </h2>
            <button
              type="button"
              onClick={() => setShowCreateForm(s => !s)}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700"
            >
              {showCreateForm ? <FiX className="h-3.5 w-3.5" /> : <FiPlus className="h-3.5 w-3.5" />}
              {showCreateForm ? 'Cancel' : 'New Permission'}
            </button>
          </div>

          {showCreateForm && (
            <div className="rounded-xl border border-primary-200 bg-primary-50/40 p-5">
              <h3 className="mb-4 text-sm font-bold text-slate-800">Create Custom Permission</h3>
              <form onSubmit={handleSubmit(onCreatePermission)} className="grid gap-3 sm:grid-cols-2">
                <FormField
                  label="Key"
                  id="perm-key"
                  required
                  placeholder="e.g. report:export"
                  error={errors.key?.message}
                  labelClassName="mb-1 block text-xs font-medium text-slate-600"
                  {...register('key', { required: 'Required' })}
                />
                <FormField
                  label="Name"
                  id="perm-name"
                  required
                  placeholder="e.g. Export Reports"
                  error={errors.name?.message}
                  labelClassName="mb-1 block text-xs font-medium text-slate-600"
                  {...register('name', { required: 'Required' })}
                />
                <FormField
                  label="Group"
                  id="perm-group"
                  required
                  placeholder="e.g. reports"
                  error={errors.group?.message}
                  labelClassName="mb-1 block text-xs font-medium text-slate-600"
                  {...register('group', { required: 'Required' })}
                />
                <FormField
                  label="Description"
                  id="perm-description"
                  placeholder="What does this permission allow?"
                  labelClassName="mb-1 block text-xs font-medium text-slate-600"
                  {...register('description')}
                />
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 disabled:opacity-60"
                  >
                    {isCreating ? <FiRefreshCw className="h-3.5 w-3.5 animate-spin" /> : <FiPlus className="h-3.5 w-3.5" />}
                    Create Permission
                  </button>
                </div>
              </form>
            </div>
          )}

          {permsLoading
            ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map(key => (
                    <div key={key} className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
                      <div className="border-b border-slate-100 px-5 py-3">
                        <Skeleton height={18} width={120} borderRadius={6} />
                      </div>
                      <div className="grid gap-2 p-4 sm:grid-cols-2">
                        {Array.from({ length: 4 }, (_, j) => `perm-skel-${j}`).map(permKey => (
                          <div key={permKey} className="rounded-lg border border-slate-100 p-3">
                            <Skeleton height={14} width={160} borderRadius={6} />
                            <div className="mt-1.5">
                              <Skeleton height={12} borderRadius={6} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            : (
                <div className="space-y-4">
                  {Object.entries(grouped).map(([group, perms]) => (
                    <div key={group} className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                        <div className="flex items-center gap-2">
                          <GroupBadge group={group} />
                          <span className="text-xs text-slate-400">
                            {perms.length}
                            {' '}
                            permissions
                          </span>
                        </div>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {perms.map(p => (
                          <div key={p.id} className="flex items-center justify-between px-5 py-3.5">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                                <PermissionKey permKey={p.permKey} />
                                {p.isSystem && (
                                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 uppercase">System</span>
                                )}
                              </div>
                              {p.description && (
                                <p className="mt-0.5 text-xs text-slate-400">{p.description}</p>
                              )}
                            </div>
                            {!p.isSystem && (
                              <button
                                type="button"
                                className="ml-3 shrink-0 rounded-lg p-1.5 text-slate-300 transition-all hover:bg-red-50 hover:text-red-500"
                                title="Delete permission"
                              >
                                <FiTrash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

          {!permsLoading && permissions.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <FiAlertTriangle className="h-10 w-10 text-slate-300" />
              <p className="text-slate-500">No permissions found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
