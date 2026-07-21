'use client';

import type { CreateCurrencyRequest, Currency, UpdateCurrencyRequest } from '@/types';
import {
  EmptyState,
  FormField,
  Modal,
  PageHeader,
  TableRowSkeleton,
} from '@myairobotics/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiAlertTriangle, FiDollarSign, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  useCreateCurrencyMutation,
  useDeleteCurrencyMutation,
  useGetCurrenciesQuery,
  useUpdateCurrencyMutation,
} from '@/services';

/**
 * This route uses a legacy `passport.authenticate('access_token')` strategy
 * plus a Xynexi-internal API key for mutations, not the normal admin bearer
 * session. Verified against the live API on 2026-07-20: even a plain GET
 * returns 401 "Invalid access token" with a valid admin session token, so
 * this page will show an error state until that's resolved on the backend.
 */
function AuthWarningBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <FiAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="font-semibold">This module uses a different auth system than the rest of the admin panel.</p>
        <p className="mt-0.5 text-amber-700">
          Requests here will fail with "Invalid access token" until the backend exposes a path this admin session can authenticate with.
          Mutations additionally require a Xynexi internal API key, entered per-action below.
        </p>
      </div>
    </div>
  );
}

/* ─── Create/Edit form ─────────────────────────────────────────────── */

type CurrencyFormValues = CreateCurrencyRequest & { xynexiApiKey: string };

function CurrencyForm({ currency, onClose }: { currency?: Currency; onClose: () => void }) {
  const [createCurrency, { isLoading: isCreating }] = useCreateCurrencyMutation();
  const [updateCurrency, { isLoading: isUpdating }] = useUpdateCurrencyMutation();
  const isLoading = isCreating || isUpdating;
  const { register, handleSubmit, formState: { errors } } = useForm<CurrencyFormValues>({
    defaultValues: currency
      ? { code: currency.code, name: currency.name, symbol: currency.symbol, exchangeRate: currency.exchangeRate }
      : undefined,
  });

  const onSubmit = async (values: CurrencyFormValues) => {
    const { xynexiApiKey, ...body } = values;
    try {
      if (currency) {
        const patch: UpdateCurrencyRequest = { ...body, exchangeRate: Number(body.exchangeRate) };
        await updateCurrency({ id: currency.id, body: patch, xynexiApiKey }).unwrap();
        toast.success('Currency updated');
      } else {
        await createCurrency({ body: { ...body, exchangeRate: Number(body.exchangeRate) }, xynexiApiKey }).unwrap();
        toast.success('Currency created');
      }
      onClose();
    } catch {
      toast.error(currency ? 'Failed to update currency' : 'Failed to create currency');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
      <FormField label="Code" id="code" placeholder="USD" error={errors.code ? 'Required' : undefined} {...register('code', { required: true })} />
      <FormField label="Name" id="name" placeholder="US Dollar" error={errors.name ? 'Required' : undefined} {...register('name', { required: true })} />
      <FormField label="Symbol" id="symbol" placeholder="$" error={errors.symbol ? 'Required' : undefined} {...register('symbol', { required: true })} />
      <FormField label="Exchange Rate" id="exchangeRate" type="number" step="0.0001" error={errors.exchangeRate ? 'Required' : undefined} {...register('exchangeRate', { required: true })} />
      <FormField
        label="Xynexi Internal API Key"
        id="xynexiApiKey"
        type="password"
        hint="Required for this action; not stored anywhere in the app."
        error={errors.xynexiApiKey ? 'Required' : undefined}
        {...register('xynexiApiKey', { required: true })}
      />
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {isLoading ? 'Saving…' : currency ? 'Save Changes' : 'Create Currency'}
        </button>
      </div>
    </form>
  );
}

/* ─── Delete confirm ───────────────────────────────────────────────── */

function DeleteCurrencyForm({ currency, onClose }: { currency: Currency; onClose: () => void }) {
  const [deleteCurrency, { isLoading }] = useDeleteCurrencyMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<{ xynexiApiKey: string }>();

  const onSubmit = async (values: { xynexiApiKey: string }) => {
    try {
      await deleteCurrency({ id: currency.id, xynexiApiKey: values.xynexiApiKey }).unwrap();
      toast.success('Currency deleted');
      onClose();
    } catch {
      toast.error('Failed to delete currency');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
      <p className="text-sm text-slate-600">
        Delete
        {' '}
        <span className="font-semibold text-slate-800">{currency.name}</span>
        {' '}
        (
        {currency.code}
        )? This cannot be undone.
      </p>
      <FormField
        label="Xynexi Internal API Key"
        id="xynexiApiKey_delete"
        type="password"
        hint="Required for this action; not stored anywhere in the app."
        error={errors.xynexiApiKey ? 'Required' : undefined}
        {...register('xynexiApiKey', { required: true })}
      />
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
          {isLoading ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </form>
  );
}

/* ─── Main ─────────────────────────────────────────────────────────── */

export default function CurrenciesManagement() {
  const { data, isLoading, error } = useGetCurrenciesQuery();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Currency | null>(null);
  const [deleting, setDeleting] = useState<Currency | null>(null);

  const currencies: Currency[] = data?.data ?? [];

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Currencies"
        subtitle="Legacy currency configuration"
        icon={<FiDollarSign />}
        actions={(
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-xl border border-white/30 bg-white px-4 py-2.5 text-sm font-bold text-primary-600 shadow-sm transition-all hover:bg-white/90"
          >
            <FiPlus className="h-4 w-4" />
            New Currency
          </button>
        )}
      />

      <AuthWarningBanner />

      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        {isLoading
          ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm"><tbody><TableRowSkeleton cols={4} rows={5} /></tbody></table>
              </div>
            )
          : error
            ? (
                <EmptyState
                  icon={<FiAlertTriangle />}
                  message="Couldn't load currencies. This session isn't authorized for this route (see notice above)"
                />
              )
            : currencies.length === 0
              ? <EmptyState icon={<FiDollarSign />} message="No currencies configured" />
              : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-slate-100 bg-slate-50/70">
                        <tr>
                          <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Code</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Name</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Symbol</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Exchange Rate</th>
                          <th className="px-5 py-3 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currencies.map(c => (
                          <tr key={c.id} className="transition-colors hover:bg-slate-50/70">
                            <td className="px-5 py-3.5 font-mono font-semibold text-slate-800">{c.code}</td>
                            <td className="px-5 py-3.5 text-slate-600">{c.name}</td>
                            <td className="px-5 py-3.5 text-slate-600">{c.symbol}</td>
                            <td className="px-5 py-3.5 text-slate-600">{c.exchangeRate}</td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center justify-end gap-2">
                                <button type="button" onClick={() => setEditing(c)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                                  <FiEdit2 className="h-3 w-3" />
                                </button>
                                <button type="button" onClick={() => setDeleting(c)} className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">
                                  <FiTrash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
      </div>

      <Modal open={showCreate} onOpenChange={o => !o && setShowCreate(false)} title="New Currency" className="max-w-md">
        <CurrencyForm onClose={() => setShowCreate(false)} />
      </Modal>
      <Modal open={editing !== null} onOpenChange={o => !o && setEditing(null)} title="Edit Currency" className="max-w-md">
        {editing && <CurrencyForm currency={editing} onClose={() => setEditing(null)} />}
      </Modal>
      <Modal open={deleting !== null} onOpenChange={o => !o && setDeleting(null)} title="Delete Currency" className="max-w-md">
        {deleting && <DeleteCurrencyForm currency={deleting} onClose={() => setDeleting(null)} />}
      </Modal>
    </div>
  );
}
