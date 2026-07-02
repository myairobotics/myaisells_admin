'use client';

import type {
  AdminAccount,
  AdminInvite,
  AdminInviteStatus,
  InviteAdminRequest,
} from '@/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiCheckCircle,
  FiMail,
  FiRefreshCw,
  FiSlash,
  FiUser,
  FiUserCheck,
  FiUserMinus,
  FiUserPlus,
  FiUsers,
  FiXCircle,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/global/page-header';
import {
  Badge,
  EmptyState,
  FormField,
  Modal,
  Pagination,
  StatCard,
  TableRowSkeleton,
} from '@/components/ui';
import {
  useActivateAdminMutation,
  useCancelAdminInviteMutation,
  useDeactivateAdminMutation,
  useGetAdminInvitesQuery,
  useGetAdminManagementStatsQuery,
  useGetAdminsQuery,
  useGetRolesQuery,
  useInviteAdminMutation,
  useResendAdminInviteMutation,
} from '@/services';

/* ─── Invite Status Badge ─────────────────────────────────────────── */

const INVITE_STATUS_CONFIG: Record<AdminInviteStatus, { label: string; badge: string }> = {
  pending: { label: 'Pending', badge: 'bg-amber-100 text-amber-700' },
  accepted: { label: 'Accepted', badge: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Cancelled', badge: 'bg-red-100 text-red-600' },
  expired: { label: 'Expired', badge: 'bg-slate-100 text-slate-500' },
};

function InviteStatusBadge({ status }: { status: AdminInviteStatus }) {
  const cfg = INVITE_STATUS_CONFIG[status] ?? INVITE_STATUS_CONFIG.pending;
  return <Badge className={cfg.badge}>{cfg.label}</Badge>;
}

/* ─── Invite Modal form ───────────────────────────────────────────── */

function InviteAdminForm({ onClose }: { onClose: () => void }) {
  const { data: rolesData } = useGetRolesQuery();
  const roles = rolesData?.data ?? [];
  const [inviteAdmin, { isLoading }] = useInviteAdminMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<InviteAdminRequest>();

  const onSubmit = async (values: InviteAdminRequest) => {
    try {
      await inviteAdmin(values).unwrap();
      toast.success(`Invite sent to ${values.email}`);
      onClose();
    } catch {
      toast.error('Failed to send invite');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
      <FormField
        label="First Name"
        id="first_name"
        placeholder="John"
        error={errors.first_name ? 'First name is required' : undefined}
        {...register('first_name', { required: true })}
      />

      <FormField
        label="Email Address"
        id="email"
        type="email"
        placeholder="john@example.com"
        error={errors.email ? 'Valid email is required' : undefined}
        {...register('email', { required: true })}
      />

      <FormField label="Role" id="role_id" error={errors.role_id ? 'Role is required' : undefined}>
        <select
          id="role_id"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
          {...register('role_id', { required: true })}
        >
          <option value="">Select a role</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.label || role.name}</option>
          ))}
        </select>
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
          disabled={isLoading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
        >
          <FiMail className="h-4 w-4" />
          {isLoading ? 'Sending…' : 'Send Invite'}
        </button>
      </div>
    </form>
  );
}

/* ─── Admins Table ────────────────────────────────────────────────── */

function AdminsTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetAdminsQuery({ page, limit: 15 });
  const [deactivate, { isLoading: deactivating }] = useDeactivateAdminMutation();
  const [activate, { isLoading: activating }] = useActivateAdminMutation();

  const admins: AdminAccount[] = data?.data?.admins ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const handleToggle = async (admin: AdminAccount) => {
    try {
      if (admin.isActive) {
        await deactivate(admin.id).unwrap();
        toast.success(`${admin.firstName} deactivated`);
      } else {
        await activate(admin.id).unwrap();
        toast.success(`${admin.firstName} activated`);
      }
    } catch {
      toast.error('Action failed');
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm"><tbody><TableRowSkeleton cols={5} rows={8} /></tbody></table>
      </div>
    );
  }

  if (admins.length === 0) {
    return <EmptyState icon={<FiUsers />} message="No admins found" />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/70">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Admin</th>
              <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase md:table-cell">Role</th>
              <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase lg:table-cell">Last Login</th>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Status</th>
              <th className="px-5 py-3 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {admins.map(admin => (
              <tr key={admin.id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100">
                      <FiUser className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {admin.firstName}
                        {' '}
                        {admin.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{admin.email}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-5 py-3.5 md:table-cell">
                  <Badge variant="rounded" className="bg-slate-100 text-slate-600">
                    {admin.role?.label || admin.role?.name || '—'}
                  </Badge>
                </td>
                <td className="hidden px-5 py-3.5 text-sm text-slate-500 lg:table-cell">
                  {admin.lastLoginAt
                    ? new Date(admin.lastLoginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Never'}
                </td>
                <td className="px-5 py-3.5">
                  {admin.isActive
                    ? (
                        <Badge className="bg-emerald-100 text-emerald-700" icon={<FiCheckCircle className="h-3 w-3" />}>Active</Badge>
                      )
                    : (
                        <Badge className="bg-slate-100 text-slate-500" icon={<FiSlash className="h-3 w-3" />}>Inactive</Badge>
                      )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => handleToggle(admin)}
                    disabled={deactivating || activating || isFetching}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
                      admin.isActive
                        ? 'border-red-200 text-red-600 hover:bg-red-50'
                        : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    {admin.isActive
                      ? (
                          <span className="flex items-center gap-1">
                            <FiUserMinus className="h-3 w-3" />
                            Deactivate
                          </span>
                        )
                      : (
                          <span className="flex items-center gap-1">
                            <FiUserCheck className="h-3 w-3" />
                            Activate
                          </span>
                        )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} total={pagination?.total} itemLabel="admin" onPageChange={setPage} />
    </>
  );
}

/* ─── Invites Tab ─────────────────────────────────────────────────── */

function InvitesTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetAdminInvitesQuery({ page, limit: 15 });
  const [resend, { isLoading: resending }] = useResendAdminInviteMutation();
  const [cancel, { isLoading: cancelling }] = useCancelAdminInviteMutation();

  const invites: AdminInvite[] = data?.data?.invites ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const handleResend = async (invite: AdminInvite) => {
    try {
      await resend(invite.id).unwrap();
      toast.success(`Invite resent to ${invite.email}`);
    } catch {
      toast.error('Failed to resend invite');
    }
  };

  const handleCancel = async (invite: AdminInvite) => {
    try {
      await cancel(invite.id).unwrap();
      toast.success('Invite cancelled');
    } catch {
      toast.error('Failed to cancel invite');
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm"><tbody><TableRowSkeleton cols={4} rows={6} /></tbody></table>
      </div>
    );
  }

  if (invites.length === 0) {
    return <EmptyState icon={<FiMail />} message="No invitations sent yet" />;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/70">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Invitee</th>
              <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase md:table-cell">Expires</th>
              <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Status</th>
              <th className="px-5 py-3 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invites.map(invite => (
              <tr key={invite.id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-slate-800">{invite.first_name}</p>
                  <p className="text-xs text-slate-500">{invite.email}</p>
                </td>
                <td className="hidden px-5 py-3.5 text-sm text-slate-500 md:table-cell">
                  {new Date(invite.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-5 py-3.5">
                  <InviteStatusBadge status={invite.status} />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {invite.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleResend(invite)}
                          disabled={resending}
                          className="rounded-lg border border-sky-200 px-2.5 py-1.5 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-50 disabled:opacity-50"
                        >
                          <span className="flex items-center gap-1">
                            <FiRefreshCw className="h-3 w-3" />
                            Resend
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancel(invite)}
                          disabled={cancelling}
                          className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                        >
                          <span className="flex items-center gap-1">
                            <FiXCircle className="h-3 w-3" />
                            Cancel
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} total={pagination?.total} itemLabel="invite" onPageChange={setPage} />
    </>
  );
}

/* ─── Main ────────────────────────────────────────────────────────── */

type Tab = 'admins' | 'invites';

export default function AdminManagement() {
  const [activeTab, setActiveTab] = useState<Tab>('admins');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { data: statsData, isLoading: statsLoading } = useGetAdminManagementStatsQuery();
  const stats = statsData?.data;

  const statCards = [
    { label: 'Total Admins', value: stats?.totalAdmins ?? 0, icon: <FiUsers />, iconBg: 'bg-primary-100 text-primary-600', color: 'text-primary-700' },
    { label: 'Active', value: stats?.activeAdmins ?? 0, icon: <FiCheckCircle />, iconBg: 'bg-emerald-100 text-emerald-600', color: 'text-emerald-700' },
    { label: 'Inactive', value: stats?.inactiveAdmins ?? 0, icon: <FiSlash />, iconBg: 'bg-slate-100 text-slate-600', color: 'text-slate-700' },
    { label: 'Pending Invites', value: stats?.pendingInvites ?? 0, icon: <FiMail />, iconBg: 'bg-amber-100 text-amber-600', color: 'text-amber-700' },
  ];

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Admin Management"
        subtitle="Manage admin accounts, roles, and invitations"
        icon={<FiUserPlus />}
        actions={(
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25"
          >
            <FiUserPlus className="h-4 w-4" />
            Invite Admin
          </button>
        )}
      />

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map(s => (
          <StatCard key={s.label} label={s.label} value={statsLoading ? '—' : s.value} icon={s.icon} iconBg={s.iconBg} valueColor={s.color} />
        ))}
      </div>

      {/* Tabs + table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        <div className="flex items-center gap-1 border-b border-slate-100 px-4 py-2">
          {(['admins', 'invites'] as Tab[]).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'admins' ? <AdminsTab /> : <InvitesTab />}
      </div>

      <Modal
        open={showInviteModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowInviteModal(false);
          }
        }}
        title="Invite Admin"
        className="max-w-md"
      >
        <InviteAdminForm onClose={() => setShowInviteModal(false)} />
      </Modal>
    </div>
  );
}
