'use client';

import type { BusinessStatus } from '@/types';
import {
  FiBriefcase,
  FiCalendar,
  FiGlobe,
  FiHash,
  FiLayers,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiZap,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Badge, InfoField, ProgressBar, SectionDivider, Skeleton } from '@/components/ui';
import {
  useActivateBusinessMutation,
  useCancelBusinessMutation,
  useGetAdminBusinessQuery,
  useSuspendBusinessMutation,
} from '@/services';

const STATUS_CONFIG: Record<BusinessStatus, { label: string; dot: string; pill: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-500', pill: 'bg-emerald-100 text-emerald-700' },
  pending_setup: { label: 'Pending Setup', dot: 'bg-amber-500', pill: 'bg-amber-100 text-amber-700' },
  suspended: { label: 'Suspended', dot: 'bg-red-500', pill: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', dot: 'bg-slate-400', pill: 'bg-slate-100 text-slate-500' },
};

type BusinessDetailProps = {
  businessId: string;
};

export default function BusinessDetail({ businessId }: BusinessDetailProps) {
  const { data, isLoading } = useGetAdminBusinessQuery(businessId);
  const business = data?.data;

  const [activate, { isLoading: isActivating }] = useActivateBusinessMutation();
  const [suspend, { isLoading: isSuspending }] = useSuspendBusinessMutation();
  const [cancel, { isLoading: isCancelling }] = useCancelBusinessMutation();

  const isActing = isActivating || isSuspending || isCancelling;

  const handleActivate = async () => {
    try {
      await activate(businessId).unwrap();
      toast.success('Business activated successfully');
    } catch {
      toast.error('Failed to activate business');
    }
  };

  const handleSuspend = async () => {
    try {
      await suspend(businessId).unwrap();
      toast.success('Business suspended');
    } catch {
      toast.error('Failed to suspend business');
    }
  };

  const handleCancel = async () => {
    try {
      await cancel(businessId).unwrap();
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

  const statusCfg = STATUS_CONFIG[business.status] ?? STATUS_CONFIG.cancelled;
  const initials = business.name.slice(0, 2).toUpperCase();

  const fields: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; mono?: boolean }[] = [
    { icon: FiMail, label: 'Email', value: business.email },
    ...(business.contact_person ? [{ icon: FiUser, label: 'Contact Person', value: business.contact_person }] : []),
    ...(business.phone ? [{ icon: FiPhone, label: 'Phone', value: business.phone }] : []),
    ...(business.website ? [{ icon: FiGlobe, label: 'Website', value: business.website }] : []),
    ...(business.industry ? [{ icon: FiBriefcase, label: 'Industry', value: business.industry }] : []),
    ...(business.subscription_plan ? [{ icon: FiLayers, label: 'Plan', value: business.subscription_plan }] : []),
    ...(business.token_balance !== undefined ? [{ icon: FiZap, label: 'Token Balance', value: business.token_balance.toLocaleString() }] : []),
    ...((business.country || business.region || business.state) ? [{ icon: FiMapPin, label: 'Location', value: [business.address, business.state, business.region, business.country].filter(Boolean).join(', ') }] : []),
    ...(business.partner_name ? [{ icon: FiUser, label: 'Partner', value: business.partner_name }] : []),
    ...(business.sales_agent_name ? [{ icon: FiUser, label: 'Sales Agent', value: business.sales_agent_name }] : []),
    ...(business.referral_code ? [{ icon: FiHash, label: 'Referral Code', value: business.referral_code, mono: true }] : []),
    ...(business.created_by ? [{ icon: FiUser, label: 'Created By', value: business.created_by }] : []),
    { icon: FiCalendar, label: 'Joined', value: new Date(business.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) },
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
          <Badge className={`mt-1 ${statusCfg.pill}`} dot={statusCfg.dot}>{statusCfg.label}</Badge>
        </div>
      </div>

      {/* Setup progress */}
      {business.setup_completion !== undefined && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Setup Progress</p>
          <ProgressBar value={business.setup_completion} colorized barWidth="flex-1" />
        </div>
      )}

      <SectionDivider label="Business Details" />

      {/* Fields */}
      <div className="space-y-2">
        {fields.map(f => (
          <InfoField key={f.label} icon={f.icon} label={f.label} value={f.value} mono={f.mono} />
        ))}
      </div>

      {/* Status actions */}
      {business.status !== 'cancelled' && (
        <>
          <SectionDivider label="Actions" />
          <div className="flex flex-wrap gap-2">
            {business.status !== 'active' && (
              <button
                type="button"
                onClick={handleActivate}
                disabled={isActing}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50"
              >
                <FiZap className="h-4 w-4" />
                {isActivating ? 'Activating…' : 'Activate'}
              </button>
            )}
            {business.status === 'active' && (
              <button
                type="button"
                onClick={handleSuspend}
                disabled={isActing}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-amber-600 disabled:opacity-50"
              >
                {isSuspending ? 'Suspending…' : 'Suspend'}
              </button>
            )}
            <button
              type="button"
              onClick={handleCancel}
              disabled={isActing}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-100 disabled:opacity-50"
            >
              {isCancelling ? 'Cancelling…' : 'Cancel Account'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
