'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Sprout,
  PawPrint,
  PackageOpen,
  Tractor,
  CheckSquare,
  DollarSign,
  Truck,
  BarChart3,
  Users,
  CloudSun,
  Settings,
  LogOut,
  Hexagon,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Landmark,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth-provider';
import { useSidebar } from './sidebar-context';
import { useTranslation } from '@/components/i18n-provider';

export function Sidebar() {
  const pathname = usePathname();
  const { canAccess, setIsLogoutModalOpen, user } = useAuth();
  const { state, isMobileOpen, closeMobileDrawer, toggleSidebar } = useSidebar();
  const { t } = useTranslation();

  const isCollapsed = state === 'collapsed';

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, module: 'dashboard', i18nKey: 'nav_dashboard' },
    { name: 'Farm Profile', href: '/farm-profile', icon: Building2, module: 'farm-profile', i18nKey: 'nav_farm_profile' },
    { name: 'Crops', href: '/crops', icon: Sprout, module: 'crops', i18nKey: 'nav_crops' },
    { name: 'Livestock', href: '/livestock', icon: PawPrint, module: 'livestock', i18nKey: 'nav_livestock' },
    { name: 'Market Prices', href: '/market', icon: TrendingUp, module: 'market', i18nKey: 'nav_market' },
    { name: 'Govt Schemes', href: '/schemes', icon: Landmark, module: 'schemes', i18nKey: 'nav_schemes' },
    { name: 'Inventory', href: '/inventory', icon: PackageOpen, module: 'inventory', i18nKey: 'nav_inventory' },
    { name: 'Equipment', href: '/equipment', icon: Tractor, module: 'equipment', i18nKey: 'nav_equipment' },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, module: 'tasks', i18nKey: 'nav_tasks' },
    { name: 'Sales & Expenses', href: '/finance', icon: DollarSign, module: 'sales', i18nKey: 'nav_finance' },
    { name: 'Suppliers', href: '/suppliers', icon: Truck, module: 'suppliers', i18nKey: 'nav_suppliers' },
    { name: 'Reports', href: '/reports', icon: BarChart3, module: 'reports', i18nKey: 'nav_reports' },
    { name: 'Workers', href: '/workers', icon: Users, module: 'workers', i18nKey: 'nav_workers' },
    { name: 'Weather & Alerts', href: '/weather', icon: CloudSun, module: 'weather', i18nKey: 'nav_weather' },
    { name: 'Settings', href: '/settings', icon: Settings, module: 'settings', i18nKey: 'nav_settings' },
  ];

  // Filter out forbidden items based on role
  const visibleItems = navItems.filter((item) => canAccess(item.module));

  return (
    <>
      {/* Mobile Backdrop Overlay (below 1024px) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={closeMobileDrawer}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        aria-label={t('main_navigation')}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col justify-between border-r border-[#ECE6DB] bg-[#FBF9F5] py-5 transition-all duration-300 ease-in-out dark:border-[#233528] dark:bg-[#0F1712]',
          // Desktop Width sizing
          isCollapsed ? 'lg:w-[72px] lg:px-2.5' : 'lg:w-[260px] lg:px-4',
          // Mobile Drawer Position (always 260px wide on mobile overlay)
          'w-[260px] px-4',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Floating edge Chevron Button (Desktop only) */}
        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? t('expand_sidebar') : t('collapse_sidebar')}
          title={isCollapsed ? t('expand_sidebar') : t('collapse_sidebar')}
          className="group absolute -right-3.5 top-6 z-50 hidden h-7 w-7 items-center justify-center rounded-full border border-[#DCD5C8] bg-white text-[#445047] shadow-sm transition-transform hover:scale-105 hover:bg-[#F3ECE0] hover:text-[#18251C] dark:border-[#2D4032] dark:bg-[#162319] dark:text-[#A1B2A5] dark:hover:bg-[#1E3023] dark:hover:text-white lg:flex"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          ) : (
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          )}
        </button>

        {/* Top Section: Brand + Navigation */}
        <div className="flex flex-col gap-5 overflow-y-auto overflow-x-hidden pr-0.5">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2">
            <Link
              href="/"
              onClick={closeMobileDrawer}
              className={cn(
                'flex items-center gap-2.5 transition-all duration-300',
                isCollapsed && 'lg:justify-center lg:w-full lg:px-0'
              )}
            >
              <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#173426] text-[#22C55E] dark:bg-[#1C3D26] shadow-sm">
                <Hexagon className="h-6 w-6 stroke-[2.2] fill-[#173426]/50" />
                <span className="absolute text-[10px] font-bold text-white">FS</span>
              </div>
              <div
                className={cn(
                  'flex flex-col whitespace-nowrap transition-opacity duration-200',
                  isCollapsed && 'lg:hidden'
                )}
              >
                <span className="text-lg font-bold tracking-tight text-[#18251C] dark:text-white">
                  Farm<span className="text-[#22C55E]">Sync</span>
                </span>
                <span className="text-[9px] font-semibold tracking-wider text-[#79857B] uppercase dark:text-[#8E9F92]">
                  {t('app_tagline')}
                </span>
              </div>
            </Link>

            {/* Mobile close 'X' button */}
            <button
              onClick={closeMobileDrawer}
              aria-label={t('close_menu')}
              className="rounded-lg p-1.5 text-[#79857B] hover:bg-[#F3EFE7] dark:hover:bg-[#1A261E] lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1" role="navigation">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    onClick={closeMobileDrawer}
                    className={cn(
                      'flex items-center rounded-xl transition-all duration-150 text-sm font-medium',
                      isCollapsed
                        ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3.5 py-2.5 gap-3'
                        : 'px-3.5 py-2.5 gap-3',
                      isActive
                        ? 'bg-[#173426] text-white shadow-sm dark:bg-[#1F3E2F]'
                        : 'text-[#445047] hover:bg-[#F3ECE0] hover:text-[#18251C] dark:text-[#A1B2A5] dark:hover:bg-[#18251D] dark:hover:text-white'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 flex-shrink-0 transition-colors',
                        isActive
                          ? 'text-[#22C55E]'
                          : 'text-[#6D7B70] group-hover:text-[#18251C] dark:text-[#8E9F92] dark:group-hover:text-white'
                      )}
                    />
                    <span
                      className={cn(
                        'whitespace-nowrap transition-opacity duration-200',
                        isCollapsed && 'lg:hidden'
                      )}
                    >
                      {t(item.i18nKey) || item.name}
                    </span>
                  </Link>

                  {/* Desktop Collapsed Hover Tooltip */}
                  {isCollapsed && (
                    <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3.5 hidden -translate-y-1/2 rounded-lg bg-[#173426] px-3 py-1.5 text-xs font-semibold text-white shadow-xl dark:bg-[#1F3E2F] border border-white/10 whitespace-nowrap lg:group-hover:flex items-center gap-1.5 animate-in fade-in zoom-in-95">
                      <span>{t(item.i18nKey) || item.name}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section - Role & Logout */}
        <div className="flex flex-col gap-2 pt-4 border-t border-[#ECE6DB] dark:border-[#233528]">
          {/* Role Indicator */}
          <div
            className={cn(
              'px-3 py-1.5 flex items-center text-xs text-[#79857B] dark:text-[#8E9F92]',
              isCollapsed ? 'lg:justify-center lg:px-0' : 'justify-between'
            )}
          >
            <span className={cn(isCollapsed && 'lg:hidden')}>{t('role')}:</span>
            <span
              className="font-semibold capitalize text-[#173426] dark:text-[#22C55E]"
              title={`Role: ${user?.role || 'Manager'}`}
            >
              {isCollapsed ? (
                <span className="hidden lg:inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#E8F5E9] text-[10px] font-bold text-[#1B5E20] dark:bg-[#1F3D26] dark:text-[#81C784]">
                  {user?.role ? user.role[0].toUpperCase() : 'M'}
                </span>
              ) : null}
              <span className={cn(isCollapsed && 'lg:hidden')}>
                {user?.role || 'Manager'}
              </span>
            </span>
          </div>

          {/* Logout Button */}
          <div className="relative group">
            <button
              onClick={() => {
                closeMobileDrawer();
                setIsLogoutModalOpen(true);
              }}
              aria-label={t('nav_logout') || 'Logout'}
              className={cn(
                'flex items-center rounded-xl text-sm font-medium text-[#DF5D52] hover:bg-[#FEECEC] transition-all dark:hover:bg-[#341818] w-full',
                isCollapsed
                  ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3.5 py-2.5 gap-3'
                  : 'px-3.5 py-2.5 gap-3'
              )}
            >
              <LogOut className="h-4 w-4 stroke-[2.2] flex-shrink-0" />
              <span className={cn('whitespace-nowrap', isCollapsed && 'lg:hidden')}>
                {t('nav_logout') || 'Logout'}
              </span>
            </button>

            {/* Collapsed Tooltip for Logout */}
            {isCollapsed && (
              <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3.5 hidden -translate-y-1/2 rounded-lg bg-[#DF5D52] px-3 py-1.5 text-xs font-semibold text-white shadow-xl whitespace-nowrap lg:group-hover:flex items-center animate-in fade-in zoom-in-95">
                <span>{t('nav_logout') || 'Logout'}</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
