'use client';

import React, { useState, useMemo } from 'react';
import {
  IndianRupee,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Receipt,
  ArrowDownRight,
  ArrowUpRight,
  X,
  Check,
  Trash2,
  Calendar,
  Wallet,
  ShieldAlert,
  Building2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useAuth } from '@/components/auth-provider';
import { Transaction, TransactionType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { formatDateIndian, formatCurrencyINR } from '@/lib/units';

export default function FinancePage() {
  const { transactions, addTransaction, deleteTransaction } = useFarmStore();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'sale' | 'expense'>('all');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // New Transaction Form state for Indian Agribusiness
  const [newTx, setNewTx] = useState({
    type: 'sale' as TransactionType,
    category: 'Mandi Crop Sales',
    amount: 147000,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI / Bank Transfer',
    referenceNumber: `BILL-${Date.now().toString().slice(-4)}`,
    description: 'Red Onion Lot 60 Quintals sold at Lasalgaon APMC',
    customerName: 'Kisan Traders, Lasalgaon APMC',
    supplierName: '',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Block workers from viewing financial data as specified in requirements
  if (user?.role === 'worker') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#FEF0EC] text-[#DE5B50]">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-[#18251C] dark:text-white">
          Access Restricted
        </h2>
        <p className="mt-1 max-w-md text-xs text-[#6A786E] dark:text-[#9FB1A2]">
          Workers do not have permission to view farm financial balances, sales revenue, or operating expenses.
        </p>
      </div>
    );
  }

  const grossSales = transactions
    .filter((t) => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOpex = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netOperatingProfit = grossSales - totalOpex;
  const margin = ((netOperatingProfit / grossSales) * 100).toFixed(1);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesTab = activeTab === 'all' || t.type === activeTab;
      const matchesSearch =
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.referenceNumber.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [transactions, activeTab, search]);

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount) return;
    addTransaction({
      ...newTx,
      amount: Number(newTx.amount),
    });
    setIsAddModalOpen(false);
    showToast(`Recorded ${newTx.type.toUpperCase()}: ${formatCurrency(Number(newTx.amount))}`);
    setNewTx({
      type: 'sale',
      category: 'Crop Sales',
      amount: 12500,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Direct Deposit',
      referenceNumber: `INV-${Date.now().toString().slice(-4)}`,
      description: '',
      customerName: '',
      supplierName: '',
    });
  };

  // Monthly aggregated chart data
  const chartData = [
    { month: 'Jan', revenue: 26000, expenses: 18500 },
    { month: 'Feb', revenue: 31000, expenses: 19200 },
    { month: 'Mar', revenue: 38500, expenses: 20100 },
    { month: 'Apr', revenue: 44000, expenses: 20800 },
    { month: 'May', revenue: 49500, expenses: 21100 },
    { month: 'Jun', revenue: grossSales || 54820, expenses: totalOpex || 21390 },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#173426] px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-in fade-in">
          <Check className="h-4 w-4 text-[#22C55E]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#18251C] dark:text-white flex items-center gap-2">
            Sales & Operating Expenses
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#67756B] dark:text-[#97A79A]">
            Financial ledgers, commodity contracts, input purchases, and profit margin reconciliations.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#173426] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#79857B]">
              Gross Revenue
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E7F6ED] text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-[#18251C] dark:text-white">
            {formatCurrency(grossSales)}
          </p>
          <p className="mt-1 text-xs font-semibold text-[#1D7A40] dark:text-[#4ADE80]">
            +18% vs prev period
          </p>
        </div>

        <div className="rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#79857B]">
              Operational OPEX
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FEF0EC] text-[#DE5B50] dark:bg-[#3D1E18] dark:text-[#F87171]">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-[#18251C] dark:text-white">
            {formatCurrency(totalOpex)}
          </p>
          <p className="mt-1 text-xs font-semibold text-[#3E6547] dark:text-[#78A783]">
            -8% Budget under allocation
          </p>
        </div>

        <div className="rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#79857B]">
              Net Operating Profit
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#173426] text-[#22C55E] dark:bg-[#203D2A]">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-[#18251C] dark:text-white">
            {formatCurrency(netOperatingProfit)}
          </p>
          <p className="mt-1 text-xs font-bold text-[#1D7A40] dark:text-[#4ADE80]">
            60.9% Operating Margin
          </p>
        </div>

        <div className="rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#79857B]">
              Target Margin
            </span>
            <span className="rounded-full bg-[#E7F6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#1D7A40]">
              Healthy
            </span>
          </div>
          <p className="mt-2 text-2xl font-black text-[#18251C] dark:text-white">{margin}%</p>
          <p className="mt-1 text-xs text-[#79857B]">Target: 52.1% minimum</p>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
        <h3 className="text-sm font-bold text-[#18251C] dark:text-white mb-3">
          Monthly Inflow vs Outflow Comparison
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE9DE" opacity={0.6} />
              <XAxis dataKey="month" tick={{ fill: '#7A877C', fontSize: 11 }} />
              <YAxis
                tick={{ fill: '#7A877C', fontSize: 11 }}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #ECE6DB',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="revenue" fill="#173426" radius={[6, 6, 0, 0]} name="Revenue" />
              <Bar dataKey="expenses" fill="#E88E4B" radius={[6, 6, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table & Filter */}
      <div className="rounded-3xl border border-[#ECE6DB] bg-white shadow-sm dark:border-[#233528] dark:bg-[#152219] overflow-hidden">
        {/* Table Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE6DB] p-4 dark:border-[#233528]">
          <div className="flex rounded-xl border border-[#ECE6DB] p-0.5 dark:border-[#263A2B]">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black'
                  : 'text-[#79857B]'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setActiveTab('sale')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === 'sale'
                  ? 'bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black'
                  : 'text-[#79857B]'
              }`}
            >
              Sales (Inflow)
            </button>
            <button
              onClick={() => setActiveTab('expense')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === 'expense'
                  ? 'bg-[#DE5B50] text-white'
                  : 'text-[#79857B]'
              }`}
            >
              Expenses (Outflow)
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#79857B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category or reference..."
              className="w-full rounded-xl border border-[#ECE6DB] bg-[#FAF8F5] py-1.5 pl-8 pr-3 text-xs text-[#18251C] dark:border-[#263A2B] dark:bg-[#121D15] dark:text-white"
            />
          </div>
        </div>

        {/* Ledger */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#ECE6DB] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#79857B] dark:border-[#233528] dark:bg-[#111C14] dark:text-[#8E9F92]">
              <tr>
                <th className="px-5 py-3.5">Reference & Category</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Description</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Payment Method</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE0] dark:divide-[#1F3024]">
              {filteredTransactions.map((tx) => {
                const isSale = tx.type === 'sale';
                return (
                  <tr
                    key={tx.id}
                    className="transition-colors hover:bg-[#FBF9F4] dark:hover:bg-[#1C2C20]"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-[#18251C] dark:text-white">{tx.category}</p>
                      <p className="text-[10px] text-[#79857B]">{tx.referenceNumber}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isSale
                            ? 'bg-[#E7F6ED] text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]'
                            : 'bg-[#FEF0EC] text-[#DE5B50] dark:bg-[#3D1E18] dark:text-[#F87171]'
                        }`}
                      >
                        {isSale ? 'Sale (+)' : 'Expense (-)'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                      {tx.description}
                    </td>
                    <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                      {formatDateIndian(tx.date)}
                    </td>
                    <td className="px-4 py-3.5 text-[#556358] dark:text-[#9FB1A2]">
                      {tx.paymentMethod}
                    </td>
                    <td
                      className={`px-4 py-3.5 text-right font-black text-sm ${
                        isSale
                          ? 'text-[#1D7A40] dark:text-[#4ADE80]'
                          : 'text-[#DE5B50] dark:text-[#F87171]'
                      }`}
                    >
                      {isSale ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => {
                          deleteTransaction(tx.id);
                          showToast('Deleted transaction record');
                        }}
                        className="rounded-lg p-1 text-[#79857B] hover:text-[#DE5B50]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Transaction */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <div className="flex items-center justify-between border-b border-[#ECE6DB] px-6 py-4 dark:border-[#233528]">
              <div>
                <h3 className="text-base font-bold text-[#18251C] dark:text-white">
                  Record Financial Entry
                </h3>
                <p className="text-xs text-[#79857B]">APMC Mandi sales, inputs & daily farm ledgers</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-[#79857B]" />
              </button>
            </div>

            <form onSubmit={handleCreateTx} className="p-6 space-y-4">
              {/* Quick Preset Buttons */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#79857B]">
                  Quick Pick Transaction
                </label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {[
                    { title: 'APMC Onion Sale', type: 'sale', cat: 'Mandi Crop Sales', amt: 147000, desc: '60 Qtl Red Onion at Lasalgaon APMC' },
                    { title: 'Dairy Coop Payout', type: 'sale', cat: 'Dairy Revenue', amt: 28500, desc: 'Fortnightly milk payout from Dairy Union' },
                    { title: 'Fertilizer & DAP Bill', type: 'expense', cat: 'Inputs & Chemicals', amt: 18450, desc: 'IFFCO Urea & DAP purchase' },
                    { title: 'Farm Labor Wages', type: 'expense', cat: 'Labor & Wages', amt: 12000, desc: 'Weeding & spraying daily wages' },
                    { title: 'Tractor Diesel', type: 'expense', cat: 'Fuel & Power', amt: 4500, desc: '50L Diesel for Mahindra tractor' },
                  ].map((p) => (
                    <button
                      key={p.title}
                      type="button"
                      onClick={() =>
                        setNewTx({
                          ...newTx,
                          type: p.type as TransactionType,
                          category: p.cat,
                          amount: p.amt,
                          description: p.desc,
                        })
                      }
                      className="rounded-lg border border-[#D5CEC0] bg-[#FAF8F5] px-2.5 py-1 text-[11px] font-medium text-[#18251C] hover:bg-[#173426] hover:text-white dark:border-[#2C3F2E] dark:bg-[#111A13] dark:text-white"
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Type
                  </label>
                  <select
                    value={newTx.type}
                    onChange={(e) =>
                      setNewTx({ ...newTx, type: e.target.value as TransactionType })
                    }
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  >
                    <option value="sale">Income / Sale (+)</option>
                    <option value="expense">Expense / Outflow (-)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Market crop sales"
                    value={newTx.category}
                    onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Payment Method
                  </label>
                  <select
                    value={newTx.paymentMethod}
                    onChange={(e) => setNewTx({ ...newTx, paymentMethod: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  >
                    <option value="UPI / PhonePe / GPay">UPI (PhonePe / GPay / Paytm)</option>
                    <option value="NEFT / RTGS Transfer">Bank Transfer (NEFT / RTGS / IMPS)</option>
                    <option value="Cash">Cash</option>
                    <option value="DCCB Society Transfer">DCCB District Cooperative Society</option>
                    <option value="Cheque / DD">Cheque / Demand Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Transaction Description / APMC Lot Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lasalgaon Market Lot 60 Quintals, Buyer: Kisan Traders"
                  value={newTx.description}
                  onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#173426] py-2.5 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
              >
                Submit Financial Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
