'use client';

import type { Partner, PartnerStatus } from '@/types';
import { Badge, EmptyState, FormField, InfoField, Modal, PageHeader, Pagination, SectionDivider, Skeleton, StatCard } from '@myairobotics/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiActivity,
  FiAlertCircle,
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiDollarSign,
  FiEdit2,
  FiHash,
  FiHeadphones,
  FiMail,
  FiMapPin,
  FiRepeat,
  FiSend,
  FiShield,
  FiTag,
  FiTrash2,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  useAssignPartnerLocationMutation,
  useDeletePartnerMutation,
  useGetAllPartnersQuery,
  useGetOnePartnerQuery,
  useGetPartnerAdminUsersQuery,
  useGetPartnerAppointmentPerformanceQuery,
  useGetPartnerAuditLogsQuery,
  useGetPartnerCampaignPerformanceQuery,
  useGetPartnerClientsQuery,
  useGetPartnerReferralCodeQuery,
  useGetPartnerRevenueQuery,
  usePartnerSupportAccessMutation,
  useTransferPartnerOwnershipMutation,
  useUpdatePartnerMutation,
  useUpdatePartnerStatusMutation,
} from '@/services';

type PartnerDetailProps = {
  partnerId: string;
};

type DetailTab = 'team' | 'admin-users' | 'clients' | 'performance' | 'audit';

