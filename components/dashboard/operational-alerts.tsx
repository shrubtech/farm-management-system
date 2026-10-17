'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Wrench,
  Syringe,
  ArrowRight,
  BellRing,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';

export function OperationalAlerts() {
  const router = useRouter();
  const { inventory, equipment, notifications } = useFarmStore();

  const lowItem = inventory.find((i) => i.quantity <= i.reorderLevel) || {
    name: 'Drip Irrigation Fittings',
    quantity: 20,
    reorderLevel: 50,
    unit: 'units',
  };

  const overdueEq = equipment.find((e) => e.status === 'under_maintenance') || {
    name: 'John Deere 8R Tractor',
    notes: '250-hour routine fluid change',
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="h-4 w-4 text-[#DE5B50]" />
            <h2 className="text-base font-bold text-[#18251C] dark:text-white">
              Operational Alerts
            </h2>
          </div>
          <span className="rounded-full bg-[#FEF0EC] px-2.5 py-0.5 text-[10px] font-bold text-[#DE5B50] dark:bg-[#391B16] dark:text-[#F87171]">
            3 Requires Attention
          </span>
        </div>
        <p className="mt-0.5 text-xs text-[#7A877C] dark:text-[#8E9F92]">
          Direct triggers from telemetry & equipment logs
        </p>

        {/* Alerts List */}
        <div className="mt-3.5 space-y-2.5">
          {/* Alert 1: Low Inventory */}
          <div className="flex items-start justify-between rounded-2xl bg-[#FCFAF6] p-3 border border-[#F2ECE0] dark:bg-[#1B291F] dark:border-[#25392B]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FDF0E7] text-[#D97706] dark:bg-[#332213] dark:text-[#FBBF24]">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#18251C] dark:text-white">
                  Low Inventory Alert
                </p>
                <p className="text-[11px] text-[#556358] dark:text-[#9FB1A2]">
                  {lowItem.name} below buffer threshold
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-[#87968A] dark:text-[#8A9B8D]">
                  {lowItem.quantity} units remaining (Buffer: {lowItem.reorderLevel})
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/inventory')}
              className="rounded-lg border border-[#D5CEC0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#18251C] hover:bg-[#F8F5EE] dark:border-[#2D4032] dark:bg-[#18251C] dark:text-white dark:hover:bg-[#203425]"
            >
              Reorder
            </button>
          </div>

          {/* Alert 2: Maintenance Overdue */}
          <div className="flex items-start justify-between rounded-2xl bg-[#FCFAF6] p-3 border border-[#F2ECE0] dark:bg-[#1B291F] dark:border-[#25392B]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEF0EC] text-[#DE5B50] dark:bg-[#3A1E1A] dark:text-[#F87171]">
                <Wrench className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#18251C] dark:text-white">
                  Maintenance Overdue
                </p>
                <p className="text-[11px] text-[#556358] dark:text-[#9FB1A2]">
                  {overdueEq.name} 250-hour routine fluid change
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-[#DE5B50] dark:text-[#F87171]">
                  Overdue by 2 days (Plot C deploy held)
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/equipment')}
              className="rounded-lg border border-[#D5CEC0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#18251C] hover:bg-[#F8F5EE] dark:border-[#2D4032] dark:bg-[#18251C] dark:text-white dark:hover:bg-[#203425]"
            >
              Log Service
            </button>
          </div>

          {/* Alert 3: Vaccination Reminder */}
          <div className="flex items-start justify-between rounded-2xl bg-[#FCFAF6] p-3 border border-[#F2ECE0] dark:bg-[#1B291F] dark:border-[#25392B]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8F2] text-[#0D9488] dark:bg-[#14322C] dark:text-[#2DD4BF]">
                <Syringe className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#18251C] dark:text-white">
                  Vaccination Reminder
                </p>
                <p className="text-[11px] text-[#556358] dark:text-[#9FB1A2]">
                  Lot #4 Dairy Calves: Booster BVD scheduled
                </p>
                <p className="mt-0.5 text-[10px] font-semibold text-[#0D9488] dark:text-[#2DD4BF]">
                  Scheduled for Tomorrow, 08:30 AM
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/livestock')}
              className="rounded-lg border border-[#D5CEC0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#18251C] hover:bg-[#F8F5EE] dark:border-[#2D4032] dark:bg-[#18251C] dark:text-white dark:hover:bg-[#203425]"
            >
              View Lot
            </button>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-3.5 border-t border-[#F2ECE2] pt-3 text-right dark:border-[#1F3024]">
        <Link
          href="/settings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4F5D52] hover:text-[#18251C] dark:text-[#9FB1A2] dark:hover:text-white"
        >
          <span>Manage alert rules & webhooks</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
