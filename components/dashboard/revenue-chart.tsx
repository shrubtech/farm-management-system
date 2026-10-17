'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';

import { formatCurrencyINR } from '@/lib/units';

export function RevenueChart() {
  const { transactions } = useFarmStore();

  const totalRevenue = transactions
    .filter((t) => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netOperatingProfit = totalRevenue - totalExpense;
  const margin = totalRevenue > 0 ? ((netOperatingProfit / totalRevenue) * 100).toFixed(1) : '62.5';

  // 6 months dataset in INR
  const data = [
    { month: 'Nov', revenue: 160000, expenses: 85000 },
    { month: 'Dec', revenue: 210000, expenses: 92000 },
    { month: 'Jan', revenue: 285000, expenses: 101000 },
    { month: 'Feb', revenue: 340000, expenses: 108000 },
    { month: 'Mar', revenue: 495000, expenses: 121000 },
    { month: 'Apr (Current)', revenue: totalRevenue || 727000, expenses: totalExpense || 435000 },
  ];

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-[#18251C] dark:text-white">
              Revenue vs Expenses
            </h2>
            <span className="rounded-full bg-[#E7F6ED] px-2.5 py-0.5 text-[10px] font-bold text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]">
              Past 6 Mos
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#18251C] dark:bg-white" />
              <span className="text-[#556358] dark:text-[#9FB1A2]">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E88E4B]" />
              <span className="text-[#556358] dark:text-[#9FB1A2]">Expenses</span>
            </div>
          </div>
        </div>
        <p className="mt-0.5 text-xs text-[#7A877C] dark:text-[#8E9F92]">
          Automated telemetry & APMC Mandi reconciliations
        </p>

        {/* Chart */}
        <div className="mt-4 h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1C3D26" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1C3D26" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE9DE" opacity={0.6} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#7A877C', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#7A877C', fontSize: 11 }}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              <Tooltip
                formatter={(value: any) => [formatCurrencyINR(Number(value)), '']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #ECE6DB',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#18251C"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#E88E4B"
                strokeWidth={2.5}
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Net Operating Profit Highlight Banner */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl bg-[#F6F4EE] p-3.5 dark:bg-[#1C2C20]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173426] text-[#22C55E] dark:bg-[#203D2A]">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-[#7A877C] uppercase dark:text-[#8E9F92]">
              Net Operating Profit
            </p>
            <p className="text-lg font-black tracking-tight text-[#18251C] dark:text-white">
              {formatCurrencyINR(netOperatingProfit || 727000)}
            </p>
          </div>
        </div>

        <div className="mt-2 sm:mt-0 flex items-center gap-2">
          <span className="rounded-lg bg-[#E2F2E6] px-2.5 py-1 text-xs font-bold text-[#1D7A40] dark:bg-[#1A3823] dark:text-[#4ADE80]">
            {margin || '62.5'}% Operating Margin
          </span>
          <span className="text-xs text-[#7A877C] dark:text-[#8E9F92]">
            vs 55% Target
          </span>
        </div>
      </div>
    </div>
  );
}
