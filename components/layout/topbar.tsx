'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Sun,
  Moon,
  Bell,
  Plus,
  ChevronDown,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Syringe,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/components/auth-provider';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useSidebar } from './sidebar-context';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

import { useTranslation } from '@/components/i18n-provider';
import { LanguageSwitcher } from '@/components/language-switcher';
import {
  Mic,
  MicOff,
  Sparkles,
} from 'lucide-react';

interface TopbarProps {
  onMenuToggle?: () => void;
  onOpenQuickRecord: () => void;
  onOpenSearch: () => void;
}

export function Topbar({ onMenuToggle, onOpenQuickRecord, onOpenSearch }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, switchRole, setIsLogoutModalOpen } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, farm } =
    useFarmStore();
  const { state, toggleSidebar, isMobileOpen } = useSidebar();
  const { t, simpleMode, toggleSimpleMode, startVoiceInput, isListening } = useTranslation();

  const isCollapsed = state === 'collapsed';

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleVoiceSearch = () => {
    const started = startVoiceInput((transcript) => {
      onOpenSearch();
    });
    if (!started) {
      onOpenSearch();
    }
  };

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4 text-[#DE5B50]" />;
      case 'maintenance_due':
        return <Wrench className="h-4 w-4 text-[#F59E0B]" />;
      case 'vaccination_due':
        return <Syringe className="h-4 w-4 text-[#10B981]" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-[#2E7D47]" />;
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-[#ECE6DB] bg-[#FBF9F5]/90 px-4 py-3 backdrop-blur-md transition-all duration-300 ease-in-out dark:border-[#233528] dark:bg-[#0F1712]/90 sm:px-6',
        isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
      )}
    >
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Sidebar Toggle Button (Always visible on desktop and mobile) */}
        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? t('show_sidebar') : t('hide_sidebar')}
          aria-expanded={!isCollapsed}
          title={isCollapsed ? t('show_sidebar') : t('hide_sidebar')}
          className="flex h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#E3DCCE] bg-white/80 text-[#445047] shadow-sm transition-all hover:border-[#173426] hover:bg-white hover:text-[#18251C] focus:outline-none focus:ring-2 focus:ring-[#173426] dark:border-[#263A2B] dark:bg-[#162319] dark:text-[#A1B2A5] dark:hover:border-[#22C55E] dark:hover:bg-[#1F3024] dark:hover:text-white dark:focus:ring-[#22C55E]"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          ) : (
            <PanelLeftClose className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          )}
        </button>

        {/* Search Bar pill + Voice Search */}
        <div className="relative flex items-center">
          <button
            onClick={onOpenSearch}
            className="group flex h-10 w-52 sm:w-72 md:w-80 lg:w-96 items-center justify-between rounded-full border border-[#E3DCCE] bg-white/80 pl-3.5 pr-10 text-xs text-[#79857B] shadow-sm transition-all hover:border-[#173426] dark:border-[#263A2B] dark:bg-[#162319] dark:text-[#8E9F92]"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Search className="h-4 w-4 flex-shrink-0 text-[#79857B] group-hover:text-[#18251C] dark:text-[#8E9F92] dark:group-hover:text-white" />
              <span className="truncate">{t('search_placeholder')}</span>
            </div>
            <kbd className="hidden rounded bg-[#F3EFE7] px-1.5 py-0.5 text-[10px] font-semibold text-[#546256] dark:bg-[#1E2E22] dark:text-[#A0B0A3] sm:inline-block">
              Ctrl+K
            </kbd>
          </button>

          {/* Web Speech Voice Search Mic Button */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            aria-label={t('voice_search')}
            title={t('voice_search')}
            className={cn(
              'absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-full transition-all',
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-md ring-2 ring-red-400'
                : 'text-[#79857B] hover:bg-[#F3EFE7] hover:text-[#173426] dark:text-[#8E9F92] dark:hover:bg-[#1F3024] dark:hover:text-[#22C55E]'
            )}
          >
            {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Simple Mode Toggle */}
        <button
          onClick={toggleSimpleMode}
          title={simpleMode ? t('simple_mode_off') : t('simple_mode_on')}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all shadow-xs',
            simpleMode
              ? 'bg-[#173426] text-[#22C55E] border border-[#22C55E]/40 dark:bg-[#22C55E] dark:text-black'
              : 'border border-[#E3DCCE] bg-white/80 text-[#3E4D40] hover:bg-white dark:border-[#263A2B] dark:bg-[#162319] dark:text-[#D1E0D4]'
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden md:inline">
            {simpleMode ? t('simple_mode_on') : t('simple_mode_off')}
          </span>
        </button>

        {/* Farm & Weather pill chip */}
        <Link
          href="/weather"
          className="hidden items-center gap-2 rounded-full border border-[#E3DCCE] bg-white/70 px-3 py-1.5 text-xs font-medium text-[#2E3C31] shadow-sm hover:bg-white dark:border-[#263A2B] dark:bg-[#162319] dark:text-[#D1E0D4] xl:flex"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>{farm.name.split(' ')[0]} • 28°C Nashik</span>
        </Link>

        {/* Quick Record Button (Amber pill) */}
        <button
          onClick={onOpenQuickRecord}
          className="flex items-center gap-1.5 rounded-full bg-[#E7AC38] px-3.5 py-2 text-xs font-semibold text-[#18251C] shadow-sm transition-transform hover:bg-[#D69B2A] active:scale-95"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.8]" />
          <span className="hidden sm:inline">{t('quick_record')}</span>
        </button>

        {/* Language Switcher */}
        <LanguageSwitcher variant="compact" />

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          aria-label={t('theme_toggle')}
          className="rounded-full border border-[#E3DCCE] bg-white/80 p-2 text-[#445047] shadow-sm transition-colors hover:bg-white dark:border-[#263A2B] dark:bg-[#162319] dark:text-[#A1B2A5]"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative rounded-full border border-[#E3DCCE] bg-white/80 p-2 text-[#445047] shadow-sm transition-colors hover:bg-white dark:border-[#263A2B] dark:bg-[#162319] dark:text-[#A1B2A5]"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DF5D52] text-[9px] font-bold text-white shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#ECE6DB] bg-white p-4 shadow-xl dark:border-[#233528] dark:bg-[#162319] animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3 dark:border-[#263A2B]">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-[#18251C] dark:text-white">
                    {t('notifications')}
                  </h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-[#FEECEC] px-2 py-0.5 text-[10px] font-semibold text-[#DF5D52] dark:bg-[#3E1A1A]">
                      {unreadCount} {t('new')}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-[#2E7D47] hover:underline dark:text-[#4ADE80]"
                  >
                    {t('mark_all_read')}
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-80 space-y-2.5 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#79857B]">{t('no_notifications')}</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`flex items-start gap-3 rounded-xl p-2.5 transition-colors cursor-pointer ${
                        notif.isRead
                          ? 'bg-transparent hover:bg-[#F9F7F2] dark:hover:bg-[#1A281E]'
                          : 'bg-[#F9F7F2] hover:bg-[#F2EFE8] dark:bg-[#1C2C20] dark:hover:bg-[#203425]'
                      }`}
                    >
                      <div className="mt-0.5 rounded-lg bg-white p-1.5 shadow-sm dark:bg-[#223527]">
                        {getNotifIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-[#18251C] dark:text-white">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-[#8C988E]">{notif.createdAt}</span>
                        </div>
                        <p className="text-xs text-[#525E54] dark:text-[#A7B8AA] line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 rounded-full border border-[#E3DCCE] bg-white/80 py-1 pl-1 pr-2.5 shadow-sm transition-all hover:bg-white dark:border-[#263A2B] dark:bg-[#162319]"
          >
            <div className="relative h-7 w-7 overflow-hidden rounded-full border border-[#D5CEC0]">
              <Image
                src={
                  user?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                }
                alt={user?.fullName || t('user_label')}
                width={28}
                height={28}
                className="object-cover"
              />
            </div>
            <div className="hidden flex-col text-left sm:flex">
              <span className="text-xs font-semibold leading-tight text-[#18251C] dark:text-white">
                {user?.fullName || t('user_label')}
              </span>
              <span className="text-[10px] capitalize leading-none text-[#79857B] dark:text-[#8E9F92]">
                {user?.role ? t(`role_${user.role}`) : t('user_label')}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#79857B] dark:text-[#8E9F92]" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#ECE6DB] bg-white p-3 shadow-xl dark:border-[#233528] dark:bg-[#162319] animate-in fade-in">
              <div className="border-b border-[#F0EAE0] pb-2.5 dark:border-[#263A2B]">
                <p className="text-xs font-semibold text-[#18251C] dark:text-white">
                  {user?.fullName}
                </p>
                <p className="text-[11px] text-[#79857B] dark:text-[#8E9F92]">{user?.email}</p>
                <div className="mt-1 inline-flex items-center rounded-md bg-[#E8F5E9] px-2 py-0.5 text-[10px] font-semibold text-[#1B5E20] dark:bg-[#1F3D26] dark:text-[#81C784]">
                  {t('active_role')}: {user?.role ? t(`role_${user.role}`) : t('user_label')}
                </div>
              </div>

              <div className="pt-2 space-y-1">
                <Link
                  href="/farm-profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#3E4C41] hover:bg-[#F7F4EE] dark:text-[#CCDCCE] dark:hover:bg-[#1E2E22]"
                >
                  <span>{t('nav_farm_profile')}</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#3E4C41] hover:bg-[#F7F4EE] dark:text-[#CCDCCE] dark:hover:bg-[#1E2E22]"
                >
                  <span>{t('nav_settings')}</span>
                </Link>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#DF5D52] hover:bg-[#FEECEC] dark:hover:bg-[#3E1A1A]"
                >
                  <span>{t('nav_logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