const STATUS_CONFIG: Record<PartnerStatus, { label: string; dot: string; pill: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-500', pill: 'bg-emerald-100 text-emerald-700' },
  pending: { label: 'Pending', dot: 'bg-amber-500', pill: 'bg-amber-100 text-amber-700' },
  suspended: { label: 'Suspended', dot: 'bg-red-500', pill: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', dot: 'bg-slate-400', pill: 'bg-slate-100 text-slate-500' },
};

const TABS: { id: DetailTab; label: string }[] = [
  { id: 'team', label: 'Team' },
  { id: 'admin-users', label: 'Admin Users' },
  { id: 'clients', label: 'Clients' },
  { id: 'performance', label: 'Performance' },
  { id: 'audit', label: 'Audit Log' },
];

function formatDate(value: string | null | undefined, withTime = false) {
  if (!value) {
    return 'Never';
  }
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

/* ─── Edit partner modal ──────────────────────────────────────────── */

type EditFormValues = { first_name: string; last_name: string; region: string; tag: string };

function EditPartnerModal({ partner, open, onClose }: { partner: Partner; open: boolean; onClose: () => void }) {
  const [updatePartner, { isLoading }] = useUpdatePartnerMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<EditFormValues>({
    defaultValues: {
      first_name: partner.first_name,
      last_name: partner.last_name,
      region: partner.region ?? '',
      tag: partner.tag ?? '',
    },
  });

  const onSubmit = async (values: EditFormValues) => {
    try {
      await updatePartner({ id: partner.id, body: values }).unwrap();
      toast.success('Partner updated successfully');
      onClose();
    } catch {
      toast.error('Failed to update partner');
    }
  };

  return (
    <Modal open={open} onOpenChange={o => !o && onClose()} title="Edit Partner" className="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
        <FormField label="First Name" id="edit_first_name" error={errors.first_name?.message} {...register('first_name', { required: 'Required' })} />
        <FormField label="Last Name" id="edit_last_name" error={errors.last_name?.message} {...register('last_name', { required: 'Required' })} />
        <FormField label="Region" id="edit_region" {...register('region')} />
        <FormField label="Tag" id="edit_tag" {...register('tag')} />
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60">
            {isLoading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ─── Status change modal ─────────────────────────────────────────── */

type StatusFormValues = { status: PartnerStatus; reason: string };

function StatusModal({ partner, open, onClose }: { partner: Partner; open: boolean; onClose: () => void }) {
  const [updateStatus, { isLoading }] = useUpdatePartnerStatusMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<StatusFormValues>({
    defaultValues: { status: partner.status, reason: '' },
  });

  const onSubmit = async (values: StatusFormValues) => {
    try {
      await updateStatus({ id: partner.id, body: values }).unwrap();
      toast.success('Partner status updated');
      onClose();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <Modal open={open} onOpenChange={o => !o && onClose()} title="Change Partner Status" className="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
        <FormField label="Status" id="status_select" error={errors.status?.message}>
          <select
            id="status_select"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
            {...register('status', { required: true })}
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </FormField>
        <FormField label="Reason" id="status_reason" hint="Optional context for this change" {...register('reason')} />
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60">
            {isLoading ? 'Updating…' : 'Update Status'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ─── Assign location modal ───────────────────────────────────────── */

function LocationModal({ partner, open, onClose }: { partner: Partner; open: boolean; onClose: () => void }) {
  const [assignLocation, { isLoading }] = useAssignPartnerLocationMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<{ region: string }>({
    defaultValues: { region: partner.region ?? '' },
  });

  const onSubmit = async (values: { region: string }) => {
    try {
      await assignLocation({ id: partner.id, body: { location: { region: values.region } } }).unwrap();
      toast.success('Location assigned');
      onClose();
    } catch {
      toast.error('Failed to assign location');
    }
  };

  return (
    <Modal open={open} onOpenChange={o => !o && onClose()} title="Assign Partner Location" className="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
        <FormField label="Region" id="location_region" placeholder="AFRICA" error={errors.region?.message} {...register('region', { required: 'Region is required' })} />
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60">
            {isLoading ? 'Saving…' : 'Assign Location'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ─── Transfer ownership modal ────────────────────────────────────── */

function TransferOwnershipModal({ partner, open, onClose }: { partner: Partner; open: boolean; onClose: () => void }) {
  const { data } = useGetAllPartnersQuery({ page: 1, limit: 100 });
  const candidates = (data?.data?.data ?? []).filter(p => p.id !== partner.id);
  const [transferOwnership, { isLoading }] = useTransferPartnerOwnershipMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<{ targetPartnerId: string; reason: string }>();

  const onSubmit = async (values: { targetPartnerId: string; reason: string }) => {
    try {
      await transferOwnership({ id: partner.id, body: values }).unwrap();
      toast.success('Ownership transferred');
      onClose();
    } catch {
      toast.error('Failed to transfer ownership');
    }
  };

  return (
    <Modal open={open} onOpenChange={o => !o && onClose()} title="Transfer Ownership" className="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
        <FormField label="Transfer To" id="target_partner" error={errors.targetPartnerId?.message}>
          <select
            id="target_partner"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition-all outline-none focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-500/20"
            {...register('targetPartnerId', { required: 'Select a partner' })}
          >
            <option value="">Select a partner</option>
            {candidates.map(p => (
              <option key={p.id} value={p.id}>
                {p.first_name}
                {' '}
                {p.last_name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Reason" id="transfer_reason" error={errors.reason?.message} {...register('reason', { required: 'Reason is required' })} />
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60">
            {isLoading ? 'Transferring…' : 'Transfer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ─── Delete confirmation modal ───────────────────────────────────── */

function DeletePartnerModal({ partner, open, onClose, onDeleted }: { partner: Partner; open: boolean; onClose: () => void; onDeleted: () => void }) {
  const [deletePartner, { isLoading }] = useDeletePartnerMutation();

  const handleDelete = async () => {
    try {
      await deletePartner(partner.id).unwrap();
      toast.success('Partner account cancelled');
      onClose();
      onDeleted();
    } catch {
      toast.error('Failed to delete partner');
    }
  };

  return (
    <Modal open={open} onOpenChange={o => !o && onClose()} title="Delete Partner" className="max-w-md">
      <div className="mt-2 space-y-4">
        <p className="text-sm text-slate-600">
          Are you sure you want to cancel
          {' '}
          <span className="font-semibold text-slate-800">
            {partner.first_name}
            {' '}
            {partner.last_name}
          </span>
          &apos;s partner account? This action cannot be undone.
        </p>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={handleDelete} disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60">
            <FiTrash2 className="h-4 w-4" />
            {isLoading ? 'Deleting…' : 'Delete Partner'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Sidebar (identity, details, actions) ────────────────────────── */

function DetailSidebar({ partner, onDeleted }: { partner: Partner; onDeleted: () => void }) {
  const { data: referralData } = useGetPartnerReferralCodeQuery(partner.id);
  const [showEdit, setShowEdit] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [supportAccess, { isLoading: isEnteringSupport }] = usePartnerSupportAccessMutation();

  const handleSupportAccess = async () => {
    try {
      await supportAccess(partner.id).unwrap();
      toast.success('Support mode entered. This access has been audit-logged');
    } catch {
      toast.error('Failed to enter support mode');
    }
  };

  const initials = `${partner.first_name.charAt(0)}${partner.last_name.charAt(0)}`.toUpperCase();
  const fullName = `${partner.first_name} ${partner.last_name}`;
  const statusCfg = STATUS_CONFIG[partner.status] ?? STATUS_CONFIG.pending;

  const fields: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean }[] = [
    { icon: FiMail, label: 'Email', value: partner.email },
    { icon: FiTag, label: 'Tag', value: partner.tag || 'N/A' },
    { icon: FiMapPin, label: 'Region', value: partner.region || 'N/A' },
    { icon: FiCalendar, label: 'Last Login', value: formatDate(partner.last_login_at, true) },
    ...(referralData?.data ? [{ icon: FiHash, label: 'Referral Code', value: referralData.data, mono: true }] : []),
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-700 text-2xl font-bold text-white shadow-lg ring-4 ring-primary-100">
              {initials}
            </div>
            <span className={`absolute right-0.5 bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-white ${statusCfg.dot}`} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900">{fullName}</h3>
            <Badge className={`mt-1 ${statusCfg.pill}`} dot={statusCfg.dot}>
              {statusCfg.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
        <SectionDivider label="Details" />
        <div className="space-y-2">
          {fields.map(f => (
            <InfoField key={f.label} icon={f.icon} label={f.label} value={f.value} mono={f.mono} />
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
        <SectionDivider label="Actions" />
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setShowEdit(true)} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50">
            <FiEdit2 className="h-4 w-4" />
            Edit
          </button>
          <button type="button" onClick={() => setShowStatus(true)} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50">
            <FiActivity className="h-4 w-4" />
            Change Status
          </button>
          <button type="button" onClick={() => setShowLocation(true)} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50">
            <FiMapPin className="h-4 w-4" />
            Assign Location
          </button>
          <button type="button" onClick={() => setShowTransfer(true)} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50">
            <FiRepeat className="h-4 w-4" />
            Transfer Ownership
          </button>
          <button
            type="button"
            onClick={handleSupportAccess}
            disabled={isEnteringSupport}
            className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-700 transition-all hover:bg-primary-100 disabled:opacity-50"
          >
            <FiHeadphones className="h-4 w-4" />
            {isEnteringSupport ? 'Entering…' : 'Enter Support Mode'}
          </button>
          <button type="button" onClick={() => setShowDelete(true)} className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100">
            <FiTrash2 className="h-4 w-4" />
            Delete Partner
          </button>
        </div>
      </div>

      <EditPartnerModal partner={partner} open={showEdit} onClose={() => setShowEdit(false)} />
      <StatusModal partner={partner} open={showStatus} onClose={() => setShowStatus(false)} />
      <LocationModal partner={partner} open={showLocation} onClose={() => setShowLocation(false)} />
      <TransferOwnershipModal partner={partner} open={showTransfer} onClose={() => setShowTransfer(false)} />
      <DeletePartnerModal partner={partner} open={showDelete} onClose={() => setShowDelete(false)} onDeleted={onDeleted} />
    </div>
  );
}

/* ─── Team tab ─────────────────────────────────────────────────────── */

function TeamTab({ partner }: { partner: Partner }) {
  const staff = partner.staff ?? [];

  if (staff.length === 0) {
    return <EmptyState icon={<FiUsers />} message="No team members yet" />;
  }

  return (
    <div className="space-y-2">
      {staff.map(member => (
        <div key={member.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {member.first_name}
              {' '}
              {member.last_name}
            </p>
            <p className="text-xs text-slate-500">{member.position?.label ?? 'Team Member'}</p>
          </div>
          <Badge className={member.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}>
            {member.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}

/* ─── Admin users tab ──────────────────────────────────────────────── */

function AdminUsersTab({ partnerId }: { partnerId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetPartnerAdminUsersQuery({ partnerId, page, limit: 10 });
  const users = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map(k => (
          <Skeleton key={k} width="100%" height={52} borderRadius={12} />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return <EmptyState icon={<FiShield />} message="No admin users for this partner" />;
  }

  return (
    <div className="space-y-2">
      {users.map(u => (
        <div key={u.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {u.first_name}
              {' '}
              {u.last_name}
            </p>
            <p className="text-xs text-slate-500">{u.email}</p>
          </div>
          <Badge className={u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}>
            {u.status}
          </Badge>
        </div>
      ))}
      {meta && <Pagination page={meta.page} totalPages={meta.pages} total={meta.total} itemLabel="admin user" onPageChange={setPage} />}
    </div>
  );
}

/* ─── Clients tab ──────────────────────────────────────────────────── */

function ClientsTab({ partnerId }: { partnerId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetPartnerClientsQuery({ partnerId, page, limit: 10 });
  const clients = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map(k => (
          <Skeleton key={k} width="100%" height={52} borderRadius={12} />
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return <EmptyState icon={<FiUsers />} message="No clients referred by this partner yet" />;
  }

  return (
    <div className="space-y-3">
      {clients.map(client => (
        <div key={client.appUserId} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {client.firstName || client.lastName ? `${client.firstName} ${client.lastName}`.trim() : client.email}
            </p>
            <p className="truncate text-xs text-slate-500">{client.email}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-slate-400">{formatDate(client.dateJoined)}</p>
            {client.referralCode && <p className="mt-0.5 font-mono text-[11px] text-primary-600">{client.referralCode}</p>}
          </div>
        </div>
      ))}
      {meta && <Pagination page={meta.page} totalPages={meta.pages} total={meta.total} itemLabel="client" onPageChange={setPage} />}
    </div>
  );
}

/* ─── Performance tab ──────────────────────────────────────────────── */

function PerformanceTab({ partnerId }: { partnerId: string }) {
  const { data: revenueData, isLoading: revenueLoading } = useGetPartnerRevenueQuery(partnerId);
  const { data: campaignData, isLoading: campaignLoading } = useGetPartnerCampaignPerformanceQuery(partnerId);
  const { data: appointmentData, isLoading: appointmentLoading } = useGetPartnerAppointmentPerformanceQuery(partnerId);

  const revenue = revenueData?.data;
  const campaign = campaignData?.data?.performanceSummary;
  const appointment = appointmentData?.data?.summary;

  const isLoading = revenueLoading || campaignLoading || appointmentLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => `skel-${i}`).map(k => (
          <Skeleton key={k} width="100%" height={72} borderRadius={12} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Revenue</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Total Revenue" value={`$${(revenue?.totalRevenue ?? 0).toLocaleString()}`} icon={<FiDollarSign />} iconBg="bg-emerald-100 text-emerald-600" valueColor="text-emerald-700" />
          <StatCard label="Subscriptions" value={revenue?.totalSubscriptions ?? 0} icon={<FiActivity />} iconBg="bg-primary-100 text-primary-600" valueColor="text-primary-700" />
          <StatCard label="Active Subscriptions" value={revenue?.activeSubscriptions ?? 0} icon={<FiCheckCircle />} iconBg="bg-sky-100 text-sky-600" valueColor="text-sky-700" />
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Campaigns</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Total Campaigns" value={campaign?.totalCampaigns ?? 0} icon={<FiSend />} iconBg="bg-violet-100 text-violet-600" valueColor="text-violet-700" />
          <StatCard label="Active" value={campaign?.activeCampaigns ?? 0} icon={<FiCheckCircle />} iconBg="bg-emerald-100 text-emerald-600" valueColor="text-emerald-700" />
          <StatCard label="Open Rate" value={`${campaign?.openRatePercentage ?? 0}%`} icon={<FiActivity />} iconBg="bg-amber-100 text-amber-600" valueColor="text-amber-700" />
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Appointments</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Completed" value={appointment?.completed ?? 0} icon={<FiCheckCircle />} iconBg="bg-emerald-100 text-emerald-600" valueColor="text-emerald-700" />
          <StatCard label="Pending" value={appointment?.pending ?? 0} icon={<FiActivity />} iconBg="bg-amber-100 text-amber-600" valueColor="text-amber-700" />
          <StatCard label="Cancelled" value={appointment?.cancelled ?? 0} icon={<FiAlertCircle />} iconBg="bg-red-100 text-red-600" valueColor="text-red-700" />
        </div>
      </div>
    </div>
  );
}

/* ─── Audit log tab ────────────────────────────────────────────────── */

function AuditTab({ partnerId }: { partnerId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetPartnerAuditLogsQuery({ partnerId, page, limit: 10 });
  const logs = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map(k => (
          <Skeleton key={k} width="100%" height={64} borderRadius={12} />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return <EmptyState icon={<FiActivity />} message="No audit activity recorded for this partner" />;
  }

  return (
    <div className="space-y-3">
      {logs.map(log => (
        <div key={log.id} className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800 capitalize">{log.action.replace(/_/g, ' ')}</p>
            <Badge className={log.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
              {log.status}
            </Badge>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <FiCalendar className="h-3 w-3" />
            {formatDate(log.created_at, true)}
          </div>
          {log.reason && (
            <p className="mt-1.5 text-xs text-slate-500">
              Reason:
              {' '}
              {log.reason}
            </p>
          )}
        </div>
      ))}
      {meta && <Pagination page={meta.page} totalPages={meta.pages} total={meta.total} itemLabel="log" onPageChange={setPage} />}
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────────────── */

export default function PartnerDetail({ partnerId }: PartnerDetailProps) {
  const router = useRouter();
  const [tab, setTab] = useState<DetailTab>('team');
  const { data, isLoading } = useGetOnePartnerQuery(partnerId);
  const partner = data?.data;

  const backLink = (
    <Link
      href="/partners"
      className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25"
    >
      <FiArrowLeft className="h-4 w-4" />
      Back to Partners
    </Link>
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
        <PageHeader
          title={<span className="inline-block h-7 w-40 animate-pulse rounded-md bg-white/25 md:h-8 md:w-56" />}
          subtitle={<span className="mt-0.5 inline-block h-4 w-32 animate-pulse rounded-md bg-white/20" />}
          icon={<FiUser />}
          actions={backLink}
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-1">
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <Skeleton width={80} height={80} borderRadius={9999} />
                <Skeleton width={160} height={20} borderRadius={6} />
                <Skeleton width={100} height={14} borderRadius={6} />
              </div>
            </div>
          </div>
          <div className="space-y-3 lg:col-span-2">
            {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map(k => (
              <Skeleton key={k} width="100%" height={56} borderRadius={12} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
        <PageHeader title="Partner Not Found" icon={<FiUser />} actions={backLink} />
        <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/60 bg-white">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <FiUser className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-500">Partner not found</p>
        </div>
      </div>
    );
  }

  const fullName = `${partner.first_name} ${partner.last_name}`;

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader title={fullName} subtitle={partner.email} icon={<FiUser />} actions={backLink} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <DetailSidebar partner={partner} onDeleted={() => router.push('/partners')} />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
            {TABS.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition-all ${
                  tab === t.id ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
            {tab === 'team' && <TeamTab partner={partner} />}
            {tab === 'admin-users' && <AdminUsersTab partnerId={partnerId} />}
            {tab === 'clients' && <ClientsTab partnerId={partnerId} />}
            {tab === 'performance' && <PerformanceTab partnerId={partnerId} />}
            {tab === 'audit' && <AuditTab partnerId={partnerId} />}
          </div>
        </div>
      </div>
    </div>
  );
}
