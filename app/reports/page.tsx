'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  ShieldAlert,
  TrendingUp,
  Sprout,
  PawPrint,
  PackageOpen,
  Tractor,
  DollarSign,
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ReportsPage() {
  const { crops, livestock, inventory, equipment, transactions, tasks, farm } = useFarmStore();
  const { user } = useAuth();

  const [reportType, setReportType] = useState<
    'pnl' | 'crops' | 'livestock' | 'inventory' | 'equipment' | 'tasks'
  >('pnl');
  const [dateRange, setDateRange] = useState('all');

  // Role based access: Workers cannot view reports
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
          Workers do not have permission to access farm operational reports and financial analytics.
        </p>
      </div>
    );
  }

  // Exports
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const title = `FarmSync Report: ${reportType.toUpperCase()}`;
    doc.setFillColor(23, 52, 38);
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 16);

    let head: string[][] = [];
    let body: any[][] = [];

    if (reportType === 'pnl') {
      head = [['Type', 'Category', 'Description', 'Date', 'Amount']];
      body = transactions.map((t) => [
        t.type.toUpperCase(),
        t.category,
        t.description,
        t.date,
        formatCurrency(t.amount),
      ]);
    } else if (reportType === 'crops') {
      head = [['Crop', 'Variety', 'Plot', 'Acres', 'Status', 'Yield']];
      body = crops.map((c) => [
        c.name,
        c.variety,
        c.fieldPlot,
        `${c.areaAcres} Ac`,
        c.status.toUpperCase(),
        `${c.estimatedYield} ${c.yieldUnit}`,
      ]);
    } else if (reportType === 'inventory') {
      head = [['Item', 'Category', 'Quantity', 'Reorder Level', 'Unit Cost', 'Location']];
      body = inventory.map((i) => [
        i.name,
        i.category,
        `${i.quantity} ${i.unit}`,
        `${i.reorderLevel} ${i.unit}`,
        formatCurrency(i.unitCost),
        i.storageLocation,
      ]);
    } else {
      head = [['Asset', 'Model', 'Status', 'Cost', 'Last Service', 'Next Service']];
      body = equipment.map((e) => [
        e.name,
        e.model,
        e.status.replace('_', ' ').toUpperCase(),
        formatCurrency(e.purchaseCost),
        formatDate(e.lastServiceDate),
        formatDate(e.nextServiceDue),
      ]);
    }

    autoTable(doc, {
      startY: 35,
      head,
      body,
      headStyles: { fillColor: [23, 52, 38] },
      theme: 'grid',
    });

    doc.save(`FarmSync-${reportType}-Report.pdf`);
  };

  const handleExportExcel = () => {
    let dataToExport: any[] = [];
    if (reportType === 'pnl') {
      dataToExport = transactions.map((t) => ({
        Type: t.type,
        Category: t.category,
        Description: t.description,
        Amount: t.amount,
        Date: t.date,
        Method: t.paymentMethod,
      }));
    } else if (reportType === 'crops') {
      dataToExport = crops.map((c) => ({
        Crop: c.name,
        Variety: c.variety,
        Plot: c.fieldPlot,
        Acres: c.areaAcres,
        Stage: c.status,
        Yield: c.estimatedYield,
      }));
    } else if (reportType === 'inventory') {
      dataToExport = inventory.map((i) => ({
        Name: i.name,
        Category: i.category,
        Quantity: i.quantity,
        Unit: i.unit,
        ReorderLevel: i.reorderLevel,
        Location: i.storageLocation,
      }));
    } else {
      dataToExport = equipment.map((e) => ({
        Name: e.name,
        Model: e.model,
        Status: e.status,
        Cost: e.purchaseCost,
        NextService: e.nextServiceDue,
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, reportType.toUpperCase());
    XLSX.writeFile(workbook, `FarmSync-${reportType}-Report.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#18251C] dark:text-white flex items-center gap-2">
            Reports & Telemetry Analytics
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#67756B] dark:text-[#97A79A]">
            Auditable agribusiness reports with live charts, PDF generation, Excel workbook export, and print stylesheet.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 rounded-full border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs font-semibold text-[#18251C] shadow-sm hover:bg-[#F8F5EE] dark:border-[#2D4032] dark:bg-[#162319] dark:text-white"
          >
            <FileText className="h-3.5 w-3.5 text-[#DE5B50]" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 rounded-full border border-[#D5CEC0] bg-white px-3.5 py-2 text-xs font-semibold text-[#18251C] shadow-sm hover:bg-[#F8F5EE] dark:border-[#2D4032] dark:bg-[#162319] dark:text-white"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-[#1D7A40]" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-full bg-[#173426] px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report Module Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { id: 'pnl', label: 'Profit & Loss', icon: DollarSign },
          { id: 'crops', label: 'Crop Yields', icon: Sprout },
          { id: 'livestock', label: 'Herd Health', icon: PawPrint },
          { id: 'inventory', label: 'Inventory Buffer', icon: PackageOpen },
          { id: 'equipment', label: 'Machinery Downtime', icon: Tractor },
          { id: 'tasks', label: 'Task Performance', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = reportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as any)}
              className={`flex flex-col items-center justify-center rounded-2xl p-3.5 border transition-all text-center ${
                isActive
                  ? 'bg-[#173426] border-[#173426] text-white shadow-md dark:bg-[#1E3E2B] dark:border-[#22C55E]'
                  : 'bg-white border-[#ECE6DB] text-[#556358] hover:border-[#173426] dark:bg-[#152219] dark:border-[#233528] dark:text-[#9FB1A2]'
              }`}
            >
              <Icon className="h-5 w-5 mb-1.5" />
              <span className="text-xs font-bold leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Preview Surface */}
      <div className="rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
        <div className="flex items-center justify-between border-b border-[#ECE6DB] pb-4 dark:border-[#233528]">
          <div>
            <h3 className="text-base font-bold text-[#18251C] dark:text-white capitalize">
              {reportType.replace('_', ' ')} Executive Audit Preview
            </h3>
            <p className="text-xs text-[#79857B]">
              Generated for {farm.name} • Certified against local sensors
            </p>
          </div>
          <span className="rounded-full bg-[#E7F6ED] px-3 py-1 text-xs font-bold text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]">
            Audit Ready
          </span>
        </div>

        {/* Live Chart Preview for P&L or Crops */}
        {reportType === 'pnl' && (
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#79857B] mb-2">
              Financial Breakdown
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={transactions.slice(0, 6).map((t) => ({
                    category: t.category,
                    amount: t.amount,
                    type: t.type,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.6} />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `$${val}`} />
                  <Tooltip formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']} />
                  <Bar dataKey="amount" fill="#173426" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {reportType === 'crops' && (
          <div className="mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#79857B] mb-2">
              Projected Yield by Commodity
            </h4>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={crops.map((c) => ({
                    crop: c.name,
                    yield: c.estimatedYield,
                    acres: c.areaAcres,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.6} />
                  <XAxis dataKey="crop" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="yield" fill="#2E7D47" radius={[6, 6, 0, 0]} name="Tons Projected" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Data Table Preview */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#ECE6DB] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#79857B] dark:border-[#233528] dark:bg-[#111C14] dark:text-[#8E9F92]">
              <tr>
                <th className="px-4 py-3">Metric / Item</th>
                <th className="px-4 py-3">Reference / Stage</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Value / Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2ECE0] dark:divide-[#1F3024]">
              {reportType === 'pnl' &&
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-4 py-3 font-bold text-[#18251C] dark:text-white">
                      {tx.category}
                    </td>
                    <td className="px-4 py-3 text-[#556358] dark:text-[#9FB1A2]">{tx.description}</td>
                    <td className="px-4 py-3 text-[#556358] dark:text-[#9FB1A2]">
                      {formatDate(tx.date)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-bold ${
                        tx.type === 'sale' ? 'text-[#1D7A40]' : 'text-[#DE5B50]'
                      }`}
                    >
                      {tx.type === 'sale' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}

              {reportType === 'crops' &&
                crops.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-bold text-[#18251C] dark:text-white">{c.name}</td>
                    <td className="px-4 py-3 text-[#556358] dark:text-[#9FB1A2]">
                      {c.fieldPlot} ({c.areaAcres} Ac)
                    </td>
                    <td className="px-4 py-3 text-[#556358] dark:text-[#9FB1A2]">
                      {formatDate(c.plantingDate)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#18251C] dark:text-white">
                      {c.estimatedYield} {c.yieldUnit}
                    </td>
                  </tr>
                ))}

              {reportType === 'inventory' &&
                inventory.map((i) => (
                  <tr key={i.id}>
                    <td className="px-4 py-3 font-bold text-[#18251C] dark:text-white">{i.name}</td>
                    <td className="px-4 py-3 text-[#556358] dark:text-[#9FB1A2]">{i.category}</td>
                    <td className="px-4 py-3 text-[#556358] dark:text-[#9FB1A2]">
                      {i.storageLocation}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#18251C] dark:text-white">
                      {i.quantity} {i.unit}
                    </td>
                  </tr>
                ))}

              {reportType === 'equipment' &&
                equipment.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3 font-bold text-[#18251C] dark:text-white">{e.name}</td>
                    <td className="px-4 py-3 text-[#556358] dark:text-[#9FB1A2]">{e.model}</td>
                    <td className="px-4 py-3 text-[#556358] dark:text-[#9FB1A2]">
                      {formatDate(e.nextServiceDue)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#18251C] dark:text-white">
                      {formatCurrency(e.purchaseCost)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
