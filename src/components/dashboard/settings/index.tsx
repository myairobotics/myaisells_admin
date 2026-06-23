'use client';

import type { PlatformConfig, SubscriptionPlan } from '@/types';
import { useState } from 'react';
import {
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiMail,
  FiRefreshCw,
  FiSettings,
  FiShield,
  FiToggleLeft,
  FiToggleRight,
  FiUsers,
  FiX,
  FiZap,
} from 'react-icons/fi';
import { PageHeader } from '@/components/global/page-header';
import { useGetPlatformConfigQuery, useGetSubscriptionPlansQuery } from '@/services';

/* ─── Tab types ───────────────────────────────────────────────────── */

type Tab = 'plans' | 'platform';

/* ─── Plan card ───────────────────────────────────────────────────── */

function PlanCard({ plan }: { plan: SubscriptionPlan }) {
  const isActive = plan.status === 'active';
  return (
    <div className={`relative overflow-hidden rounded-xl border p-5 transition-all ${plan.is_popular ? 'border-primary-300 ring-2 ring-primary-500/20' : 'border-slate-200/60'} bg-white shadow-sm`}>
      {plan.is_popular && (
        <div className="absolute top-0 right-0 rounded-bl-xl bg-primary-600 px-3 py-1 text-xs font-bold text-white">
          Popular
        </div>
      )}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
          {plan.description && <p className="mt-0.5 text-xs text-slate-500">{plan.description}</p>}
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {isActive ? 'Active' : plan.status === 'inactive' ? 'Inactive' : 'Archived'}
        </span>
      </div>

      {/* Pricing */}
      <div className="mb-4">
        <p className="text-3xl font-bold text-slate-900">
          $
          {plan.price_monthly.toLocaleString()}
          <span className="ml-1 text-sm font-normal text-slate-500">/mo</span>
        </p>
        {plan.price_annual && (
          <p className="mt-0.5 text-xs text-slate-500">
            or $
            {plan.price_annual.toLocaleString()}
            /yr (save
            {' '}
            {Math.round((1 - plan.price_annual / (plan.price_monthly * 12)) * 100)}
            %)
          </p>
        )}
      </div>

      {/* Limits */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          <FiZap className="h-3 w-3" />
          {plan.token_allowance.toLocaleString()}
          {' '}
          tokens
        </span>
        {plan.max_users && (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            <FiUsers className="h-3 w-3" />
            {plan.max_users}
            {' '}
            users
          </span>
        )}
        {plan.max_campaigns && (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            <FiCheckCircle className="h-3 w-3" />
            {plan.max_campaigns}
            {' '}
            campaigns
          </span>
        )}
      </div>

      {/* Features */}
      {plan.features.length > 0 && (
        <ul className="space-y-1.5">
          {plan.features.map(f => (
            <li key={f.label} className="flex items-center gap-2 text-xs">
              {f.included
                ? <FiCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                : <FiX className="h-3.5 w-3.5 shrink-0 text-slate-300" />}
              <span className={f.included ? 'text-slate-700' : 'text-slate-400 line-through'}>{f.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─── Config row ──────────────────────────────────────────────────── */

function ConfigRow({ icon, label, value, mono = false }: { icon: React.ReactNode; label: string; value: string | number | boolean; mono?: boolean }) {
  const display = typeof value === 'boolean'
    ? (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${value ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
          {value ? <FiToggleRight className="h-3.5 w-3.5" /> : <FiToggleLeft className="h-3.5 w-3.5" />}
          {value ? 'Enabled' : 'Disabled'}
        </span>
      )
    : <span className={`text-sm font-medium text-slate-800 ${mono ? 'font-mono' : ''}`}>{String(value)}</span>;

  return (
    <div className="flex items-center gap-4 py-3.5">
      <span className="shrink-0 text-slate-400">{icon}</span>
      <div className="flex-1">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <div className="mt-0.5">{display}</div>
      </div>
    </div>
  );
}

/* ─── Skeleton ────────────────────────────────────────────────────── */

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 h-5 w-32 rounded bg-slate-200" />
      <div className="mb-4 h-9 w-24 rounded bg-slate-200" />
      <div className="space-y-2">
        {Array.from({ length: 4 }, (_, i) => `skel-${i}`).map(key => <div key={key} className="h-3 w-full rounded bg-slate-100" />)}
      </div>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────────── */

export default function PlatformSettings() {
  const [activeTab, setActiveTab] = useState<Tab>('plans');

  const { data: plansData, isLoading: plansLoading, refetch: refetchPlans, isFetching: plansFetching } = useGetSubscriptionPlansQuery();
  const { data: configData, isLoading: configLoading, refetch: refetchConfig, isFetching: configFetching } = useGetPlatformConfigQuery();

  const plans: SubscriptionPlan[] = plansData?.data ?? [];
  const config: PlatformConfig | undefined = configData?.data;

  const isFetching = plansFetching || configFetching;

  const handleRefetch = () => {
    if (activeTab === 'plans') refetchPlans();
    else refetchConfig();
  };

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Platform Settings"
        subtitle="Manage subscription plans, pricing, and global platform configuration"
        icon={<FiSettings />}
        actions={(
          <button
            type="button"
            onClick={handleRefetch}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/25 disabled:opacity-60"
          >
            <FiRefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        )}
      />

      {/* Tabs */}
      <div className="flex gap-1 self-start rounded-xl border border-slate-200 bg-slate-100 p-1">
        {([
          { value: 'plans', label: 'Subscription Plans', icon: <FiZap className="h-4 w-4" /> },
          { value: 'platform', label: 'Platform Config', icon: <FiSettings className="h-4 w-4" /> },
        ] as const).map(tab => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeTab === tab.value ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Plans tab */}
      {activeTab === 'plans' && (
        <div>
          {plansLoading
            ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 3 }, (_, i) => `skel-${i}`).map(key => <CardSkeleton key={key} />)}
                </div>
              )
            : plans.length === 0
              ? (
                  <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200/60 bg-white">
                    <p className="text-slate-500">No subscription plans configured</p>
                  </div>
                )
              : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {plans.map(plan => <PlanCard key={plan.id} plan={plan} />)}
                  </div>
                )}
        </div>
      )}

      {/* Platform config tab */}
      {activeTab === 'platform' && (
        <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
          {configLoading
            ? (
                <div className="space-y-4 p-6">
                  {Array.from({ length: 8 }, (_, i) => `skel-${i}`).map(key => (
                    <div key={key} className="flex items-center gap-4">
                      <div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                      </div>
                    </div>
                  ))}
                </div>
              )
            : !config
              ? (
                  <div className="flex h-64 items-center justify-center">
                    <p className="text-slate-500">Platform config unavailable</p>
                  </div>
                )
              : (
                  <div className="divide-y divide-slate-100 px-6">
                    <p className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">General</p>
                    <ConfigRow icon={<FiGlobe />} label="Platform Name" value={config.platform_name} />
                    <ConfigRow icon={<FiMail />} label="Support Email" value={config.support_email} />
                    {config.support_url && <ConfigRow icon={<FiGlobe />} label="Support URL" value={config.support_url} />}

                    <p className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Billing</p>
                    <ConfigRow icon={<FiClock />} label="Trial Period" value={`${config.trial_period_days} days`} />
                    <ConfigRow icon={<FiClock />} label="Grace Period" value={`${config.grace_period_days} days`} />
                    <ConfigRow icon={<FiZap />} label="Default Token Allocation" value={config.default_token_allocation.toLocaleString()} />

                    <p className="py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Access Controls</p>
                    <ConfigRow icon={<FiUsers />} label="Allow Self-Signup" value={config.allow_self_signup} />
                    <ConfigRow icon={<FiMail />} label="Require Email Verification" value={config.require_email_verification} />
                    <ConfigRow icon={<FiShield />} label="Maintenance Mode" value={config.maintenance_mode} />

                    <div className="py-4">
                      <p className="text-xs text-slate-400">
                        Last updated:
                        {' '}
                        {new Date(config.updated_at).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )}
        </div>
      )}
    </div>
  );
}
