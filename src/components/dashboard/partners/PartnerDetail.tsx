'use client';

import { FiClock, FiMail, FiMapPin, FiTag, FiUser } from 'react-icons/fi';
import { Badge, InfoField, SectionDivider, Skeleton } from '@/components/ui';
import { useGetOnePartnerQuery } from '@/services';

type PartnerDetailProps = {
  partnerId: string;
};

export default function PartnerDetail({ partnerId }: PartnerDetailProps) {
  const { data, isLoading } = useGetOnePartnerQuery(partnerId);
  const partner = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-3 pt-2 pb-4">
          <Skeleton width={80} height={80} borderRadius={9999} />
          <div className="flex flex-col items-center gap-1.5">
            <Skeleton width={160} height={20} borderRadius={6} />
            <Skeleton width={100} height={14} borderRadius={6} />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map(k => (
            <div key={k} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
              <Skeleton width={28} height={28} borderRadius={8} />
              <div className="flex-1 space-y-1.5">
                <Skeleton width={64} height={11} borderRadius={4} />
                <Skeleton width="80%" height={14} borderRadius={4} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <FiUser className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">Partner not found</p>
      </div>
    );
  }

  const initials = `${partner.first_name.charAt(0)}${partner.last_name.charAt(0)}`.toUpperCase();
  const fullName = `${partner.first_name} ${partner.last_name}`;
  const isActive = partner.status === 'active';

  const fields: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }[] = [
    { icon: FiMail, label: 'Email', value: partner.email },
    { icon: FiTag, label: 'Tag', value: (partner as any).tag || '—' },
    { icon: FiMapPin, label: 'Region', value: (partner as any).region || '—' },
    {
      icon: FiClock,
      label: 'Last Login',
      value: partner.last_login_at
        ? new Date(partner.last_login_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : 'Never',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Avatar + identity */}
      <div className="flex flex-col items-center gap-3 pt-2 pb-1">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-700 text-2xl font-bold text-white shadow-lg ring-4 ring-primary-100">
            {initials}
          </div>
          <span className={`absolute right-0.5 bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-white ${isActive ? 'bg-emerald-500' : 'bg-amber-400'}`} />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900">{fullName}</h3>
          <Badge
            className={`mt-1 ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
            dot={isActive ? 'bg-emerald-500' : 'bg-amber-500'}
          >
            {isActive ? 'Active' : 'Pending'}
          </Badge>
        </div>
      </div>

      <SectionDivider label="Partner Details" />

      <div className="space-y-2">
        {fields.map(f => (
          <InfoField key={f.label} icon={f.icon} label={f.label} value={f.value} />
        ))}
      </div>
    </div>
  );
}
