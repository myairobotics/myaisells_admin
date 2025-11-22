'use client';

import { useState } from 'react';
import { FiCheckCircle, FiDollarSign, FiSearch, FiXCircle } from 'react-icons/fi';
import { PiCreditCard, PiCurrencyDollar } from 'react-icons/pi';
import { Loader } from '@/components/ui';
import { useGetPaymentsHistoryQuery } from '@/services';

export default function PaymentsHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  const { data, isLoading } = useGetPaymentsHistoryQuery('');
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

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string, paid: boolean) => {
    if (paid) {
      return 'bg-green-100 text-green-700';
    }
    if (status === 'requires_payment_method') {
      return 'bg-yellow-100 text-yellow-700';
    }
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-auto">
      {/* Header Section */}
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-linear-to-r from-primary-600 via-primary-500 to-primary-600" />
        <div className="absolute inset-0 bg-linear-to-br from-primary-400/30 to-transparent" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-300/20 blur-3xl" />

        <div className="relative flex flex-col justify-between space-y-4 px-6 py-8 md:px-8 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
              Payment History 💳
            </h1>
            <p className="text-base font-medium text-white/90 md:text-lg">
              Track all transactions and payment activities
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-xl border-2 border-white/30 bg-white/20 px-5 py-3 shadow-lg backdrop-blur-sm">
              <PiCurrencyDollar className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white">
                $
                {totalRevenue.toLocaleString()}
                {' '}
                Revenue
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 space-y-6 px-4 md:px-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
            <div className="relative rounded-xl border border-blue-100/50 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600">
                  <PiCreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Payments</p>
                  <p className="text-2xl font-bold text-slate-800">{payments.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-green-50/30 to-emerald-50/20 blur-xl" />
            <div className="relative rounded-xl border border-green-100/50 bg-white/80 p-6 shadow-xl shadow-green-500/5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-green-500 to-emerald-600">
                  <FiCheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Paid</p>
                  <p className="text-2xl font-bold text-slate-800">{totalPaid}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-red-50/30 to-rose-50/20 blur-xl" />
            <div className="relative rounded-xl border border-red-100/50 bg-white/80 p-6 shadow-xl shadow-red-500/5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-red-500 to-rose-600">
                  <FiXCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Unpaid</p>
                  <p className="text-2xl font-bold text-slate-800">{totalUnpaid}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-purple-50/30 to-violet-50/20 blur-xl" />
            <div className="relative rounded-xl border border-purple-100/50 bg-white/80 p-6 shadow-xl shadow-purple-500/5 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-violet-600">
                  <FiDollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                  <p className="text-xl font-bold text-slate-800">
                    $
                    {totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
          <div className="relative rounded-xl border border-blue-100/50 bg-white/80 p-4 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <FiSearch className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by customer, email, or transaction ID..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="input pl-12"
                />
              </div>

              <div className="flex gap-2">
                {(['all', 'paid', 'unpaid'] as const).map(filter => (
                  <button
                    type="button"
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                      statusFilter === filter
                        ? 'bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-blue-50/30 to-indigo-50/20 blur-xl" />
          <div className="relative rounded-2xl border border-blue-100/50 bg-white/80 shadow-xl shadow-blue-500/5 backdrop-blur-sm">
            {isLoading
              ? (
                  <div className="flex h-96 items-center justify-center">
                    <Loader />
                  </div>
                )
              : filteredPayments.length === 0
                ? (
                    <div className="flex h-96 flex-col items-center justify-center p-12">
                      <PiCreditCard className="mb-4 h-16 w-16 text-slate-300" />
                      <h3 className="mb-2 text-xl font-bold text-slate-700">No payments found</h3>
                      <p className="text-slate-500">Try adjusting your search or filters</p>
                    </div>
                  )
                : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-blue-100 bg-blue-50/50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Transaction ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Customer</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Amount</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Description</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredPayments.map(payment => (
                            <tr key={payment.id} className="transition-colors hover:bg-blue-50/30">
                              <td className="px-6 py-4">
                                <span className="font-mono text-sm text-slate-600">
                                  {payment.id.slice(0, 20)}
                                  ...
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-semibold text-slate-800">
                                    {payment.customer.name || 'N/A'}
                                  </p>
                                  <p className="text-sm text-slate-600">{payment.customer.email}</p>
                                </div>
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
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                  getStatusColor(payment.status, payment.paid)
                                }`}
                                >
                                  {payment.paid
                                    ? (
                                        <>
                                          <FiCheckCircle className="h-3.5 w-3.5" />
                                          {' '}
                                          Paid
                                        </>
                                      )
                                    : (
                                        <>
                                          <FiXCircle className="h-3.5 w-3.5" />
                                          {' '}
                                          {payment.status}
                                        </>
                                      )}
                                </span>
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
    </div>
  );
}
