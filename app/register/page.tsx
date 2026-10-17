'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Hexagon,
  Lock,
  Mail,
  User,
  Phone,
  Building2,
  MapPin,
  Ticket,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Crown,
  Briefcase,
  Tractor,
  ShieldCheck,
  Sprout,
  Check,
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { useFarmStore } from '@/hooks/useFarmStore';
import { LanguageSwitcher } from '@/components/language-switcher';
import { UserRole } from '@/types';
import { calculatePasswordStrength, passwordRegex } from '@/lib/validators';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { validateInviteCode } = useFarmStore();

  // Form states
  const [role, setRole] = useState<UserRole>('owner');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Role-specific fields
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  // Invite code validation state
  const [codeVerification, setCodeVerification] = useState<{
    tested: boolean;
    valid: boolean;
    message: string;
    farmName?: string;
  } | null>(null);

  // Submission & error states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Password strength
  const strength = calculatePasswordStrength(password);

  // Validate invite code on blur or explicit check
  const handleCheckInviteCode = (codeToCheck: string) => {
    if (!codeToCheck.trim()) {
      setCodeVerification(null);
      return;
    }
    const res = validateInviteCode(codeToCheck, role);
    setCodeVerification({
      tested: true,
      valid: res.valid,
      message: res.message,
      farmName: res.invite?.farmName,
    });
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMessage('');
    setFieldErrors({});
    if (inviteCode) {
      handleCheckInviteCode(inviteCode);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters.';
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (phone.trim()) {
      const cleanPhone = phone.replace(/[\s-+]/g, '');
      if (cleanPhone.length < 10) {
        errors.phone = 'Enter a valid 10-digit mobile number (+91 98XXX XXXXX).';
      }
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    } else if (!passwordRegex.test(password)) {
      errors.password = 'Password must contain both letters and numbers.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (role === 'owner') {
      if (!farmName.trim() || farmName.trim().length < 2) {
        errors.farmName = 'Farm name is required (at least 2 characters).';
      }
    } else {
      if (!inviteCode.trim()) {
        errors.inviteCode = `A Farm Invite Code is required to join as a ${role.toUpperCase()}.`;
      }
    }

    if (!termsAccepted) {
      errors.termsAccepted = 'You must agree to the Terms of Service to register.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        fullName,
        email,
        phone,
        password,
        role,
        farmName: role === 'owner' ? farmName : undefined,
        farmLocation: role === 'owner' ? farmLocation : undefined,
        inviteCode: role !== 'owner' ? inviteCode.trim().toUpperCase() : undefined,
      });

      if (!res.success) {
        setErrorMessage(res.message || 'Registration failed. Please review your information.');
        setLoading(false);
        return;
      }

      // Successful registration redirect to login with confirmation
      router.push('/login?registered=true');
    } catch {
      setErrorMessage('A connection error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FBF9F5] text-[#18251C] dark:bg-[#0E1712] dark:text-[#EAF2EC]">
      {/* Split Layout: Left Hero Image Side (Desktop >= 1024px) */}
      <div className="relative hidden w-5/12 flex-col justify-between overflow-hidden bg-[#173426] p-10 text-white lg:flex xl:w-1/2">
        {/* Background Image with Dark Green Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
            alt="FarmSync Agricultural Field"
            fill
            priority
            className="object-cover opacity-35 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A11] via-[#173426]/80 to-transparent" />
        </div>

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#22C55E]/20 text-[#22C55E] backdrop-blur-md border border-[#22C55E]/30">
            <Hexagon className="h-7 w-7 stroke-[2.2] fill-[#22C55E]/30" />
            <span className="absolute text-[11px] font-black text-white">FS</span>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white">
              Farm<span className="text-[#22C55E]">Sync</span>
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#9EC7A9]">
              Enterprise Smart Agriculture
            </span>
          </div>
        </div>

        {/* Middle Feature Cards */}
        <div className="relative z-10 my-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md text-[#A8F0C0]">
            <Sprout className="h-4 w-4 text-[#22C55E]" />
            <span>Next-Gen Agricultural Intelligence</span>
          </div>

          <h2 className="text-3xl font-black leading-tight xl:text-4xl">
            Real-time farm operations, simplified from seed to harvest.
          </h2>

          <p className="text-sm text-[#CADFD0] leading-relaxed max-w-md">
            Seamlessly monitor soil IoT meshes, crop cycles, cattle health, inventory stock levels,
            and worker field schedules with role-enforced access control.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-2xl font-black text-[#22C55E]">450+ Ac</p>
              <p className="text-xs text-[#CADFD0] mt-0.5">Automated Telemetry</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <p className="text-2xl font-black text-[#22C55E]">99.8%</p>
              <p className="text-xs text-[#CADFD0] mt-0.5">Uptime & Realtime Sync</p>
            </div>
          </div>
        </div>

        {/* Bottom Security Badge */}
        <div className="relative z-10 flex items-center gap-3 border-t border-white/15 pt-6 text-xs text-[#A1BFA8]">
          <ShieldCheck className="h-5 w-5 text-[#22C55E] flex-shrink-0" />
          <span>
            Encrypted with Supabase Row Level Security & strict cryptographic invitation validation.
          </span>
        </div>
      </div>

      {/* Split Layout: Right Form Side */}
      <div className="flex w-full flex-1 flex-col justify-center overflow-y-auto px-4 py-10 sm:px-8 lg:w-7/12 lg:px-12 xl:w-1/2">
        <div className="mx-auto w-full max-w-xl">
          {/* Top Row with Language Switcher */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 lg:hidden">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#173426] text-[#22C55E] dark:bg-[#1C3D26]">
                <Hexagon className="h-6 w-6 stroke-[2.2] fill-[#173426]/50" />
                <span className="absolute text-[10px] font-bold text-white">FS</span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-[#18251C] dark:text-white">
                Farm<span className="text-[#22C55E]">Sync</span>
              </h1>
            </div>
            <div className="ml-auto">
              <LanguageSwitcher variant="pill" />
            </div>
          </div>

          {/* Form Header */}
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#18251C] dark:text-white sm:text-3xl">
              Create Account
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#66746A] dark:text-[#9DAEA1]">
              Choose your farm role: Owner, Manager, or Worker.
            </p>
          </div>

          {/* Global Alert */}
          {errorMessage && (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#F87171]/20 bg-[#FEF2F2] p-3.5 text-xs font-semibold text-[#DC2626] dark:bg-[#2B1717] dark:text-[#F87171] animate-in fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-[#DC2626]" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5" autoComplete="off">
            {/* 1. ROLE SELECTOR (3 Interactive Cards) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#4E5C52] dark:text-[#A7B8AA]">
                1. Select Your Role *
              </label>

              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Role Option: Owner */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('owner')}
                  className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all ${
                    role === 'owner'
                      ? 'border-[#173426] bg-[#173426]/5 ring-2 ring-[#173426] dark:border-[#22C55E] dark:bg-[#22C55E]/10 dark:ring-[#22C55E]'
                      : 'border-[#E0D9CD] bg-white hover:border-[#173426]/40 dark:border-[#263A2B] dark:bg-[#162319]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        role === 'owner'
                          ? 'bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black'
                          : 'bg-[#F0EAE0] text-[#4E5C52] dark:bg-[#1E2E22] dark:text-[#A7B8AA]'
                      }`}
                    >
                      <Crown className="h-4 w-4" />
                    </div>
                    {role === 'owner' && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="mt-2 text-xs font-bold text-[#18251C] dark:text-white">
                    Owner
                  </span>
                  <span className="mt-1 text-[11px] text-[#6A786E] dark:text-[#8E9F92] leading-tight">
                    Create a new farm with full operational control.
                  </span>
                </button>

                {/* Role Option: Manager */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('manager')}
                  className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all ${
                    role === 'manager'
                      ? 'border-[#173426] bg-[#173426]/5 ring-2 ring-[#173426] dark:border-[#22C55E] dark:bg-[#22C55E]/10 dark:ring-[#22C55E]'
                      : 'border-[#E0D9CD] bg-white hover:border-[#173426]/40 dark:border-[#263A2B] dark:bg-[#162319]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        role === 'manager'
                          ? 'bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black'
                          : 'bg-[#F0EAE0] text-[#4E5C52] dark:bg-[#1E2E22] dark:text-[#A7B8AA]'
                      }`}
                    >
                      <Briefcase className="h-4 w-4" />
                    </div>
                    {role === 'manager' && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="mt-2 text-xs font-bold text-[#18251C] dark:text-white">
                    Manager
                  </span>
                  <span className="mt-1 text-[11px] text-[#6A786E] dark:text-[#8E9F92] leading-tight">
                    Manage crops, livestock, inventory, and staff tasks.
                  </span>
                </button>

                {/* Role Option: Worker */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('worker')}
                  className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all ${
                    role === 'worker'
                      ? 'border-[#173426] bg-[#173426]/5 ring-2 ring-[#173426] dark:border-[#22C55E] dark:bg-[#22C55E]/10 dark:ring-[#22C55E]'
                      : 'border-[#E0D9CD] bg-white hover:border-[#173426]/40 dark:border-[#263A2B] dark:bg-[#162319]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        role === 'worker'
                          ? 'bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black'
                          : 'bg-[#F0EAE0] text-[#4E5C52] dark:bg-[#1E2E22] dark:text-[#A7B8AA]'
                      }`}
                    >
                      <Tractor className="h-4 w-4" />
                    </div>
                    {role === 'worker' && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#173426] text-white dark:bg-[#22C55E] dark:text-black">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="mt-2 text-xs font-bold text-[#18251C] dark:text-white">
                    Worker
                  </span>
                  <span className="mt-1 text-[11px] text-[#6A786E] dark:text-[#8E9F92] leading-tight">
                    View field assignments, log tasks, and record attendance.
                  </span>
                </button>
              </div>
            </div>

            {/* 2. DYNAMIC ROLE-SPECIFIC FIELDS */}
            <div className="rounded-2xl border border-[#ECE6DB] bg-white p-4.5 shadow-xs dark:border-[#233528] dark:bg-[#152219]">
              {role === 'owner' ? (
                /* OWNER FLOW: Create New Farm */
                <div className="space-y-3.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#173426] dark:text-[#4ADE80]">
                    <Building2 className="h-4 w-4" />
                    <span>Farm Setup Information</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Farm / Organization Name *
                    </label>
                    <div className="relative mt-1">
                      <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-[#79857B]" />
                      <input
                        type="text"
                        required
                        value={farmName}
                        onChange={(e) => {
                          setFarmName(e.target.value);
                          if (fieldErrors.farmName) {
                            const updated = { ...fieldErrors };
                            delete updated.farmName;
                            setFieldErrors(updated);
                          }
                        }}
                        placeholder="e.g. Kisan Agro Farm"
                        className={`w-full rounded-xl border bg-[#FAF8F5] py-2.5 pl-10 pr-3.5 text-xs text-[#18251C] focus:bg-white focus:outline-none dark:bg-[#121D15] dark:text-white ${
                          fieldErrors.farmName
                            ? 'border-[#EF4444]'
                            : 'border-[#D5CEC0] focus:border-[#173426] dark:border-[#2C3F2E] dark:focus:border-[#22C55E]'
                        }`}
                      />
                    </div>
                    {fieldErrors.farmName && (
                      <p className="mt-1 text-[11px] font-semibold text-[#EF4444]">
                        {fieldErrors.farmName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                      Farm Location / Village
                    </label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-[#79857B]" />
                      <input
                        type="text"
                        value={farmLocation}
                        onChange={(e) => setFarmLocation(e.target.value)}
                        placeholder="e.g. Pimpalgaon Baswant, Nashik, Maharashtra"
                        className="w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] py-2.5 pl-10 pr-3.5 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-[#6A786E] dark:text-[#8E9F92]">
                    💡 As Farm Owner, you will create a new workspace and can later invite managers
                    and field staff using invitation codes.
                  </p>
                </div>
              ) : (
                /* MANAGER OR WORKER FLOW: Requires Farm Invite Code */
                <div className="space-y-3.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#173426] dark:text-[#4ADE80]">
                    <Ticket className="h-4 w-4" />
                    <span>Farm Invitation Verification</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                        Farm Invite Code *
                      </label>
                      <span className="text-[10px] text-[#79857B]">
                        Format: KISAN-MGR-2026 or KISAN-WRK-XXXX
                      </span>
                    </div>

                    <div className="relative mt-1 flex gap-2">
                      <div className="relative flex-1">
                        <Ticket className="absolute left-3.5 top-3 h-4 w-4 text-[#79857B]" />
                        <input
                          type="text"
                          required
                          value={inviteCode}
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase();
                            setInviteCode(val);
                            if (fieldErrors.inviteCode) {
                              const updated = { ...fieldErrors };
                              delete updated.inviteCode;
                              setFieldErrors(updated);
                            }
                            if (codeVerification) setCodeVerification(null);
                          }}
                          onBlur={() => handleCheckInviteCode(inviteCode)}
                          placeholder={
                            role === 'manager' ? 'e.g. KISAN-MGR-2026' : 'e.g. KISAN-WRK-2026'
                          }
                          className={`w-full rounded-xl border bg-[#FAF8F5] py-2.5 pl-10 pr-3.5 text-xs font-mono font-bold tracking-wider uppercase text-[#18251C] focus:bg-white focus:outline-none dark:bg-[#121D15] dark:text-white ${
                            fieldErrors.inviteCode
                              ? 'border-[#EF4444]'
                              : 'border-[#D5CEC0] focus:border-[#173426] dark:border-[#2C3F2E] dark:focus:border-[#22C55E]'
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCheckInviteCode(inviteCode)}
                        className="rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3 py-2 text-xs font-semibold text-[#3D4940] hover:bg-[#EFE9DD] dark:border-[#2C3F2E] dark:bg-[#1A281E] dark:text-white"
                      >
                        Verify
                      </button>
                    </div>

                    {fieldErrors.inviteCode && (
                      <p className="mt-1 text-[11px] font-semibold text-[#EF4444]">
                        {fieldErrors.inviteCode}
                      </p>
                    )}

                    {/* Verification Result Badge */}
                    {codeVerification && (
                      <div
                        className={`mt-2 flex items-start gap-2 rounded-xl p-2.5 text-xs font-medium animate-in fade-in ${
                          codeVerification.valid
                            ? 'bg-[#EAF6ED] text-[#1B6F36] dark:bg-[#153120] dark:text-[#4ADE80]'
                            : 'bg-[#FDF2F2] text-[#DC2626] dark:bg-[#341616] dark:text-[#F87171]'
                        }`}
                      >
                        {codeVerification.valid ? (
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-[#1B6F36] dark:text-[#4ADE80]" />
                        ) : (
                          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-[#DC2626] dark:text-[#F87171]" />
                        )}
                        <div>
                          <p className="font-bold">{codeVerification.message}</p>
                          {codeVerification.valid && codeVerification.farmName && (
                            <p className="text-[11px] opacity-90">
                              Joining workspace: {codeVerification.farmName}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. PERSONAL DETAILS */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Full Name *
                  </label>
                  <div className="relative mt-1">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-[#79857B]" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (fieldErrors.fullName) {
                          const updated = { ...fieldErrors };
                          delete updated.fullName;
                          setFieldErrors(updated);
                        }
                      }}
                      placeholder="e.g. Rajesh Patil"
                      className={`w-full rounded-xl border bg-[#FAF8F5] py-2.5 pl-10 pr-3.5 text-xs text-[#18251C] focus:bg-white focus:outline-none dark:bg-[#121D15] dark:text-white ${
                        fieldErrors.fullName
                          ? 'border-[#EF4444]'
                          : 'border-[#D5CEC0] focus:border-[#173426] dark:border-[#2C3F2E] dark:focus:border-[#22C55E]'
                      }`}
                    />
                  </div>
                  {fieldErrors.fullName && (
                    <p className="mt-1 text-[11px] font-semibold text-[#EF4444]">
                      {fieldErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA] flex items-center justify-between">
                    <span>Mobile Number</span>
                    <span className="text-[10px] text-[#2E7D47] dark:text-[#4ADE80] font-mono">+91 India</span>
                  </label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-[#79857B]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98220 14285"
                      className="w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] py-2.5 pl-10 pr-3.5 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white font-mono"
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="mt-1 text-[11px] font-semibold text-[#EF4444]">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  Email Address *
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#79857B]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) {
                        const updated = { ...fieldErrors };
                        delete updated.email;
                        setFieldErrors(updated);
                      }
                    }}
                    placeholder="you@farmsync.io"
                    className={`w-full rounded-xl border bg-[#FAF8F5] py-2.5 pl-10 pr-3.5 text-xs text-[#18251C] focus:bg-white focus:outline-none dark:bg-[#121D15] dark:text-white ${
                      fieldErrors.email
                        ? 'border-[#EF4444]'
                        : 'border-[#D5CEC0] focus:border-[#173426] dark:border-[#2C3F2E] dark:focus:border-[#22C55E]'
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] font-semibold text-[#EF4444]">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password & Confirm with strength indicator and show/hide toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Password *
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#79857B]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) {
                          const updated = { ...fieldErrors };
                          delete updated.password;
                          setFieldErrors(updated);
                        }
                      }}
                      placeholder="Min 8 chars, letters & numbers"
                      className={`w-full rounded-xl border bg-[#FAF8F5] py-2.5 pl-10 pr-10 text-xs text-[#18251C] focus:bg-white focus:outline-none dark:bg-[#121D15] dark:text-white ${
                        fieldErrors.password
                          ? 'border-[#EF4444]'
                          : 'border-[#D5CEC0] focus:border-[#173426] dark:border-[#2C3F2E] dark:focus:border-[#22C55E]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-3 text-[#79857B] hover:text-[#18251C] dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-[11px] font-semibold text-[#EF4444]">
                      {fieldErrors.password}
                    </p>
                  )}

                  {/* Password Strength Meter */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex h-1.5 gap-1">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className="h-full flex-1 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor:
                                step <= strength.score ? strength.color : '#E5E7EB',
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#79857B]">Strength:</span>
                        <span className="font-bold" style={{ color: strength.color }}>
                          {strength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                    Confirm Password *
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#79857B]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (fieldErrors.confirmPassword) {
                          const updated = { ...fieldErrors };
                          delete updated.confirmPassword;
                          setFieldErrors(updated);
                        }
                      }}
                      placeholder="Repeat password"
                      className={`w-full rounded-xl border bg-[#FAF8F5] py-2.5 pl-10 pr-10 text-xs text-[#18251C] focus:bg-white focus:outline-none dark:bg-[#121D15] dark:text-white ${
                        fieldErrors.confirmPassword
                          ? 'border-[#EF4444]'
                          : 'border-[#D5CEC0] focus:border-[#173426] dark:border-[#2C3F2E] dark:focus:border-[#22C55E]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-3 text-[#79857B] hover:text-[#18251C] dark:hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-[11px] font-semibold text-[#EF4444]">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 4. TERMS CHECKBOX */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (fieldErrors.termsAccepted) {
                      const updated = { ...fieldErrors };
                      delete updated.termsAccepted;
                      setFieldErrors(updated);
                    }
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-[#D5CEC0] text-[#173426] focus:ring-[#173426] dark:border-[#2C3F2E] dark:bg-[#121D15]"
                />
                <span className="text-xs text-[#526054] dark:text-[#A7B8AA] leading-normal">
                  I agree to FarmSync’s{' '}
                  <span className="font-semibold text-[#173426] underline dark:text-[#4ADE80]">
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className="font-semibold text-[#173426] underline dark:text-[#4ADE80]">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>
              {fieldErrors.termsAccepted && (
                <p className="mt-1 text-[11px] font-semibold text-[#EF4444]">
                  {fieldErrors.termsAccepted}
                </p>
              )}
            </div>

            {/* 5. SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173426] py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#204533] disabled:opacity-60 transition-all dark:bg-[#22C55E] dark:text-black dark:hover:bg-[#16A34A]"
            >
              <span>
                {loading
                  ? 'Configuring Your Account...'
                  : role === 'owner'
                  ? 'Create Farm & Owner Account'
                  : `Join Farm as ${role.toUpperCase()}`}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* FOOTER LINK TO LOGIN */}
          <div className="mt-8 border-t border-[#ECE6DB] pt-5 text-center dark:border-[#233528]">
            <p className="text-xs text-[#6A786E] dark:text-[#8E9F92]">
              Already have a FarmSync account?{' '}
              <Link
                href="/login"
                className="font-bold text-[#173426] hover:underline dark:text-[#4ADE80]"
              >
                Sign In to Your Farm
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
