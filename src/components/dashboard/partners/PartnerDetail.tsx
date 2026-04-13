'use client';

import { FiArrowLeft, FiClock, FiMail, FiShield, FiUser } from 'react-icons/fi';
import { Loader } from '@/components/ui';
import { useGetOnePartnerQuery } from '@/services';

type PartnerDetailProps = {
  partnerId: string;
  onBackAction: () => void;
};

export default function PartnerDetail({ partnerId, onBackAction }: PartnerDetailProps) {
  const { data, isLoading } = useGetOnePartnerQuery(partnerId);
  const partner = data?.data;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <FiUser className="mb-4 h-16 w-16 text-slate-300" />
        <h3 className="mb-2 text-xl font-bold text-slate-700">Partner not found</h3>
        <button
          type="button"
          onClick={onBackAction}
          className="mt-4 cursor-pointer text-sm font-semibold text-primary-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const initials = `${partner.first_name.charAt(0)}${partner.last_name.charAt(0)}`;
  const fullName = `${partner.first_name} ${partner.last_name}`;
  const isActive = partner.status === 'active';

  const details = [
    { icon: <FiUser className="h-4 w-4 text-slate-400" />, label: 'Full Name', value: fullName },
    { icon: <FiMail className="h-4 w-4 text-slate-400" />, label: 'Email', value: partner.email },
    { icon: <FiShield className="h-4 w-4 text-slate-400" />, label: 'Status', value: partner.status.charAt(0).toUpperCase() + partner.status.slice(1) },
    {
      icon: <FiClock className="h-4 w-4 text-slate-400" />,
      label: 'Last Login',
      value: partner.last_login_at
        ? new Date(partner.last_login_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Never',
    },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-auto">
      {/* Back link */}
      <div className="mb-6 px-4 md:px-6">
        <button
          type="button"
          onClick={onBackAction}
          className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-primary-600"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to Partners
        </button>
      </div>

      {/* Profile header */}
      <div className="mx-4 mb-6 overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-xl md:mx-6">
        <div className="flex items-center gap-5 bg-linear-to-r from-primary-600 via-primary-500 to-primary-400 px-6 py-6 md:px-8">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold text-white backdrop-blur-sm ring-2 ring-white/30">
            {initials}
          </div>
          <div className="flex flex-1 items-center justify-between gap-4">
            <h1 className="truncate text-xl font-bold text-white md:text-2xl">{fullName}</h1>
            <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
              isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-green-600' : 'bg-amber-600'}`} />
              {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="mx-4 rounded-2xl border border-slate-200/60 bg-white shadow-sm md:mx-6">
        <div className="border-b border-slate-100 px-6 py-4 md:px-8">
          <h2 className="text-sm font-bold tracking-wide text-slate-800 uppercase">Partner Information</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {details.map(item => (
            <div key={item.label} className="flex items-center gap-4 px-6 py-4 md:px-8">
              {item.icon}
              <span className="w-28 shrink-0 text-sm font-medium text-slate-400">{item.label}</span>
              <span className="min-w-0 truncate text-sm font-semibold text-slate-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
