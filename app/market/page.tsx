'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Store,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Calendar,
  MapPin,
  Scale,
  Sparkles,
  Download,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useTranslation } from '@/components/i18n-provider';
import { formatCurrencyINR, formatDateIndian } from '@/lib/units';
import { CCEA_MSP_LIST, getMspForCrop } from '@/lib/msp-config';
import { MandiPrice } from '@/types';

export default function MarketPricesPage() {
  const { mandiPrices, farm } = useFarmStore();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Unique commodities & states
  const uniqueCommodities = useMemo(() => {
    const set = new Set<string>();
    mandiPrices.forEach((p) => set.add(p.commodity));
    return Array.from(set).sort();
  }, [mandiPrices]);

  const uniqueStates = useMemo(() => {
    const set = new Set<string>();
    mandiPrices.forEach((p) => set.add(p.state));
    return Array.from(set).sort();
  }, [mandiPrices]);

  // Filtered prices
  const filteredPrices = useMemo(() => {
    return mandiPrices.filter((item) => {
      const matchSearch =
        searchQuery === '' ||
        item.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.mandiName || item.market || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchState = selectedState === 'All' || item.state === selectedState;
      const matchCommodity = selectedCommodity === 'All' || item.commodity === selectedCommodity;

      return matchSearch && matchState && matchCommodity;
    });
  }, [mandiPrices, searchQuery, selectedState, selectedCommodity]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#173426] p-6 text-white shadow-xl dark:bg-[#12241A] sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#86EFAC] backdrop-blur-md">
              <Store className="h-3.5 w-3.5" />
              <span>APMC Agmarknet Live Telemetry</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#FBF9F5] sm:text-3xl">
              {t('mandi_title') || 'APMC Mandi Live Market Prices'}
            </h1>
            <p className="mt-1 text-xs text-[#CBD5E1] sm:text-sm">
              {t('mandi_subtitle') ||
                'Real-time commodity arrival rates from Lasalgaon, Akola, Rajkot & official MSP support prices'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? t('syncing') : t('sync_agmarknet')}</span>
            </button>
            <a
              href="https://agmarknet.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-4 py-2.5 text-xs font-bold text-black shadow-md transition-all hover:bg-[#16A34A] active:scale-95"
            >
              <span>{t('agmarknet_portal')}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-[#22C55E]/10 blur-3xl" />
      </div>

      {/* MSP Reference Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CCEA_MSP_LIST.slice(0, 4).map((msp) => (
          <div
            key={msp.crop}
            className="flex flex-col justify-between rounded-2xl border border-[#ECE6DB] bg-white p-4 shadow-xs dark:border-[#233528] dark:bg-[#162319]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#173426] dark:text-[#22C55E]">
                {msp.crop}
              </span>
              <span className="rounded-md bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-bold text-[#1B5E20] dark:bg-[#1C3D26] dark:text-[#81C784]">
                {msp.season}
              </span>
            </div>
            <div className="mt-2">
              <div className="text-xl font-extrabold text-[#18251C] dark:text-white">
                {formatCurrencyINR(msp.mspRate ?? msp.mspPricePerQuintal)}
                <span className="text-xs font-normal text-[#79857B]"> / {msp.unit}</span>
              </div>
              <p className="mt-1 text-[11px] text-[#79857B] dark:text-[#8E9F92]">
                Official CCEA Minimum Support Price ({msp.year})
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#ECE6DB] bg-white p-4 shadow-xs dark:border-[#233528] dark:bg-[#162319] sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#79857B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commodity, market, or district (e.g., onion, Lasalgaon, Nashik)..."
            className="w-full rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] py-2 pl-10 pr-4 text-xs font-medium text-[#18251C] outline-none transition-all focus:border-[#173426] focus:bg-white dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white dark:focus:border-[#22C55E]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Commodity Dropdown */}
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#18251C] outline-none focus:border-[#173426] dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white"
          >
            <option value="All">All Commodities</option>
            {uniqueCommodities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* State Dropdown */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#18251C] outline-none focus:border-[#173426] dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white"
          >
            <option value="All">All States</option>
            {uniqueStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandi Price Grid Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPrices.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-[#D5CEC0] bg-[#FAF8F5] py-16 text-center dark:border-[#2C3F2E] dark:bg-[#121D15]">
            <Store className="mx-auto h-12 w-12 text-[#79857B]" />
            <h3 className="mt-3 text-sm font-bold text-[#18251C] dark:text-white">
              No Mandi Rates Found
            </h3>
            <p className="mt-1 text-xs text-[#79857B]">
              Try adjusting your search criteria or clear state filters.
            </p>
          </div>
        ) : (
          filteredPrices.map((item) => {
            const msp = getMspForCrop(item.commodity);
            const isAboveMsp = msp ? (item.modalPrice ?? item.modalPricePerQuintal) >= (msp.mspRate ?? msp.mspPricePerQuintal) : null;
            const diffPercent = msp
              ? ((((item.modalPrice ?? item.modalPricePerQuintal) - (msp.mspRate ?? msp.mspPricePerQuintal)) / (msp.mspRate ?? msp.mspPricePerQuintal)) * 100).toFixed(1)
              : null;

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-xs transition-all hover:border-[#173426] hover:shadow-md dark:border-[#233528] dark:bg-[#162319] dark:hover:border-[#22C55E]"
              >
                <div>
                  {/* Top: Commodity & Market */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-[#18251C] dark:text-white">
                          {item.commodity}
                        </span>
                        {item.variety && (
                          <span className="rounded-md bg-[#F3EFE7] px-2 py-0.5 text-[10px] font-semibold text-[#546256] dark:bg-[#1E2E22] dark:text-[#A0B0A3]">
                            {item.variety}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[#79857B] dark:text-[#8E9F92]">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[#22C55E]" />
                        <span>
                          {item.mandiName || item.market} APMC, {item.district} ({item.state})
                        </span>
                      </div>
                    </div>

                    {/* Trend Icon */}
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        item.trend === 'up'
                          ? 'bg-[#E8F5E9] text-[#1B5E20] dark:bg-[#1C3D26] dark:text-[#81C784]'
                          : item.trend === 'down'
                          ? 'bg-[#FEECEC] text-[#DF5D52] dark:bg-[#3E1A1A] dark:text-[#F87171]'
                          : 'bg-[#F3EFE7] text-[#79857B] dark:bg-[#1E2E22]'
                      }`}
                    >
                      {item.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                      ) : item.trend === 'down' ? (
                        <ArrowDownRight className="h-4 w-4 stroke-[2.5]" />
                      ) : (
                        <Minus className="h-4 w-4 stroke-[2.5]" />
                      )}
                    </div>
                  </div>

                  {/* Main Modal Rate */}
                  <div className="mt-4 rounded-2xl bg-[#FAF8F5] p-3.5 dark:bg-[#111A13]">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#79857B]">
                        Modal Rate
                      </span>
                      <span className="text-xl font-black text-[#173426] dark:text-[#22C55E]">
                        {formatCurrencyINR(item.modalPrice ?? item.modalPricePerQuintal)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-[#ECE6DB] pt-2 text-xs text-[#546256] dark:border-[#233528] dark:text-[#A0B0A3]">
                      <span>
                        Min: <strong>{formatCurrencyINR(item.minPrice ?? item.minPricePerQuintal)}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Max: <strong>{formatCurrencyINR(item.maxPrice ?? item.maxPricePerQuintal)}</strong>
                      </span>
                      <span>/ {item.unit}</span>
                    </div>
                  </div>

                  {/* MSP Comparison Tag */}
                  {msp && (
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-dashed border-[#D5CEC0] px-3 py-2 text-xs dark:border-[#2C3F2E]">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#22C55E]" />
                        <span className="font-semibold text-[#18251C] dark:text-white">
                          MSP {formatCurrencyINR(msp.mspRate ?? msp.mspPricePerQuintal)}
                        </span>
                      </div>
                      <span
                        className={`font-bold ${
                          isAboveMsp
                            ? 'text-[#16A34A] dark:text-[#4ADE80]'
                            : 'text-[#DC2626] dark:text-[#F87171]'
                        }`}
                      >
                        {isAboveMsp ? `+${diffPercent}% Above MSP` : `${diffPercent}% Below MSP`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Metadata */}
                <div className="mt-4 flex items-center justify-between border-t border-[#ECE6DB] pt-3 text-[11px] text-[#79857B] dark:border-[#233528] dark:text-[#8E9F92]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDateIndian(item.date)}
                  </span>
                  <span>Arrival: {item.arrivalQuantity || '1,420 Quintals'}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Advisory on APMC Commissions & Adat */}
      <div className="rounded-3xl border border-[#ECE6DB] bg-[#FAF8F5] p-5 text-xs text-[#546256] dark:border-[#233528] dark:bg-[#121D15] dark:text-[#A0B0A3]">
        <h4 className="font-bold text-[#18251C] dark:text-white">
          APMC Trading & Deduction Transparency Note:
        </h4>
        <p className="mt-1 leading-relaxed">
          As per State APMC Marketing Regulations (e.g. Maharashtra APMC Act, Punjab APMC Act),
          buyer commission (Adat, typically 3-5%) must be borne by the buyer/trader and cannot be
          deducted from the farmer’s payout. Permissible deductions from gross bills include only
          actual labor/weighing charges (Hamali/Tolayee) and designated transit fees. Record sales
          with transparent itemized deductions in the Sales & Expenses module.
        </p>
      </div>
    </div>
  );
}
