'use client';

import { useState } from 'react';
import { FiCheckCircle, FiDollarSign, FiXCircle } from 'react-icons/fi';
import { PiCreditCard, PiCurrencyDollar } from 'react-icons/pi';
import { PageHeader } from '@/components/global/page-header';
import { Badge, EmptyState, SearchFilterBar, TableRowSkeleton } from '@/components/ui';
import { useGetPaymentsHistoryQuery } from '@/services';

export default function PaymentsHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  const { data, isLoading } = useGetPaymentsHistoryQuery();
  const payments = data?.data || [];

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch
      = payment.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        || payment.customer.name?.toLowerCase().includes(searchTerm.toLowerCase())
        || payment.id.toLowerCase().includes(searchTerm.toLowerCase())
        || payment.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus
      = statusFilter === 'all'
        || (statusFilter === 'paid' && payment.paid)
        || (statusFilter === 'unpaid' && !payment.paid);

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments
    .filter(p => p.paid)
    .reduce((sum, p) => sum + p.amount, 0) / 100;

  const totalPaid = payments.filter(p => p.paid).length;
  const totalUnpaid = payments.filter(p => !p.paid).length;

  const formatAmount = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);

  const formatDate = (timestamp: string) =>
    new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusColor = (status: string, paid: boolean) => {
    if (paid) {
      return 'bg-emerald-100 text-emerald-700';
    }
    if (status === 'requires_payment_method') {
      return 'bg-amber-100 text-amber-700';
    }
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-auto">
      <PageHeader
        title="Payment History"
        subtitle="Track all transactions and payment activities"
        icon={<PiCreditCard />}
        actions={(
          <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
            <PiCurrencyDollar className="h-4 w-4" />
            {totalRevenue.toLocaleString()}
            {' '}
            Revenue
          </div>
        )}
      />

      <div className="flex-1 space-y-4">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <PiCreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Payments</p>
                <p className="text-2xl font-bold text-slate-800">{payments.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiCheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Paid</p>
                <p className="text-2xl font-bold text-slate-800">{totalPaid}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <FiXCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Unpaid</p>
                <p className="text-2xl font-bold text-slate-800">{totalUnpaid}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <FiDollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                <p className="text-xl font-bold text-slate-800">
                  $
                  {totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <SearchFilterBar
          search={searchTerm}
          onSearch={setSearchTerm}
          placeholder="Search by customer, email, or transaction ID..."
        >
          <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {(['all', 'paid', 'unpaid'] as const).map(filter => (
              <button
                type="button"
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`rounded-md px-3.5 py-2 text-xs font-semibold capitalize transition-all ${
                  statusFilter === filter
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </SearchFilterBar>

        {/* Payments Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
          {isLoading
            ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      <TableRowSkeleton cols={6} rows={8} />
                    </tbody>
                  </table>
                </div>
              )
            : filteredPayments.length === 0
              ? (
                  <EmptyState icon={<PiCreditCard />} message="No payments found" />
                )
              : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-slate-100 bg-slate-50/70">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Transaction ID</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPayments.map(payment => (
                          <tr key={payment.id} className="transition-colors hover:bg-slate-50/70">
                            <td className="px-6 py-4">
                              <span className="font-mono text-sm text-slate-600">
                                {payment.id.slice(0, 20)}
                                ...
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-slate-800">{payment.customer.name || 'N/A'}</p>
                              <p className="text-sm text-slate-500">{payment.customer.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-slate-800">
                                {formatAmount(payment.amount, payment.currency)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {payment.description || 'No description'}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {formatDate(payment.created)}
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                className={getStatusColor(payment.status, payment.paid)}
                                icon={payment.paid ? <FiCheckCircle className="h-3.5 w-3.5" /> : <FiXCircle className="h-3.5 w-3.5" />}
                              >
                                {payment.paid ? 'Paid' : payment.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
        </div>
      </div>
    </div>
  );
}
