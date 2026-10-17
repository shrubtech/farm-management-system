'use client';

import React from 'react';
import { Download, Plus } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useTranslation } from '@/components/i18n-provider';
import { formatDateIndian, formatCurrencyINR } from '@/lib/units';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DashboardHeaderProps {
  onOpenQuickRecord: () => void;
}

export function DashboardHeader({ onOpenQuickRecord }: DashboardHeaderProps) {
  const { user } = useAuth();
  const { farm, crops, livestock, inventory, tasks, transactions } = useFarmStore();
  const { t } = useTranslation();

  const handleDownloadDailyLog = () => {
    const doc = new jsPDF();
    const today = formatDateIndian(new Date().toISOString());

    // Header
    doc.setFillColor(23, 52, 38);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('FarmSync - Daily Operations Summary', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${farm.name} • ${today}`, 14, 25);

    // Summary Box
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Farm Telemetry Overview', 14, 42);

    const grossRevenue = transactions
      .filter((t) => t.type === 'sale')
      .reduce((sum, t) => sum + t.amount, 0);
    const grossExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalArea = crops.reduce((sum, c) => sum + c.areaAcres, 0);

    autoTable(doc, {
      startY: 46,
      head: [['Metric', 'Current Reading', 'Status / Notes']],
      body: [
        ['Active Crops', `${crops.length} Crops (${totalArea || 25} Acres)`, 'Kharif & Rabi Season Sowing'],
        ['Desi Livestock', `${livestock.length} Animals`, 'Gir Cows & Murrah Buffaloes'],
        ['Agri Inputs Buffer', `${inventory.filter((i) => i.quantity <= i.reorderLevel).length} Low Items`, 'Urea, DAP, NPK Adequate'],
        ['Active Field Tasks', `${tasks.filter((t) => t.status !== 'completed').length} Tasks`, 'Drip fertigation & spraying in progress'],
        ['Season Gross Sales', `Rs. ${grossRevenue.toLocaleString('en-IN')}`, 'Mandi & Dairy Society Payouts'],
        ['Operational Expenses', `Rs. ${grossExpense.toLocaleString('en-IN')}`, 'Under Allocated Budget'],
        ['Net Farm Profit', `Rs. ${(grossRevenue - grossExpense).toLocaleString('en-IN')}`, 'Operating Margin Healthy'],
      ],
      headStyles: { fillColor: [23, 52, 38], textColor: 255 },
      theme: 'grid',
    });

    // Upcoming Tasks Table
    const nextY = (doc as any).lastAutoTable.finalY + 12;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Priority Farm Tasks', 14, nextY);

    autoTable(doc, {
      startY: nextY + 4,
      head: [['Task Title', 'Location / Plot', 'Assigned To', 'Priority', 'Status']],
      body: tasks.map((t) => [
        t.title,
        t.relatedPlot || 'Gat 142/2A',
        t.assignedToName,
        t.priority.toUpperCase(),
        t.status.toUpperCase(),
      ]),
      headStyles: { fillColor: [70, 100, 80], textColor: 255 },
      theme: 'striped',
    });

    doc.save(`FarmSync-Daily-Log-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Rajesh';
  const todayFormatted = formatDateIndian(new Date().toISOString());

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#18251C] dark:text-white flex items-center gap-2">
          {t('greeting_welcome')}, {firstName} 🌾
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#67756B] dark:text-[#97A79A]">
          Here is what is happening across <strong className="font-semibold text-[#18251C] dark:text-white">{farm.name}</strong> today, {todayFormatted}.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleDownloadDailyLog}
          className="flex items-center gap-2 rounded-full border border-[#D5CEC0] bg-white px-4 py-2.5 text-xs font-semibold text-[#324035] shadow-sm transition-all hover:bg-[#F8F5EE] active:scale-95 dark:border-[#2D4032] dark:bg-[#162319] dark:text-[#E2ECE4] dark:hover:bg-[#1C2C20]"
        >
          <Download className="h-3.5 w-3.5 text-[#5D6B60] dark:text-[#90A294]" />
          <span>{t('download_daily_log')}</span>
        </button>

        <button
          onClick={onOpenQuickRecord}
          className="flex items-center gap-2 rounded-full bg-[#173426] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#204533] active:scale-95 dark:bg-[#22C55E] dark:text-black dark:hover:bg-[#16A34A]"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>{t('record_activity')}</span>
        </button>
      </div>
    </div>
  );
}
