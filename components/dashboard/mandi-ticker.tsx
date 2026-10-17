'use client';

import React from 'react';
import Link from 'next/link';
import { Store, ArrowUpRight, ArrowDownRight, Minus, ExternalLink } from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';
import { formatCurrencyINR } from '@/lib/units';
import { getMspForCrop } from '@/lib/msp-config';

export function MandiTicker() {
  const { mandiPrices } = useFarmStore();

  return (
    <div className="rounded-3xl border border-[#ECE6DB] bg-white p-4 shadow-xs dark:border-[#233528] dark:bg-[#162319]">
      <div className="flex items-center justify-between border-b border-[#ECE6DB] pb-3 dark:border-[#233528]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8F5E9] text-[#1B5E20] dark:bg-[#1C3D26] dark:text-[#81C784]">
            <Store className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#18251C] dark:text-white">
              Live Market Prices
            </h3>
            <p className="text-[10px] text-[#79857B]">Agmarknet Real-time APMC Rates</p>
          </div>
        </div>

        <Link
          href="/market"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#173426] hover:underline dark:text-[#22C55E]"
        >
          <span>View All Mandis</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {mandiPrices.slice(0, 6).map((item) => {
          const msp = getMspForCrop(item.commodity);
          const isAboveMsp = msp ? (item.modalPrice ?? item.modalPricePerQuintal) >= (msp.mspRate ?? msp.mspPricePerQuintal) : null;

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl bg-[#FAF8F5] p-2.5 transition-colors hover:bg-[#F2EFE8] dark:bg-[#111A13] dark:hover:bg-[#1A261D]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#18251C] dark:text-white truncate">
                    {item.commodity}
                  </span>
                  {item.trend === 'up' ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#16A34A]" />
                  ) : item.trend === 'down' ? (
                    <ArrowDownRight className="h-3.5 w-3.5 text-[#DC2626]" />
                  ) : (
                    <Minus className="h-3.5 w-3.5 text-[#79857B]" />
                  )}
                </div>
                <p className="text-[10px] text-[#79857B] truncate">{item.market} APMC</p>
              </div>

              <div className="mt-2">
                <div className="text-sm font-extrabold text-[#173426] dark:text-[#22C55E]">
                  {formatCurrencyINR(item.modalPrice ?? item.modalPricePerQuintal)}
                </div>
                <div className="flex items-center justify-between text-[9px] text-[#79857B]">
                  <span>/ {item.unit}</span>
                  {msp && (
                    <span
                      className={`font-semibold ${
                        isAboveMsp ? 'text-[#16A34A]' : 'text-[#DC2626]'
                      }`}
                    >
                      {isAboveMsp ? 'Above MSP' : 'Below MSP'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
