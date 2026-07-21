'use client';

import type { ConfirmTwoFactorRequest, DisableTwoFactorRequest, SecuritySession } from '@/types';
import { Badge, FormField, Modal, PageHeader, SectionDivider, Skeleton } from '@myairobotics/ui';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiKey, FiLogOut, FiMonitor, FiShield } from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  useConfirmTwoFactorMutation,
  useDisableTwoFactorMutation,
  useGetSecuritySessionsQuery,
  useGetTwoFactorStatusQuery,
  useRevokeAllOtherSessionsMutation,
  useRevokeSecuritySessionMutation,
  useSetupTwoFactorMutation,
} from '@/services';

function TwoFactorSection() {
  const { data, isLoading, refetch } = useGetTwoFactorStatusQuery();
  const [setup, { data: setupData, isLoading: isSettingUp }] = useSetupTwoFactorMutation();
  const [confirm, { isLoading: isConfirming }] = useConfirmTwoFactorMutation();
  const [disable, { isLoading: isDisabling }] = useDisableTwoFactorMutation();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);

  const enabled = data?.data?.enabled ?? false;

  const confirmForm = useForm<ConfirmTwoFactorRequest>();
  const disableForm = useForm<DisableTwoFactorRequest>();

  const handleStartSetup = async () => {
    try {
      await setup().unwrap();
      setShowSetupModal(true);
    } catch {
      toast.error('Failed to start 2FA setup');
    }
  };

  const handleConfirm = async (values: ConfirmTwoFactorRequest) => {
    try {
      await confirm(values).unwrap();
      toast.success('Two-factor authentication enabled');
      setShowSetupModal(false);
      refetch();
    } catch {
      toast.error('Invalid verification code');
    }
  };

  const handleDisable = async (values: DisableTwoFactorRequest) => {
    try {
      await disable(values).unwrap();
      toast.success('Two-factor authentication disabled');
      setShowDisableModal(false);
      refetch();
    } catch {
      toast.error('Failed to disable 2FA');
    }
  };

  if (isLoading) {
    return <Skeleton width="100%" height={80} borderRadius={12} />;
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
            <FiKey className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Two-Factor Authentication</p>
            <p className="text-xs text-slate-500">Require a verification code at login</p>
          </div>
        </div>
        {enabled
          ? <Badge className="bg-emerald-100 text-emerald-700">Enabled</Badge>
          : <Badge className="bg-slate-100 text-slate-500">Disabled</Badge>}
      </div>
      <div className="mt-4">
        {enabled
          ? (
              <button type="button" onClick={() => setShowDisableModal(true)} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                Disable 2FA
              </button>
            )
          : (
              <button type="button" onClick={handleStartSetup} disabled={isSettingUp} className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
                {isSettingUp ? 'Starting…' : 'Enable 2FA'}
              </button>
            )}
      </div>

      <Modal open={showSetupModal} onOpenChange={open => !open && setShowSetupModal(false)} title="Set Up Two-Factor Authentication" className="max-w-sm">
        {setupData?.data && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Image src={setupData.data.qrCodeUrl} alt="2FA QR code" width={180} height={180} unoptimized />
            </div>
            <p className="text-center text-xs text-slate-500">Scan with your authenticator app, then enter the 6-digit code below.</p>
            <form onSubmit={confirmForm.handleSubmit(handleConfirm)} className="space-y-3">
              <FormField label="Verification Code" id="code" placeholder="123456" {...confirmForm.register('code', { required: true })} />
              <button type="submit" disabled={isConfirming} className="w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
                {isConfirming ? 'Verifying…' : 'Confirm & Enable'}
              </button>
            </form>
          </div>
        )}
      </Modal>

      <Modal open={showDisableModal} onOpenChange={open => !open && setShowDisableModal(false)} title="Disable Two-Factor Authentication" className="max-w-sm">
        <form onSubmit={disableForm.handleSubmit(handleDisable)} className="space-y-4">
          <FormField label="Current Password" id="password" type="password" {...disableForm.register('password', { required: true })} />
          <button type="submit" disabled={isDisabling} className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
            {isDisabling ? 'Disabling…' : 'Disable 2FA'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

function SessionsSection() {
  const { data, isLoading } = useGetSecuritySessionsQuery();
  const [revoke] = useRevokeSecuritySessionMutation();
  const [revokeAllOthers, { isLoading: isRevokingAll }] = useRevokeAllOtherSessionsMutation();

  const sessions: SecuritySession[] = data?.data ?? [];

  const handleRevoke = async (id: string) => {
    try {
      await revoke(id).unwrap();
      toast.success('Session revoked');
    } catch {
      toast.error('Failed to revoke session');
    }
  };

  const handleRevokeAll = async () => {
    try {
      await revokeAllOthers().unwrap();
      toast.success('All other sessions revoked');
    } catch {
      toast.error('Failed to revoke sessions');
    }
  };

  if (isLoading) {
    return <Skeleton width="100%" height={160} borderRadius={12} />;
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-800">Active Sessions</p>
        {sessions.length > 1 && (
          <button type="button" onClick={handleRevokeAll} disabled={isRevokingAll} className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-60">
            Revoke all other sessions
          </button>
        )}
      </div>
      <div className="mt-3 space-y-2">
        {sessions.map(s => (
          <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
            <div className="flex items-center gap-3">
              <FiMonitor className="h-4 w-4 shrink-0 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {s.ipAddress}
                  {s.isCurrent && <Badge className="ml-2 bg-emerald-100 text-emerald-700">This device</Badge>}
                </p>
                <p className="text-xs text-slate-500">{s.userAgent}</p>
              </div>
            </div>
            {!s.isCurrent && (
              <button type="button" onClick={() => handleRevoke(s.id)} className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50">
                <FiLogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SecuritySettings() {
  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="My Security"
        subtitle="Manage two-factor authentication and active sessions for your account"
        icon={<FiShield />}
      />
      <SectionDivider label="Two-Factor Authentication" />
      <TwoFactorSection />
      <SectionDivider label="Sessions" />
      <SessionsSection />
    </div>
  );
}
