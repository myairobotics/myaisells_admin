import type { ReactElement } from 'react';
import { FiClock } from 'react-icons/fi';
import { PageHeader } from '@/components/global/page-header';

type ComingSoonProps = {
  title: string;
  description?: string;
  icon?: ReactElement;
};

export default function ComingSoon({ title, description, icon }: ComingSoonProps) {
  return (
    <div className="flex h-full w-full flex-col space-y-6">
      <PageHeader
        title={title}
        subtitle={description}
        icon={icon}
      />

      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <FiClock className="h-7 w-7 text-slate-400" />
        </div>
        <h2 className="mb-2 text-xl font-bold text-slate-700">Coming Soon</h2>
        <p className="max-w-sm text-sm text-slate-400">
          This module is under active development. Check back soon.
        </p>
      </div>
    </div>
  );
}
