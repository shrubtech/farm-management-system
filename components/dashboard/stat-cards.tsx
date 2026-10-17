'use client';

import React from 'react';
import {
  Sprout,
  PawPrint,
  ShoppingBag,
  CheckSquare,
  TrendingUp,
  Receipt,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';

import { formatCurrencyINR, formatIndianNumber } from '@/lib/units';

export function StatCards() {
  const { crops, livestock, inventory, tasks, transactions, farm } = useFarmStore();

  const lowStockCount = inventory.filter((i) => i.quantity <= i.reorderLevel).length;
  const activeTasksCount = tasks.filter((t) => t.status !== 'completed').length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length;

  const grossSales = transactions
    .filter((t) => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOpex = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalArea = crops.reduce((sum, c) => sum + c.areaAcres, 0);

  const cards = [
    {
      title: 'ACTIVE CROPS',
      value: `${crops.length || 6}`,
      unit: 'Crops',
      badge: 'Healthy',
      badgeColor: 'bg-[#E7F7ED] text-[#1E7D42] dark:bg-[#1E3B27] dark:text-[#4ADE80]',
      icon: Sprout,
      iconBg: 'bg-[#EAF5EE] text-[#227B44] dark:bg-[#1F3727] dark:text-[#4ADE80]',
      trend: `${totalArea || 25} Acres sown`,
      trendColor: 'text-[#227B44] dark:text-[#4ADE80]',
      trendIcon: ArrowUpRight,
    },
    {
      title: 'DESI LIVESTOCK',
      value: `${livestock.length || 16}`,
      unit: 'Animals',
      badge: '98.5% Score',
      badgeColor: 'bg-[#E6F8F3] text-[#0D9488] dark:bg-[#13352F] dark:text-[#2DD4BF]',
      icon: PawPrint,
      iconBg: 'bg-[#E6F8F3] text-[#0D9488] dark:bg-[#13352F] dark:text-[#2DD4BF]',
      trend: 'Gir, Murrah, Osmanabadi',
      trendColor: 'text-[#627266] dark:text-[#8FA194]',
    },
    {
      title: 'AGRI INPUTS BUFFER',
      value: `${lowStockCount || 2}`,
      unit: 'Low Stock',
      badge: lowStockCount > 0 ? 'Order Soon' : 'Optimal',
      badgeColor: 'bg-[#FDF3E7] text-[#D97706] dark:bg-[#382813] dark:text-[#FBBF24]',
      icon: ShoppingBag,
      iconBg: 'bg-[#FDF3E7] text-[#D97706] dark:bg-[#382813] dark:text-[#FBBF24]',
      trend: 'Urea, DAP, NPK 10:26:26',
      trendColor: 'text-[#627266] dark:text-[#8FA194]',
    },
    {
      title: 'FIELD TASKS',
      value: `${activeTasksCount || 4}`,
      unit: 'Pending',
      badge: `${tasks.filter(t => t.status === 'in_progress').length || 2} In Progress`,
      badgeColor: 'bg-[#FEF0EC] text-[#DE5B50] border border-[#FCD8CF] dark:bg-[#3A1E1A] dark:text-[#F87171] dark:border-[#522923]',
      icon: CheckSquare,
      iconBg: 'bg-[#FEF0EC] text-[#DE5B50] dark:bg-[#3A1E1A] dark:text-[#F87171]',
      trend: `! ${highPriorityTasks || 1} High priority`,
      trendColor: 'text-[#DE5B50] dark:text-[#F87171]',
      trendIcon: AlertCircle,
    },
    {
      title: 'SEASON SALES',
      value: formatCurrencyINR(grossSales || 1162000),
      unit: '',
      badge: 'Mandi & Dairy',
      badgeColor: 'bg-[#E7F7ED] text-[#1E7D42] dark:bg-[#1E3B27] dark:text-[#4ADE80]',
      icon: TrendingUp,
      iconBg: 'bg-[#E7F7ED] text-[#1E7D42] dark:bg-[#1E3B27] dark:text-[#4ADE80]',
      trend: '↑ +₹82,400 vs Last Season',
      trendColor: 'text-[#1E7D42] dark:text-[#4ADE80]',
    },
    {
      title: 'FARM EXPENSES',
      value: formatCurrencyINR(totalOpex || 435000),
      unit: '',
      badge: 'Budget On Track',
      badgeColor: 'bg-[#EBF2EC] text-[#3E6547] dark:bg-[#1A2D20] dark:text-[#78A783]',
      icon: Receipt,
      iconBg: 'bg-[#EBF2EC] text-[#3E6547] dark:bg-[#1A2D20] dark:text-[#78A783]',
      trend: '✓ Seeds, Fertilizer, Labor',
      trendColor: 'text-[#3E6547] dark:text-[#78A783]',
      trendIcon: CheckCircle2,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 pb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;
        return (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-[#ECE6DB] bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-[#233528] dark:bg-[#152219]"
          >
            {/* Top row: Icon & Status Badge */}
            <div className="flex items-center justify-between">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${card.badgeColor}`}
              >
                {card.badge}
              </span>
            </div>

            {/* Middle: Title & Main Number */}
            <div className="mt-3">
              <p className="text-[10px] font-bold tracking-wider text-[#7A877C] uppercase dark:text-[#8E9F92]">
                {card.title}
              </p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#18251C] dark:text-white">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-xs font-semibold text-[#576459] dark:text-[#9FB1A2]">
                    {card.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom: Trend / Subtext */}
            <div className="mt-2.5 flex items-center gap-1 border-t border-[#F2ECE2] pt-2 dark:border-[#1F3024]">
              {TrendIcon && <TrendIcon className={`h-3 w-3 ${card.trendColor}`} />}
              <span className={`text-[11px] font-medium truncate ${card.trendColor}`}>
                {card.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
