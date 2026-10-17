'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Landmark,
  FileText,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Download,
  Upload,
  Plus,
  Trash2,
  Eye,
  AlertCircle,
  HelpCircle,
  IndianRupee,
  FolderLock,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useTranslation } from '@/components/i18n-provider';
import { formatCurrencyINR, formatDateIndian } from '@/lib/units';
import { FarmDocument, LoanRecord } from '@/types';

export default function GovernmentSchemesPage() {
  const {
    schemes,
    farmDocuments,
    addFarmDocument,
    deleteFarmDocument,
    loans,
    addLoanRecord,
    farm,
  } = useFarmStore();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'schemes' | 'vault' | 'loans'>('schemes');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // New Document Modal State
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<FarmDocument['docType']>('7_12_extract');
  const [docSurveyNo, setDocSurveyNo] = useState(farm.surveyNumber || '');
  const [docFileUrl, setDocFileUrl] = useState('');

  // New Loan Modal State
  const [isAddLoanOpen, setIsAddLoanOpen] = useState(false);
  const [lenderName, setLenderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [sanctionedAmount, setSanctionedAmount] = useState<number>(300000);
  const [disbursedAmount, setDisbursedAmount] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(7);
  const [subventionRate, setSubventionRate] = useState<number>(3);
  const [dueDate, setDueDate] = useState<string>('2026-03-31');

  // Filter schemes
  const filteredSchemes = schemes.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    addFarmDocument({
      title: docTitle.trim(),
      docType: docType,
      docNumber: docSurveyNo.trim() || undefined,
      issueDate: new Date().toISOString().split('T')[0],
      fileUrl: docFileUrl.trim() || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
      fileSize: '1.4 MB',
    });

    setDocTitle('');
    setIsAddDocOpen(false);
  };

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lenderName.trim() || !accountNumber.trim()) return;

    addLoanRecord({
      lenderName: lenderName.trim(),
      loanType: 'Kisan Credit Card (KCC)',
      accountNumber: accountNumber.trim(),
      principalAmount: Number(sanctionedAmount) || 0,
      subsidizedInterestRate: Math.max(0, (Number(interestRate) || 7) - (Number(subventionRate) || 3)),
      sanctionDate: new Date().toISOString().split('T')[0],
      dueDate,
      amountRepaid: 0,
      status: 'active',
    });

    setLenderName('');
    setAccountNumber('');
    setIsAddLoanOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#173426] p-6 text-white shadow-xl dark:bg-[#12241A] sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#86EFAC] backdrop-blur-md">
              <Landmark className="h-3.5 w-3.5" />
              <span>Direct Benefit Transfer & Land Records Vault</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#FBF9F5] sm:text-3xl">
              Government Schemes & Document Vault
            </h1>
            <p className="mt-1 text-xs text-[#CBD5E1] sm:text-sm">
              PM-KISAN, PMFBY, KCC Subsidies, 7/12 Satbara Digital Vault & Agricultural Credit
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddDocOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload 7/12 or Soil Card</span>
            </button>
            <button
              onClick={() => setIsAddLoanOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[#22C55E] px-4 py-2.5 text-xs font-bold text-black shadow-md transition-all hover:bg-[#16A34A] active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add KCC Loan</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 mt-6 flex gap-2 border-b border-white/10 pb-0">
          <button
            onClick={() => setActiveTab('schemes')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'schemes'
                ? 'border-[#22C55E] text-[#86EFAC]'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            Schemes Catalog ({schemes.length})
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'vault'
                ? 'border-[#22C55E] text-[#86EFAC]'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            Land & Document Vault ({farmDocuments.length})
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'loans'
                ? 'border-[#22C55E] text-[#86EFAC]'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            KCC & Agri Credit ({loans.length})
          </button>
        </div>

        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-[#22C55E]/10 blur-3xl" />
      </div>

      {/* TAB 1: SCHEMES CATALOG */}
      {activeTab === 'schemes' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Schemes' },
              { id: 'income_support', label: 'Income Support' },
              { id: 'insurance', label: 'Crop Insurance' },
              { id: 'credit', label: 'Credit & KCC' },
              { id: 'infrastructure', label: 'Solar & Irrigation' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#173426] text-white shadow-xs dark:bg-[#22C55E] dark:text-black font-bold'
                    : 'border border-[#E3DCCE] bg-white text-[#445047] hover:bg-[#F5F1E9] dark:border-[#263A2B] dark:bg-[#162319] dark:text-[#D1E0D4]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Schemes Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="group flex flex-col justify-between rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-xs transition-all hover:border-[#173426] hover:shadow-md dark:border-[#233528] dark:bg-[#162319] dark:hover:border-[#22C55E]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-block rounded-md bg-[#E8F5E9] px-2.5 py-0.5 text-[10px] font-bold text-[#1B5E20] dark:bg-[#1C3D26] dark:text-[#81C784]">
                        {scheme.category.replace(/_/g, ' ')}
                      </div>
                      <h3 className="mt-2 text-base font-extrabold text-[#18251C] dark:text-white">
                        {scheme.name}
                      </h3>
                    </div>

                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF8F5] text-[#173426] transition-colors hover:bg-[#173426] hover:text-white dark:bg-[#111A13] dark:text-[#22C55E] dark:hover:bg-[#22C55E] dark:hover:text-black"
                      title="Open Official Portal"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-[#546256] dark:text-[#A0B0A3]">
                    {scheme.tagline}
                  </p>

                  {/* Benefits Pill */}
                  <div className="mt-3 rounded-2xl bg-[#FAF8F5] p-3 text-xs font-semibold text-[#173426] dark:bg-[#111A13] dark:text-[#86EFAC]">
                    <strong>Benefits:</strong> {scheme.benefitAmount}
                  </div>

                  {/* Eligibility & Documents */}
                  <div className="mt-3 space-y-2 text-xs text-[#546256] dark:text-[#A0B0A3]">
                    <div>
                      <span className="font-bold text-[#18251C] dark:text-white">Eligibility:</span>{' '}
                      {scheme.eligibility}
                    </div>
                    <div>
                      <span className="font-bold text-[#18251C] dark:text-white">Required Docs:</span>{' '}
                      {scheme.documentsRequired.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 flex items-center justify-between border-t border-[#ECE6DB] pt-3 dark:border-[#233528]">
                  <span className="text-[11px] font-medium text-[#79857B]">
                    Status: <strong className="text-[#16A34A]">Active &amp; Open</strong>
                  </span>
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173426] hover:underline dark:text-[#22C55E]"
                  >
                    <span>Apply on Portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENT VAULT */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#18251C] dark:text-white">
                Farm Land Records & Document Safe
              </h2>
              <p className="text-xs text-[#79857B]">
                Store 7/12 Satbara extract, 8-A khate utara, Soil Health Card and Aadhaar safely
              </p>
            </div>
            <button
              onClick={() => setIsAddDocOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#173426] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#204433] dark:bg-[#22C55E] dark:text-black"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {farmDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col justify-between rounded-3xl border border-[#ECE6DB] bg-white p-5 shadow-xs dark:border-[#233528] dark:bg-[#162319]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E8F5E9] text-[#1B5E20] dark:bg-[#1C3D26] dark:text-[#81C784]">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#18251C] dark:text-white line-clamp-1">
                          {doc.title}
                        </h4>
                        <span className="text-[10px] font-semibold uppercase text-[#79857B]">
                          {doc.docType.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteFarmDocument(doc.id)}
                      className="rounded-lg p-1.5 text-[#DF5D52] hover:bg-[#FEECEC] dark:hover:bg-[#3E1A1A]"
                      title="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-1 rounded-2xl bg-[#FAF8F5] p-3 text-xs dark:bg-[#111A13]">
                    {doc.docNumber && (
                      <div className="flex justify-between">
                        <span className="text-[#79857B]">Survey / Gat:</span>
                        <span className="font-semibold text-[#18251C] dark:text-white">
                          {doc.docNumber}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#79857B]">Uploaded:</span>
                      <span className="font-semibold text-[#18251C] dark:text-white">
                        {formatDateIndian(doc.uploadedAt)}
                      </span>
                    </div>
                    {doc.fileSize && (
                      <div className="flex justify-between">
                        <span className="text-[#79857B]">Size:</span>
                        <span className="font-semibold text-[#18251C] dark:text-white">
                          {doc.fileSize}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#ECE6DB] pt-3 dark:border-[#233528]">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>

                  <a
                    href={doc.fileUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#173426] hover:underline dark:text-[#22C55E]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View / Print</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: KCC & AGRI CREDIT */}
      {activeTab === 'loans' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#18251C] dark:text-white">
                Kisan Credit Card (KCC) & Agricultural Credit Tracker
              </h2>
              <p className="text-xs text-[#79857B]">
                Track interest subvention (3% prompt repayment benefit) and loan clearance
              </p>
            </div>
            <button
              onClick={() => setIsAddLoanOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#173426] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#204433] dark:bg-[#22C55E] dark:text-black"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Credit Account</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {loans.map((loan) => {
              return (
                <div
                  key={loan.id}
                  className="rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-xs dark:border-[#233528] dark:bg-[#162319]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-md bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-bold text-[#1B5E20] dark:bg-[#1C3D26] dark:text-[#81C784]">
                        {loan.loanType}
                      </span>
                      <h3 className="mt-1 text-base font-extrabold text-[#18251C] dark:text-white">
                        {loan.lenderName}
                      </h3>
                      <p className="text-xs text-[#79857B]">A/C: {loan.accountNumber}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#79857B]">
                        Net Rate
                      </span>
                      <div className="text-lg font-black text-[#16A34A] dark:text-[#4ADE80]">
                        {loan.subsidizedInterestRate}% p.a.
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-[#FAF8F5] p-4 text-xs dark:bg-[#111A13]">
                    <div>
                      <span className="text-[#79857B]">Principal Amount</span>
                      <div className="text-sm font-bold text-[#18251C] dark:text-white">
                        {formatCurrencyINR(loan.principalAmount)}
                      </div>
                    </div>

                    <div>
                      <span className="text-[#79857B]">Amount Repaid</span>
                      <div className="text-sm font-bold text-[#16A34A]">
                        {formatCurrencyINR(loan.amountRepaid)}
                      </div>
                    </div>

                    <div>
                      <span className="text-[#79857B]">Subsidized Rate</span>
                      <div className="font-semibold text-[#18251C] dark:text-white">
                        {loan.subsidizedInterestRate}% p.a.
                      </div>
                    </div>

                    <div>
                      <span className="text-[#79857B]">Sanctioned On</span>
                      <div className="font-semibold text-[#18251C] dark:text-white">
                        {formatDateIndian(loan.sanctionDate)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#ECE6DB] pt-3 text-xs dark:border-[#233528]">
                    <span className="flex items-center gap-1 text-[#79857B]">
                      <Calendar className="h-3.5 w-3.5" />
                      Due Date: <strong>{formatDateIndian(loan.dueDate)}</strong>
                    </span>
                    <span className="rounded-full bg-[#E8F5E9] px-2.5 py-0.5 text-[10px] font-bold text-[#1B5E20] dark:bg-[#1C3D26] dark:text-[#81C784]">
                      {loan.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Add Document */}
      {isAddDocOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <h3 className="text-lg font-bold text-[#18251C] dark:text-white">
              Add Land Document to Vault
            </h3>
            <p className="mt-0.5 text-xs text-[#79857B]">
              Upload or link official 7/12 extract, 8A, or Soil Health Card
            </p>

            <form onSubmit={handleCreateDocument} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7/12 extract, Gat 142/2A"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#18251C] outline-none focus:border-[#173426] dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as FarmDocument['docType'])}
                  className="mt-1 w-full rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#18251C] outline-none focus:border-[#173426] dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white"
                >
                  <option value="7_12_extract">7/12 Extract</option>
                  <option value="soil_health_card">Soil Health Card</option>
                  <option value="kcc_passbook">Kisan Credit Card</option>
                  <option value="crop_insurance">PMFBY Insurance Policy</option>
                  <option value="aadhaar">Aadhaar / Identity Proof</option>
                  <option value="electricity_bill">Electricity Bill / Water Test Report</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                  Survey / Gat Number
                </label>
                <input
                  type="text"
                  placeholder="Gat No. 142/2A"
                  value={docSurveyNo}
                  onChange={(e) => setDocSurveyNo(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#18251C] outline-none focus:border-[#173426] dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                  Document URL / Cloud Scan
                </label>
                <input
                  type="text"
                  placeholder="https://... (Optional)"
                  value={docFileUrl}
                  onChange={(e) => setDocFileUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#18251C] outline-none focus:border-[#173426] dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddDocOpen(false)}
                  className="rounded-xl border border-[#E3DCCE] px-4 py-2 text-xs font-semibold text-[#546256] hover:bg-[#FAF8F5] dark:border-[#263A2B] dark:text-[#A0B0A3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#173426] px-4 py-2 text-xs font-bold text-white hover:bg-[#204433] dark:bg-[#22C55E] dark:text-black"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Loan */}
      {isAddLoanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
            <h3 className="text-lg font-bold text-[#18251C] dark:text-white">
              Add KCC / Agricultural Credit
            </h3>
            <p className="mt-0.5 text-xs text-[#79857B]">
              Record crop loan and track interest subvention incentive
            </p>

            <form onSubmit={handleCreateLoan} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                  Lender Bank / DCCB Society
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Bank of India / Nashik DCCB"
                  value={lenderName}
                  onChange={(e) => setLenderName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#18251C] outline-none focus:border-[#173426] dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                  Account / KCC Card Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="KCC-65492019482"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#18251C] outline-none focus:border-[#173426] dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                    Sanction Limit (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={sanctionedAmount}
                    onChange={(e) => setSanctionedAmount(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#18251C] outline-none focus:border-[#173426] dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                    Disbursed (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={disbursedAmount}
                    onChange={(e) => setDisbursedAmount(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#18251C] outline-none focus:border-[#173426] dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                    Base Interest Rate %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#18251C] outline-none focus:border-[#173426] dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                    Subvention %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={subventionRate}
                    onChange={(e) => setSubventionRate(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#18251C] outline-none focus:border-[#173426] dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#18251C] dark:text-white">
                  Repayment Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E3DCCE] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#18251C] outline-none focus:border-[#173426] dark:border-[#263A2B] dark:bg-[#111A13] dark:text-white"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddLoanOpen(false)}
                  className="rounded-xl border border-[#E3DCCE] px-4 py-2 text-xs font-semibold text-[#546256] hover:bg-[#FAF8F5] dark:border-[#263A2B] dark:text-[#A0B0A3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#173426] px-4 py-2 text-xs font-bold text-white hover:bg-[#204433] dark:bg-[#22C55E] dark:text-black"
                >
                  Save Loan Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
