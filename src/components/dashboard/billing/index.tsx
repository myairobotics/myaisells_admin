'use client';

import type { BillingCredit, BillingPayment, BillingRefund, CreditBusinessRequest, RefundPaymentRequest } from '@/types';
import {
  Badge,
  EmptyState,
  FormField,
  Modal,
  PageHeader,
  Pagination,
  SearchFilterBar,
  TableRowSkeleton,
} from '@myairobotics/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FiCreditCard,
  FiDollarSign,
  FiGift,
  FiRotateCcw,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  useCreditBusinessMutation,
  useGetBillingCreditsQuery,
  useGetBillingPaymentsQuery,
  useGetBillingRefundsQuery,
  useRefundPaymentMutation,
} from '@/services';

function currency(amount: string | number) {
  const n = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
  return Number.isNaN(n) ? amount : n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function RefundForm({ payment, onClose }: { payment: BillingPayment; onClose: () => void }) {
  const [refund, { isLoading }] = useRefundPaymentMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<RefundPaymentRequest>();

  const onSubmit = async (values: RefundPaymentRequest) => {
    try {
      await refund({ subId: String(payment.id), body: values }).unwrap();
      toast.success('Refund issued');
      onClose();
    } catch {
      toast.error('Failed to issue refund');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
      <FormField
        label="Amount (leave blank for full refund)"
        id="amount"
        type="number"
        step="0.01"
        placeholder={payment.amount_paid}
        {...register('amount', { valueAsNumber: true })}
      />
      <FormField
        label="Reason"
        id="reason"
        placeholder="Duplicate charge"
        error={errors.reason ? 'Required' : undefined}
        {...register('reason', { required: true })}
      />
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60">
          {isLoading ? 'Refunding…' : 'Issue Refund'}
        </button>
      </div>
    </form>
  );
}

function CreditForm({ payment, onClose }: { payment: BillingPayment; onClose: () => void }) {
  const [credit, { isLoading }] = useCreditBusinessMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<CreditBusinessRequest>();

  const onSubmit = async (values: CreditBusinessRequest) => {
    try {
      await credit({ businessAppUserId: payment.business_app_user_id, body: values }).unwrap();
      toast.success('Credit issued');
      onClose();
    } catch {
      toast.error('Failed to issue credit');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-1 space-y-4">
      <FormField
        label="Amount"
        id="amount"
        type="number"
        step="0.01"
        error={errors.amount ? 'Required' : undefined}
        {...register('amount', { required: true, valueAsNumber: true })}
      />
      <FormField
        label="Reason"
        id="reason"
        placeholder="Goodwill credit"
        error={errors.reason ? 'Required' : undefined}
        {...register('reason', { required: true })}
      />
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-60">
          {isLoading ? 'Crediting…' : 'Issue Credit'}
        </button>
      </div>
    </form>
  );
}

function PaymentsTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [refundTarget, setRefundTarget] = useState<BillingPayment | null>(null);
  const [creditTarget, setCreditTarget] = useState<BillingPayment | null>(null);
  const { data, isLoading } = useGetBillingPaymentsQuery({ page, limit: 15, ...(search.trim() && { business: search.trim() }) });

  const payments = data?.data ?? [];
  const meta = data?.meta;

  return (
    <>
      <div className="p-4">
        <SearchFilterBar
          search={search}
          onSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by business…"
        />
      </div>
      {isLoading
        ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm"><tbody><TableRowSkeleton cols={5} rows={8} /></tbody></table>
            </div>
          )
        : payments.length === 0
          ? <EmptyState icon={<FiCreditCard />} message="No payments found" />
          : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-100 bg-slate-50/70">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Business</th>
                      <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase md:table-cell">Plan</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Amount</th>
                      <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase lg:table-cell">Status</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map(p => (
                      <tr key={p.id} className="transition-colors hover:bg-slate-50/70">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-slate-800">{p.business_name}</p>
                          <p className="text-xs text-slate-500">{p.business_email}</p>
                        </td>
                        <td className="hidden px-5 py-3.5 text-slate-500 md:table-cell">{p.plan_name}</td>
                        <td className="px-5 py-3.5 font-semibold text-slate-800">{currency(p.plan_price)}</td>
                        <td className="hidden px-5 py-3.5 lg:table-cell">
                          <Badge variant="rounded" className="bg-slate-100 text-slate-600">{p.status}</Badge>
                          {p.is_topup && <Badge variant="rounded" className="ml-1 bg-amber-100 text-amber-700">Top-up</Badge>}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <button type="button" onClick={() => setRefundTarget(p)} className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50">
                              <span className="flex items-center gap-1">
                                <FiRotateCcw className="h-3 w-3" />
                                Refund
                              </span>
                            </button>
                            <button type="button" onClick={() => setCreditTarget(p)} className="rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-50">
                              <span className="flex items-center gap-1">
                                <FiGift className="h-3 w-3" />
                                Credit
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      <Pagination page={page} totalPages={meta?.pages ?? 1} total={meta?.total} itemLabel="payment" onPageChange={setPage} />

      <Modal open={refundTarget !== null} onOpenChange={open => !open && setRefundTarget(null)} title="Issue Refund" className="max-w-md">
        {refundTarget && <RefundForm payment={refundTarget} onClose={() => setRefundTarget(null)} />}
      </Modal>
      <Modal open={creditTarget !== null} onOpenChange={open => !open && setCreditTarget(null)} title="Issue Account Credit" className="max-w-md">
        {creditTarget && <CreditForm payment={creditTarget} onClose={() => setCreditTarget(null)} />}
      </Modal>
    </>
  );
}

function RefundsTab() {
  const { data, isLoading } = useGetBillingRefundsQuery();
  const refunds: BillingRefund[] = data?.data ?? [];

  if (isLoading) {
    return <div className="overflow-x-auto"><table className="w-full text-sm"><tbody><TableRowSkeleton cols={3} rows={6} /></tbody></table></div>;
  }
  if (refunds.length === 0) {
    return <EmptyState icon={<FiRotateCcw />} message="No refunds issued yet" />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/70">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Payment</th>
            <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Amount</th>
            <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase md:table-cell">Reason</th>
            <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {refunds.map(r => (
            <tr key={r.id} className="transition-colors hover:bg-slate-50/70">
              <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{r.paymentId}</td>
              <td className="px-5 py-3.5 font-semibold text-slate-800">{currency(r.amount)}</td>
              <td className="hidden px-5 py-3.5 text-slate-500 md:table-cell">{r.reason}</td>
              <td className="px-5 py-3.5 text-slate-500">{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CreditsTab() {
  const { data, isLoading } = useGetBillingCreditsQuery();
  const credits: BillingCredit[] = data?.data ?? [];

  if (isLoading) {
    return <div className="overflow-x-auto"><table className="w-full text-sm"><tbody><TableRowSkeleton cols={3} rows={6} /></tbody></table></div>;
  }
  if (credits.length === 0) {
    return <EmptyState icon={<FiGift />} message="No account credits issued yet" />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/70">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Business</th>
            <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Amount</th>
            <th className="hidden px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase md:table-cell">Reason</th>
            <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {credits.map(c => (
            <tr key={c.id} className="transition-colors hover:bg-slate-50/70">
              <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{c.businessAppUserId}</td>
              <td className="px-5 py-3.5 font-semibold text-slate-800">{currency(c.amount)}</td>
              <td className="hidden px-5 py-3.5 text-slate-500 md:table-cell">{c.reason}</td>
              <td className="px-5 py-3.5 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type Tab = 'payments' | 'refunds' | 'credits';

export default function BillingManagement() {
  const [activeTab, setActiveTab] = useState<Tab>('payments');

  return (
    <div className="flex h-full w-full flex-col space-y-5 overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Billing"
        subtitle="Payments, refunds and account credits across the platform"
        icon={<FiDollarSign />}
      />

      <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        <div className="flex items-center gap-1 border-b border-slate-100 px-4 py-2">
          {(['payments', 'refunds', 'credits'] as Tab[]).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'payments' && <PaymentsTab />}
        {activeTab === 'refunds' && <RefundsTab />}
        {activeTab === 'credits' && <CreditsTab />}
      </div>
    </div>
  );
}
