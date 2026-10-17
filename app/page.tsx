'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { StatCards } from '@/components/dashboard/stat-cards';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { CropDonut } from '@/components/dashboard/crop-donut';
import { TelemetryCard } from '@/components/dashboard/telemetry-card';
import { OperationalAlerts } from '@/components/dashboard/operational-alerts';
import { UpcomingTasks } from '@/components/dashboard/upcoming-tasks';
import { FieldLogs } from '@/components/dashboard/field-logs';
import { QuickRecordModal } from '@/components/layout/quick-record-modal';

import { useTranslation } from '@/components/i18n-provider';
import { SimpleModeDashboard } from '@/components/dashboard/simple-mode-dashboard';
import { MandiTicker } from '@/components/dashboard/mandi-ticker';

export default function DashboardPage() {
  const [isQuickRecordOpen, setIsQuickRecordOpen] = useState(false);
  const { simpleMode } = useTranslation();

  // If farmer enabled Simple Mode, render the large 6-tile accessible interface
  if (simpleMode) {
    return <SimpleModeDashboard />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Header with Greeting and Daily Log Export */}
      <DashboardHeader onOpenQuickRecord={() => setIsQuickRecordOpen(true)} />

      {/* 2. Live APMC Mandi Bhav Ticker */}
      <MandiTicker />

      {/* 3. Top Row: 6 Metric Stat Cards */}
      <StatCards />

      {/* 4. Middle Row: Revenue vs Expenses (Area) + Crop Distribution (Donut) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <CropDonut />
        </div>
      </div>

      {/* 5. Lower Middle Row: Field Telemetry & Atmosphere + Operational Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TelemetryCard />
        <OperationalAlerts />
      </div>

      {/* 6. Bottom Row: Upcoming Farm Tasks + Recent Field Logs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 pb-12">
        <UpcomingTasks />
        <FieldLogs />
      </div>

      {/* Modal triggered by Record Activity */}
      <QuickRecordModal
        isOpen={isQuickRecordOpen}
        onClose={() => setIsQuickRecordOpen(false)}
      />
    </div>
  );
}
