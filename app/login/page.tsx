'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Hexagon,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Check,
  Smartphone,
  Play,
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { useTranslation } from '@/components/i18n-provider';
import { LanguageSwitcher } from '@/components/language-switcher';
import { calculatePasswordStrength, passwordRegex } from '@/lib/validators';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, completePasswordChange } = useAuth();
  const { t } = useTranslation();

  // Clean empty state - NO prefilled or demo values
  const [identifier, setIdentifier] = useState(''); // email or 10-digit mobile
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // First-login password change modal
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  useEffect(() => {
    if (searchParams.get('logged_out') === 'true') {
      setToastMsg(t('auth.signed_out'));
      const timer = setTimeout(() => setToastMsg(''), 5000);
      return () => clearTimeout(timer);
    }
    if (searchParams.get('registered') === 'true') {
      setToastMsg(t('auth.registered'));
      const timer = setTimeout(() => setToastMsg(''), 6000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password) {
      setErrorMessage(t('auth.credentials_required'));
      return;
    }

    setLoading(true);
    try {
      const res = await login(identifier, password);

      if (!res.success) {
        setErrorMessage(res.message || t('auth.invalid_credentials'));
        setLoading(false);
        return;
      }

      if (res.user?.mustChangePassword) {
        setShowPasswordChangeModal(true);
        setLoading(false);
        return;
      }

      router.push('/');
    } catch {
      setErrorMessage(t('auth.connection_error'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');

    if (newPassword.length < 8 || !passwordRegex.test(newPassword)) {
      setPasswordChangeError(t('auth.password_requirements'));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError(t('auth.password_mismatch'));
      return;
    }

    completePasswordChange();
    setShowPasswordChangeModal(false);
    router.push('/');
  };

  const handleReplayIntro = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('farmsync-intro-seen');
      localStorage.removeItem('farmsync-intro-seen');
      router.push('/?replay=true');
    }
  };

  const newStrength = calculatePasswordStrength(newPassword);
  const getStrengthLabel = (label: typeof newStrength.label) => {
    switch (label) {
      case 'Very Weak':
        return t('auth.password_strength_very_weak');
      case 'Weak':
        return t('auth.password_strength_weak');
      case 'Fair':
        return t('auth.password_strength_fair');
      case 'Good':
        return t('auth.password_strength_good');
      case 'Strong':
        return t('auth.password_strength_strong');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#FBF9F5] p-4 py-12 dark:bg-[#0E1712]">
      {/* Top Bar Switcher */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <LanguageSwitcher variant="pill" />
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 z-50 flex items-center gap-2 rounded-2xl bg-[#173426] px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-4 border border-[#22C55E]/20">
          <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex h-13 w-13 items-center justify-center rounded-2xl bg-[#173426] text-[#22C55E] shadow-md dark:bg-[#1C3D26]">
            <Hexagon className="h-9 w-9 stroke-[2.2] fill-[#173426]/50" />
            <span className="absolute text-xs font-bold text-white tracking-wide">FS</span>
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-[#18251C] dark:text-white">
            Farm<span className="text-[#22C55E]">Sync</span>
          </h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#79857B] dark:text-[#8E9F92]">
            {t('app_tagline', 'Smart farm management for Indian farmers')}
          </p>
          <p className="mt-2 text-xs text-[#526054] dark:text-[#A7B8AA] max-w-sm">
            {t('auth.login_description')}
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-6 rounded-3xl border border-[#ECE6DB] bg-white p-6 sm:p-8 shadow-sm dark:border-[#233528] dark:bg-[#152219]">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#F87171]/20 bg-[#FEF2F2] p-3 text-xs font-semibold text-[#DC2626] dark:bg-[#2B1717] dark:text-[#F87171] animate-in fade-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-[#DC2626] dark:text-[#F87171]" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Email or Phone Address */}
            <div>
              <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA] flex items-center justify-between">
                <span>{t('auth.email_or_mobile')}</span>
                <span className="text-[10px] text-[#2E7D47] dark:text-[#4ADE80] font-mono">+91 {t('auth.india')}</span>
              </label>
              <div className="relative mt-1">
                <div className="absolute left-3.5 top-3 flex items-center pointer-events-none">
                  {identifier.match(/^\d+$/) ? (
                    <Smartphone className="h-4 w-4 text-[#79857B]" />
                  ) : (
                    <Mail className="h-4 w-4 text-[#79857B]" />
                  )}
                </div>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={t('auth.identifier_placeholder')}
                  className="w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] py-2.5 pl-10 pr-3.5 text-xs text-[#18251C] placeholder-[#9CA3AF] transition-colors focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white dark:placeholder-[#64748B]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  {t('auth.password')}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-semibold text-[#2E7D47] hover:underline dark:text-[#4ADE80]"
                >
                  {t('auth.forgot_password')}
                </Link>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#79857B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="off"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] py-2.5 pl-10 pr-10 text-xs text-[#18251C] placeholder-[#9CA3AF] transition-colors focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white dark:placeholder-[#64748B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t('auth.hide_password') : t('auth.show_password')}
                  className="absolute right-3.5 top-3 text-[#79857B] hover:text-[#18251C] dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[#D5CEC0] text-[#173426] focus:ring-[#173426] dark:border-[#2C3F2E] dark:bg-[#121D15]"
                />
                <span className="text-xs text-[#526054] dark:text-[#A7B8AA]">
                  {t('auth.remember_me')}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#173426] py-3 text-xs font-bold text-white shadow-md hover:bg-[#204533] disabled:opacity-60 transition-all dark:bg-[#22C55E] dark:text-black dark:hover:bg-[#16A34A]"
            >
              <span>{loading ? t('auth.checking') : t('auth.sign_in')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Bottom Replay Intro & Support */}
          <div className="mt-6 flex items-center justify-between border-t border-[#F0EAE0] pt-4 text-xs text-[#6A786E] dark:border-[#233528] dark:text-[#8E9F92]">
            <button
              type="button"
              onClick={handleReplayIntro}
              className="inline-flex items-center gap-1.5 font-semibold text-[#2E7D47] hover:underline dark:text-[#4ADE80]"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>{t('auth.replay_intro')}</span>
            </button>
            <a
              href="mailto:support@farmsync.io"
              className="font-semibold text-[#173426] hover:underline dark:text-[#4ADE80]"
            >
              {t('auth.help_support')}
            </a>
          </div>
        </div>

        {/* Footer Navigation: Create Account Link */}
        <div className="mt-6 rounded-2xl border border-[#ECE6DB] bg-white/70 p-4 text-center shadow-xs dark:border-[#233528] dark:bg-[#152219]/70 backdrop-blur-xs">
          <p className="text-xs text-[#526054] dark:text-[#A7B8AA]">
            {t('auth.new_to_farmsync')}
          </p>
          <Link
            href="/register"
            className="mt-1.5 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#173426] hover:underline dark:text-[#4ADE80]"
          >
            <span>{t('auth.create_account_or_join')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Modal: First-Time Password Change Required */}
      {showPasswordChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-2xl dark:border-[#233528] dark:bg-[#152219]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF7E6] text-[#D97706] dark:bg-[#38260E] dark:text-[#FBBF24]">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#18251C] dark:text-white">
                  {t('auth.password_change_required')}
                </h3>
                <p className="text-xs text-[#6A786E] dark:text-[#8E9F92]">
                  {t('auth.temporary_password_info')}
                </p>
              </div>
            </div>

            {passwordChangeError && (
              <div className="mt-4 rounded-xl bg-[#FEF2F2] p-2.5 text-xs font-semibold text-[#DC2626] dark:bg-[#2B1717] dark:text-[#F87171]">
                {passwordChangeError}
              </div>
            )}

            <form onSubmit={handlePasswordChangeSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  {t('auth.new_password')}
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('auth.new_password_placeholder')}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
                {newPassword && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex h-1.5 flex-1 gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className="h-full flex-1 rounded-full transition-all"
                          style={{
                            backgroundColor:
                              step <= newStrength.score ? newStrength.color : '#E5E7EB',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: newStrength.color }}>
                      {getStrengthLabel(newStrength.label)}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-[#3D4940] dark:text-[#A7B8AA]">
                  {t('auth.confirm_new_password')}
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder={t('auth.repeat_new_password')}
                  className="mt-1 w-full rounded-xl border border-[#D5CEC0] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#18251C] focus:border-[#173426] focus:bg-white focus:outline-none dark:border-[#2C3F2E] dark:bg-[#121D15] dark:text-white"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#173426] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#204533] dark:bg-[#22C55E] dark:text-black transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>{t('auth.update_password_continue')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF9F5] dark:bg-[#0E1712]" />}>
      <LoginForm />
    </Suspense>
  );
}
