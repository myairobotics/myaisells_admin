'use client';

import { Badge, InfoField, SectionDivider, Skeleton } from '@myairobotics/ui';
import { useState } from 'react';
import {
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiGlobe,
  FiHeadphones,
  FiLayers,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiXCircle,
  FiZap,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  useGetAdminBusinessQuery,
  useUpdateBusinessStatusMutation,
} from '@/services';
import BusinessSupportPanel from './BusinessSupportPanel';

type BusinessDetailProps = {
  businessId: string;
};

export default function BusinessDetail({ businessId }: BusinessDetailProps) {
  const { data, isLoading } = useGetAdminBusinessQuery(businessId);
  const business = data?.data;
  const [showSupportMode, setShowSupportMode] = useState(false);

  const [updateStatus, { isLoading: isActing }] = useUpdateBusinessStatusMutation();

  const handleActivate = async () => {
    try {
      await updateStatus({ id: businessId, body: { status: 'active' } }).unwrap();
      toast.success('Business activated successfully');
    } catch {
      toast.error('Failed to activate business');
    }
  };

  const handleSuspend = async () => {
    try {
      await updateStatus({ id: businessId, body: { status: 'suspended' } }).unwrap();
      toast.success('Business suspended');
    } catch {
      toast.error('Failed to suspend business');
    }
  };

  const handleCancel = async () => {
    try {
      await updateStatus({ id: businessId, body: { status: 'cancelled' } }).unwrap();
      toast.success('Business cancelled');
    } catch {
      toast.error('Failed to cancel business');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-3 pt-2 pb-4">
          <Skeleton width={80} height={80} borderRadius={12} />
          <div className="flex flex-col items-center gap-1.5">
            <Skeleton width={160} height={20} borderRadius={6} />
            <Skeleton width={100} height={14} borderRadius={6} />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => `skel-${i}`).map(k => (
            <div key={k} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
              <Skeleton width={28} height={28} borderRadius={8} />
              <div className="flex-1 space-y-1.5">
                <Skeleton width={64} height={11} borderRadius={4} />
                <Skeleton width="75%" height={14} borderRadius={4} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
          <FiBriefcase className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">Business not found</p>
      </div>
    );
  }

  const { profile, attribution, subscription, setupProgress } = business;
  const initials = business.name.slice(0, 2).toUpperCase();

  const fields: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean }[] = [
    { icon: FiMail, label: 'Email', value: business.email },
    ...(profile.phone ? [{ icon: FiPhone, label: 'Phone', value: profile.phone }] : []),
    ...(profile.website ? [{ icon: FiGlobe, label: 'Website', value: profile.website }] : []),
    ...(subscription ? [{ icon: FiLayers, label: 'Plan', value: subscription.planName }] : []),
    { icon: FiZap, label: 'Wallet Balance', value: business.walletBalance.toLocaleString() },
    ...((profile.address || profile.country) ? [{ icon: FiMapPin, label: 'Location', value: [profile.address, profile.country].filter(Boolean).join(', ') }] : []),
    ...(attribution.partner ? [{ icon: FiUser, label: 'Partner', value: attribution.partner.name }] : []),
    ...(attribution.salesAgent ? [{ icon: FiUser, label: 'Sales Agent', value: attribution.salesAgent.name }] : []),
    { icon: FiCalendar, label: 'Joined', value: new Date(business.dateJoined).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
  ];

  return (
    <div className="space-y-5">
      {/* Avatar + identity */}
      <div className="flex flex-col items-center gap-3 pt-2 pb-1">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-violet-700 text-2xl font-bold text-white shadow-lg ring-4 ring-violet-100">
          {initials}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900">{business.name}</h3>
          {business.isActive
            ? <Badge className="mt-1 bg-emerald-100 text-emerald-700" dot="bg-emerald-500">Active</Badge>
            : <Badge className="mt-1 bg-red-100 text-red-700" dot="bg-red-500">Inactive</Badge>}
        </div>
      </div>

      {/* Campaigns / appointments */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <p className="text-lg font-bold text-slate-800">
            {business.campaigns.active}
            /
            {business.campaigns.total}
          </p>
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Active Campaigns</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <p className="text-lg font-bold text-slate-800">
            {business.appointments.completed}
            /
            {business.appointments.total}
          </p>
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Completed Appointments</p>
        </div>
      </div>

      {/* Setup progress */}
      {setupProgress.length > 0 && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Setup Progress</p>
          <div className="space-y-1.5">
            {setupProgress.map(item => (
              <div key={item.module} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-slate-600">{item.module}</span>
                {item.status === 'COMPLETE'
                  ? <FiCheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                  : <FiXCircle className="h-4 w-4 shrink-0 text-amber-500" />}
              </div>
            ))}
          </div>
        </div>
      )}

      <SectionDivider label="Business Details" />

      {/* Fields */}
      <div className="space-y-2">
        {fields.map(f => (
          <InfoField key={f.label} icon={f.icon} label={f.label} value={f.value} mono={f.mono} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowSupportMode(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-2.5 text-sm font-bold text-primary-700 transition-all hover:bg-primary-100"
      >
        <FiHeadphones className="h-4 w-4" />
        Enter Support Mode
      </button>

      {/* Status actions */}
      <SectionDivider label="Actions" />
      <div className="flex flex-wrap gap-2">
        {!business.isActive && (
          <button
            type="button"
            onClick={handleActivate}
            disabled={isActing}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50"
          >
            <FiZap className="h-4 w-4" />
            {isActing ? 'Activating…' : 'Activate'}
          </button>
        )}
        {business.isActive && (
          <button
            type="button"
            onClick={handleSuspend}
            disabled={isActing}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-amber-600 disabled:opacity-50"
          >
            {isActing ? 'Suspending…' : 'Suspend'}
          </button>
        )}
        <button
          type="button"
          onClick={handleCancel}
          disabled={isActing}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-100 disabled:opacity-50"
        >
          {isActing ? 'Cancelling…' : 'Cancel Account'}
        </button>
      </div>

      <BusinessSupportPanel
        businessId={businessId}
        businessName={business.name}
        open={showSupportMode}
        onClose={() => setShowSupportMode(false)}
      />
    </div>
  );
}
