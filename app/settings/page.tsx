'use client';

import React, { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Palette,
  RotateCcw,
  Check,
  Ticket,
  Copy,
  Type,
  Maximize2,
  MapPin,
  Smartphone,
  MessageSquare,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useAuth } from '@/components/auth-provider';
import { useTheme } from '@/components/theme-provider';
import { useTranslation } from '@/components/i18n-provider';
import { UserRole, AreaUnit } from '@/types';

export default function SettingsPage() {
  const {
    farm,
    currentUser,
    updateProfile,
    resetToDefaults,
    invites,
    createInvite,
    revokeInvite,
    setDefaultAreaUnit,
  } = useFarmStore();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const {
    fontSize,
    setFontSize,
    simpleMode,
    toggleSimpleMode,
    t,
  } = useTranslation();

  const isOwner = user?.role === 'owner';
  const isManager = user?.role === 'manager';
  const canInvite = isOwner || isManager;

  // Invite Generator states
  const [inviteRole, setInviteRole] = useState<UserRole>(isManager ? 'worker' : 'worker');
  const [inviteExpiry, setInviteExpiry] = useState<'24h' | '7d' | '30d'>('7d');
  const [inviteEmail, setInviteEmail] = useState('');
  const [lastCreatedCode, setLastCreatedCode] = useState<string | null>(null);

  // Profile states
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+91 98220 14285');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Selected area unit
  const [currentAreaUnit, setCurrentAreaUnit] = useState<AreaUnit>(
    farm.defaultAreaUnit || currentUser.defaultAreaUnit || 'acre'
  );

  // Notification toggles with WhatsApp / SMS
  const [notifTasks, setNotifTasks] = useState(true);
  const [notifStock, setNotifStock] = useState(true);
  const [notifMaint, setNotifMaint] = useState(true);
  const [notifWeather, setNotifWeather] = useState(true);
  const [notifMandiWhatsApp, setNotifMandiWhatsApp] = useState(true);
  const [notifSmsAlerts, setNotifSmsAlerts] = useState(true);
  const [notifVaccination, setNotifVaccination] = useState(true);

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate Indian phone number (10 digits with optional +91 or leading 0)
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const indianPhoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
    if (cleanPhone && !indianPhoneRegex.test(cleanPhone)) {
      showToast('Enter a valid 10-digit Indian mobile number (+91 98XXX XXXXX).');
      return;
    }
    updateProfile({ fullName, email, phone });
    showToast(t('saved_successfully'));
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      showToast('Password must contain at least 8 characters.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    showToast('Password changed successfully.');
  };

  const handleAreaUnitChange = (unit: AreaUnit) => {
    setCurrentAreaUnit(unit);
    setDefaultAreaUnit(unit);
    showToast(`Default land area unit changed to ${unit.toUpperCase()} across all modules!`);
  };

  const handleResetData = () => {
    if (
      confirm(
        'Reset FarmSync state back to the Indian Farm baseline (Kisan Agro Farm, Nashik, Maharashtra)?'
      )
    ) {
      resetToDefaults();
      showToast('Reset all records to Kisan Agro Farm (Nashik, Maharashtra) demo baseline!');
    }
  };

  const handleGenerateInvite = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const effectiveRole: UserRole = isManager ? 'worker' : inviteRole;
      const inv = createInvite({
        role: effectiveRole,
        email: inviteEmail || undefined,
        expiryDuration: inviteExpiry,
        maxUses: 1,
      });
      setLastCreatedCode(inv.code);
      showToast(`Created invite code: ${inv.code}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to create invite.');
    }
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      showToast(`Copied code "${code}" to clipboard!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#173426] px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-in fade-in border border-[#22C55E]/30">
          <Check className="h-4 w-4 text-[#22C55E]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#18251C] dark:text-white flex items-center gap-2">
          {t('nav_settings', 'Settings & Preferences')}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#67756B] dark:text-[#97A79A]">
          Manage accessibility, farm units, notifications, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Accessibility Preferences */}
        <div className="rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
          <h3 className="text-sm font-bold text-[#18251C] dark:text-white flex items-center gap-2 mb-4">
            <Type className="h-4 w-4 text-[#2E7D47] dark:text-[#4ADE80]" />
            <span>Accessibility Preferences</span>
          </h3>

          <div className="space-y-4">
            {/* Font Size Scaling */}
            <div className="pt-2 border-t border-[#F0EAE0] dark:border-[#263A2B]">
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA] flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <Type className="h-4 w-4 text-[#2E7D47]" />
                  <span>Text Size</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-[#2E7D47] dark:text-[#4ADE80]">
                  {fontSize === 'standard' ? 'Standard (100%)' : fontSize === 'large' ? 'Large (112%)' : 'Extra Large (125%)'}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFontSize('standard')}
                  className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                    fontSize === 'standard'
                      ? 'border-[#173426] bg-[#173426] text-white dark:border-[#22C55E] dark:bg-[#22C55E] dark:text-black'
                      : 'border-[#ECE6DB] bg-[#FAF8F5] text-[#526054] dark:border-[#263A2B] dark:bg-[#121D15] dark:text-[#C5D5C8]'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('large')}
                  className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                    fontSize === 'large'
                      ? 'border-[#173426] bg-[#173426] text-white dark:border-[#22C55E] dark:bg-[#22C55E] dark:text-black'
                      : 'border-[#ECE6DB] bg-[#FAF8F5] text-[#526054] dark:border-[#263A2B] dark:bg-[#121D15] dark:text-[#C5D5C8]'
                  }`}
                >
                  Large
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize('extra_large')}
                  className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                    fontSize === 'extra_large'
                      ? 'border-[#173426] bg-[#173426] text-white dark:border-[#22C55E] dark:bg-[#22C55E] dark:text-black'
                      : 'border-[#ECE6DB] bg-[#FAF8F5] text-[#526054] dark:border-[#263A2B] dark:bg-[#121D15] dark:text-[#C5D5C8]'
                  }`}
                >
                  Extra Large
                </button>
              </div>
            </div>

            {/* Simple Mode Toggle */}
            <div className="pt-2 border-t border-[#F0EAE0] dark:border-[#263A2B] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#18251C] dark:text-white flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5 text-[#2E7D47]" />
                  <span>Simple Mode Dashboard</span>
                </p>
                <p className="text-[11px] text-[#6A786E] dark:text-[#8E9F92]">
                  Six large touch-friendly buttons, simplified text, and quick access to the farmer helpline.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleSimpleMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  simpleMode ? 'bg-[#22C55E]' : 'bg-[#D1D5DB] dark:bg-[#374151]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    simpleMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Indian Land Area Units & State Variations */}
        <div className="rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
          <h3 className="text-sm font-bold text-[#18251C] dark:text-white flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-[#2E7D47] dark:text-[#4ADE80]" />
            <span>Land Area Units & Conversions</span>
          </h3>

          <div className="space-y-4">
            <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA] block">
              Default area unit for crops and records
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'acre', label: 'Acre', desc: '40 Gunthas' },
                { id: 'guntha', label: 'Guntha', desc: '1,089 sq ft' },
                { id: 'bigha', label: 'Bigha', desc: 'Regional' },
                { id: 'hectare', label: 'Hectare', desc: '2.471 Acres' },
              ].map((u) => {
                const isSelected = currentAreaUnit === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleAreaUnitChange(u.id as AreaUnit)}
                    className={`flex flex-col text-left p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-[#173426] bg-[#173426] text-white shadow-sm dark:border-[#22C55E] dark:bg-[#22C55E] dark:text-black font-bold'
                        : 'border-[#ECE6DB] bg-[#FAF8F5] text-[#3D4940] hover:border-[#2E7D47]/40 dark:border-[#263A2B] dark:bg-[#121D15] dark:text-[#C5D5C8]'
                    }`}
                  >
                    <span className="text-xs font-bold">{u.label}</span>
                    <span className="text-[10px] opacity-75">{u.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* State-Wise Bigha Conversion Advisory Card */}
            <div className="rounded-2xl border border-[#F0D59E] bg-[#FFFBF0] p-3.5 dark:border-[#4B3917] dark:bg-[#261E0E]">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-[#B45309] dark:text-[#FBBF24]" />
                <div className="text-[11px] leading-relaxed text-[#78350F] dark:text-[#FCD34D]">
                  <p className="font-bold mb-1">Regional Bigha Conversion Reference:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>1 Pakka Bigha (UP, Punjab, Haryana):</strong> approximately 0.625 acres (5 Bigha = 3.125 acres / 3,025 sq yd).
                    </li>
                    <li>
                      <strong>1 Kachha Bigha:</strong> approximately 0.208 acres (one-third of a Pakka Bigha).
                    </li>
                    <li>
                      <strong>1 Bigha (Gujarat / western Rajasthan):</strong> approximately 0.575 acres (16 Gunthas / 2,378 sq m).
                    </li>
                    <li>
                      <strong>1 Bigha (West Bengal / Assam):</strong> approximately 0.33 acres (1,333 sq m).
                    </li>
                    <li>
                      <strong>Maharashtra and Karnataka standard:</strong> 1 acre = 40 Gunthas = 43,560 sq ft.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Profile Information Card with Indian Phone Format */}
        <div className="rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
          <h3 className="text-sm font-bold text-[#18251C] dark:text-white flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-[#2E7D47]" />
            <span>Profile Information</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA] flex items-center justify-between">
                  <span>Mobile Number (10 digits)</span>
                  <span className="text-[10px] text-[#2E7D47] dark:text-[#4ADE80] font-mono">+91 India</span>
                </label>
                <div className="relative mt-1">
                  <Smartphone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#79857B]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98220 14285"
                    className="w-full rounded-xl border border-[#D5CEC0] pl-9 pr-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Farm Role
              </label>
              <input
                type="text"
                disabled
                value={`Farm ${user?.role?.toUpperCase() || 'OWNER'}`}
                className="mt-1 w-full rounded-xl border border-[#E0D9CE] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#79857B] dark:border-[#233528] dark:bg-[#111A13]"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[#173426] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black transition-colors"
            >
              {t('save')}
            </button>
          </form>
        </div>

        {/* 4. Security & Password Card */}
        <div className="rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
          <h3 className="text-sm font-bold text-[#18251C] dark:text-white flex items-center gap-2 mb-4">
            <Lock className="h-4 w-4 text-[#2E7D47]" />
            <span>Security & Password</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                New Password (minimum 8 characters)
              </label>
              <input
                type="password"
                placeholder="Min 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#D5CEC0] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[#173426] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black transition-colors"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* 5. Indian SMS & WhatsApp Alerts Preferences */}
        <div className="rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
          <h3 className="text-sm font-bold text-[#18251C] dark:text-white flex items-center gap-2 mb-4">
            <MessageSquare className="h-4 w-4 text-[#2E7D47]" />
            <span>WhatsApp & SMS Alerts</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#121D15]">
              <div>
                <span className="font-semibold text-[#18251C] dark:text-white block">
                  Daily Market Price Alerts
                </span>
                <span className="text-[11px] text-[#6A786E] dark:text-[#8E9F92]">
                  Receive onion, cotton, soybean, and wheat APMC prices every day at 10:00 AM.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifMandiWhatsApp}
                onChange={(e) => setNotifMandiWhatsApp(e.target.checked)}
                className="h-4 w-4 rounded border-[#D5CEC0] text-[#173426] focus:ring-[#22C55E]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#121D15]">
              <div>
                <span className="font-semibold text-[#18251C] dark:text-white block">
                  IMD Weather & Heavy Rain Alerts
                </span>
                <span className="text-[11px] text-[#6A786E] dark:text-[#8E9F92]">
                  Get SMS alerts for storms, hail, or heavy rain.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifWeather}
                onChange={(e) => setNotifWeather(e.target.checked)}
                className="h-4 w-4 rounded border-[#D5CEC0] text-[#173426] focus:ring-[#22C55E]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#121D15]">
              <div>
                <span className="font-semibold text-[#18251C] dark:text-white block">
                  Fertilizer & Pesticide Low Stock Alerts
                </span>
                <span className="text-[11px] text-[#6A786E] dark:text-[#8E9F92]">
                  Receive an alert when stock drops below the reorder level.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifStock}
                onChange={(e) => setNotifStock(e.target.checked)}
                className="h-4 w-4 rounded border-[#D5CEC0] text-[#173426] focus:ring-[#22C55E]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#121D15]">
              <div>
                <span className="font-semibold text-[#18251C] dark:text-white block">
                  Livestock Vaccination Reminders
                </span>
                <span className="text-[11px] text-[#6A786E] dark:text-[#8E9F92]">
                  Get reminders for upcoming FMD, HS, and brucellosis vaccinations.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifVaccination}
                onChange={(e) => setNotifVaccination(e.target.checked)}
                className="h-4 w-4 rounded border-[#D5CEC0] text-[#173426] focus:ring-[#22C55E]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-[#FAF8F5] dark:hover:bg-[#121D15]">
              <div>
                <span className="font-semibold text-[#18251C] dark:text-white block">
                  Tractor & Equipment 250-Hour Oil Service Reminder
                </span>
                <span className="text-[11px] text-[#6A786E] dark:text-[#8E9F92]">
                  Track oil, filter, and PTO service intervals for Mahindra 575 DI equipment.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifMaint}
                onChange={(e) => setNotifMaint(e.target.checked)}
                className="h-4 w-4 rounded border-[#D5CEC0] text-[#173426] focus:ring-[#22C55E]"
              />
            </label>
          </div>
        </div>

        {/* 6. Theme & Display */}
        <div className="rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
          <h3 className="text-sm font-bold text-[#18251C] dark:text-white flex items-center gap-2 mb-4">
            <Palette className="h-4 w-4 text-[#2E7D47]" />
            <span>Theme & Display</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-xs font-bold transition-all ${
                theme === 'light'
                  ? 'border-[#173426] bg-[#FAF8F4] text-[#173426] shadow-sm'
                  : 'border-[#ECE6DB] text-[#79857B]'
              }`}
            >
              <span>☀️ Light Warm Parchment</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center gap-2 rounded-2xl border p-3.5 text-xs font-bold transition-all ${
                theme === 'dark'
                  ? 'border-[#22C55E] bg-[#1C2E21] text-[#22C55E] shadow-sm'
                  : 'border-[#ECE6DB] text-[#79857B]'
              }`}
            >
              <span>🌙 Dark Night Agronomy</span>
            </button>
          </div>
        </div>

        {/* 7. Invite Users & Farm Access Section */}
        {canInvite && (
          <div className="rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-sm dark:border-[#233528] dark:bg-[#152219] lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#F0EAE0] pb-4 dark:border-[#263A2B]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173426]/10 text-[#173426] dark:bg-[#22C55E]/10 dark:text-[#4ADE80]">
                  <Ticket className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#18251C] dark:text-white">
                    Farm Member Invites
                  </h3>
                  <p className="text-xs text-[#6A786E] dark:text-[#8E9F92]">
                    {isOwner
                      ? 'As the owner, you can create invite codes for managers and workers.'
                      : 'As a manager, you can create invite codes for workers only.'}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleGenerateInvite} className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Target Role
                </label>
                {isManager ? (
                  <div className="mt-1 rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#526054] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-[#A7B8AA]">
                    Worker
                  </div>
                ) : (
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                    className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                  >
                    <option value="worker">Worker</option>
                    <option value="manager">Manager</option>
                    <option value="owner">Owner</option>
                  </select>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Expiry Duration
                </label>
                <select
                  value={inviteExpiry}
                  onChange={(e) => setInviteExpiry(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                >
                  <option value="24h">24 hours</option>
                  <option value="7d">7 days</option>
                  <option value="30d">30 days</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Email Address (optional)
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@farmsync.io"
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#18251C] dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-[#173426] py-2.5 px-4 text-xs font-bold text-white shadow hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black transition-colors"
              >
                Generate Invite Code
              </button>
            </form>

            {lastCreatedCode && (
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#173426]/20 bg-[#173426]/5 p-3.5 dark:border-[#22C55E]/30 dark:bg-[#22C55E]/10 animate-in fade-in">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#79857B]">
                    Latest Code
                  </span>
                  <p className="font-mono text-base font-black tracking-widest text-[#173426] dark:text-[#4ADE80]">
                    {lastCreatedCode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(lastCreatedCode)}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-[#173426] shadow-sm hover:bg-[#FAF8F5] dark:bg-[#152219] dark:text-[#4ADE80]"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>
            )}

            {/* Invites Table */}
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#ECE6DB] dark:border-[#233528]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#ECE6DB] bg-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider text-[#6A786E] dark:border-[#233528] dark:bg-[#121D15] dark:text-[#8E9F92]">
                  <tr>
                    <th className="px-4 py-2.5">Code</th>
                    <th className="px-4 py-2.5">Role</th>
                    <th className="px-4 py-2.5">Expires</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECE6DB] dark:divide-[#233528]">
                  {invites.slice(0, 5).map((inv) => {
                    const isExpired = new Date(inv.expiresAt).getTime() <= Date.now();
                    const status = inv.status === 'active' && isExpired ? 'expired' : inv.status;
                    return (
                      <tr key={inv.id} className="hover:bg-[#FAF8F5]/80 dark:hover:bg-[#121D15]/50">
                        <td className="px-4 py-2.5 font-mono font-bold text-[#173426] dark:text-[#4ADE80]">
                          {inv.code}
                        </td>
                        <td className="px-4 py-2.5 capitalize">{inv.role}</td>
                        <td className="px-4 py-2.5 text-[#556358] dark:text-[#9FB1A2]">
                          {new Date(inv.expiresAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              status === 'active'
                                ? 'bg-[#E7F6ED] text-[#1D7A40] dark:bg-[#1E3B27] dark:text-[#4ADE80]'
                                : 'bg-[#F3EFE7] text-[#556358]'
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleCopyCode(inv.code)}
                              className="rounded p-1 text-[#79857B] hover:text-[#18251C] dark:hover:text-white"
                              title="Copy Code"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            {status === 'active' && (
                              <button
                                onClick={() => {
                                  revokeInvite(inv.id);
                                  showToast(`Revoked code ${inv.code}`);
                                }}
                                className="rounded px-2 py-0.5 text-[10px] font-semibold text-[#DC2626] hover:bg-[#FEF2F2] dark:hover:bg-[#2B1717]"
                              >
                                Revoke
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Demo Data Reset Card */}
      <div className="rounded-3xl border border-[#FCD8CF] bg-[#FEF6F4] p-6 dark:border-[#522923] dark:bg-[#2A1613]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#DE5B50] flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>Reset Farm Data to Demo Baseline</span>
            </h3>
            <p className="mt-1 text-xs text-[#874A41] dark:text-[#E2A69E]">
              Restores the demo Kisan Agro Farm in Nashik, Maharashtra, including sample crops, livestock, and market prices.
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="rounded-xl border border-[#DE5B50] bg-white px-4 py-2 text-xs font-bold text-[#DE5B50] hover:bg-[#FEECEC] dark:bg-[#3B1E19] transition-colors"
          >
            Reset to Indian Baseline
          </button>
        </div>
      </div>
    </div>
  );
}
