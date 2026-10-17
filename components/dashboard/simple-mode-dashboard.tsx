'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sprout,
  PawPrint,
  CheckSquare,
  IndianRupee,
  TrendingUp,
  CloudSun,
  Plus,
  ArrowRight,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  FileText,
  Store,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useTranslation } from '@/components/i18n-provider';
import { formatCurrencyINR, formatDateIndian } from '@/lib/units';
import { QuickRecordModal } from '@/components/layout/quick-record-modal';

export function SimpleModeDashboard() {
  const { farm, crops, livestock, tasks, transactions, milkEntries, mandiPrices } = useFarmStore();
  const { toggleSimpleMode, t } = useTranslation();
  const [isQuickRecordOpen, setIsQuickRecordOpen] = useState(false);

  // Quick stats
  const todayDate = new Date().toISOString().split('T')[0];
  const todayMilk = milkEntries
    .filter((m) => m.date === todayDate)
    .reduce((sum, m) => sum + m.quantityLitres, 0);

  const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;

  const grossSales = transactions
    .filter((t) => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);

  const onionMandi = mandiPrices.find((p) => p.commodity.toLowerCase().includes('onion'));

  const tiles = [
    {
      id: 'crops',
        title: 'Crops & Fields',
      subtitle: 'Crops & Fields',
        stat: `${crops.length} crops (${farm.totalAreaAcres || 25} acres)`,
        actionText: 'View Crops / Add Records',
      href: '/crops',
      icon: Sprout,
      color: 'bg-[#173426] text-[#22C55E]',
      border: 'border-[#173426]/20 hover:border-[#173426]',
      bgGlow: 'from-[#173426]/10 to-transparent',
    },
    {
      id: 'livestock',
      title: 'Livestock & Milk Records',
      subtitle: 'Livestock & Daily Milk',
      stat: `Today's milk: ${todayMilk > 0 ? todayMilk : 38.5} L (${livestock.length} animals)`,
      actionText: 'Log Milk / View Livestock',
      href: '/livestock',
      icon: PawPrint,
      color: 'bg-[#0D9488] text-white',
      border: 'border-[#0D9488]/20 hover:border-[#0D9488]',
      bgGlow: 'from-[#0D9488]/10 to-transparent',
    },
    {
      id: 'tasks',
      title: 'Farm Tasks',
      subtitle: 'Daily Farm Tasks',
      stat: `${pendingTasks} tasks remaining (spraying, fertilizer, irrigation)`,
      actionText: 'Review Tasks',
      href: '/tasks',
      icon: CheckSquare,
      color: 'bg-[#D97706] text-white',
      border: 'border-[#D97706]/20 hover:border-[#D97706]',
      bgGlow: 'from-[#D97706]/10 to-transparent',
    },
    {
      id: 'finance',
      title: 'Sales & Expenses',
      subtitle: 'Sales & Farm Expenses',
      stat: `Total sales: ${formatCurrencyINR(grossSales || 1162000)}`,
      actionText: 'Add Sale / Expense',
      href: '/finance',
      icon: IndianRupee,
      color: 'bg-[#16A34A] text-white',
      border: 'border-[#16A34A]/20 hover:border-[#16A34A]',
      bgGlow: 'from-[#16A34A]/10 to-transparent',
    },
    {
      id: 'market',
      title: 'Market Prices',
      subtitle: 'Live APMC Mandi Rates',
      stat: `Onion at Lasalgaon: ${formatCurrencyINR(onionMandi?.modalPrice || 2450)} / quintal`,
      actionText: 'View All Market Prices',
      href: '/market',
      icon: TrendingUp,
      color: 'bg-[#2563EB] text-white',
      border: 'border-[#2563EB]/20 hover:border-[#2563EB]',
      bgGlow: 'from-[#2563EB]/10 to-transparent',
    },
    {
      id: 'weather',
      title: 'Weather & Advisory',
      subtitle: 'Weather & Agromet Advisory',
      stat: '28°C Clear sky • Nashik (MH)',
      actionText: 'View Weather Forecast',
      href: '/weather',
      icon: CloudSun,
      color: 'bg-[#0284C7] text-white',
      border: 'border-[#0284C7]/20 hover:border-[#0284C7]',
      bgGlow: 'from-[#0284C7]/10 to-transparent',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Simple Mode Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-[#173426] p-6 text-white shadow-xl dark:bg-[#101F16] sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#22C55E]/20 px-3.5 py-1 text-xs font-bold text-[#86EFAC]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Simple Touch View</span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-[#FBF9F5] sm:text-3xl">
              Welcome, {farm.ownerName.split(' ')[0]}!
            </h1>
            <p className="mt-1 text-sm text-[#CBD5E1]">
              {farm.name} • {farm.village}, {farm.district} (Survey No. {farm.surveyNumber})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsQuickRecordOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-[#E7AC38] px-5 py-3.5 text-sm font-extrabold text-[#18251C] shadow-lg transition-transform hover:bg-[#D69B2A] active:scale-95"
            >
              <Plus className="h-5 w-5 stroke-[3]" />
              <span>Quick Entry</span>
            </button>

            <button
              onClick={toggleSimpleMode}
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              Switch to Full App
            </button>
          </div>
        </div>
      </div>

      {/* 6 BIG TOUCH TILES */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.id}
              href={tile.href}
              className={`group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-3xl border-2 bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-[#162319] ${tile.border}`}
            >
              {/* Background gradient glow */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tile.bgGlow} opacity-30 group-hover:opacity-60 transition-opacity`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${tile.color}`}
                  >
                    <Icon className="h-7 w-7 stroke-[2.2]" />
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF8F5] text-[#173426] transition-transform group-hover:translate-x-1 dark:bg-[#1F3024] dark:text-[#22C55E]">
                    <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-xl font-black text-[#18251C] dark:text-white">
                    {tile.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#79857B] dark:text-[#8E9F92]">
                    {tile.subtitle}
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-4 border-t border-[#ECE6DB] pt-3 dark:border-[#233528]">
                <p className="text-sm font-bold text-[#173426] dark:text-[#86EFAC]">{tile.stat}</p>
                <div className="mt-1 text-xs font-semibold text-[#546256] underline group-hover:text-[#18251C] dark:text-[#A0B0A3] dark:group-hover:text-white">
                  {tile.actionText} →
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Direct Kisan Call Centre & Scheme Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-xs dark:border-[#233528] dark:bg-[#162319]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F5E9] text-[#1B5E20] dark:bg-[#1C3D26] dark:text-[#81C784]">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#18251C] dark:text-white">
                Farmer Call Centre
              </h4>
              <p className="text-xs text-[#79857B]">Toll Free: 1800-180-1551 (Free agricultural advice)</p>
            </div>
          </div>
          <a
            href="tel:18001801551"
            className="rounded-xl bg-[#16A34A] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#15803D]"
          >
            Call Now
          </a>
        </div>

        <Link
          href="/schemes"
          className="flex items-center justify-between rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-xs hover:border-[#173426] dark:border-[#233528] dark:bg-[#162319]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF3C7] text-[#B45309] dark:bg-[#392813] dark:text-[#FBBF24]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#18251C] dark:text-white">
                Government Schemes & Land Records
              </h4>
              <p className="text-xs text-[#79857B]">PM-KISAN, crop insurance, and secure digital land records</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#173426] dark:text-[#22C55E]">View →</span>
        </Link>
      </div>

      <QuickRecordModal
        isOpen={isQuickRecordOpen}
        onClose={() => setIsQuickRecordOpen(false)}
      />
    </div>
  );
}
