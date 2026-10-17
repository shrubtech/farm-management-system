'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { LogoutModal } from './logout-modal';
import { SearchModal } from './search-modal';
import { QuickRecordModal } from './quick-record-modal';
import { SidebarProvider, useSidebar } from './sidebar-context';
import { Wifi, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/components/i18n-provider';

function AppShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickRecordOpen, setIsQuickRecordOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(true);
  const { t } = useTranslation();

  const isCollapsed = state === 'collapsed';

  // If on login, register, or forgot-password, do not show sidebar or topbar
  const isAuthPage =
    pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';

  if (isAuthPage) {
    return (
      <main className="min-h-screen bg-[#FBF9F5] text-[#18251C] dark:bg-[#0E1712] dark:text-[#EAF2EC]">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#18251C] dark:bg-[#0E1712] dark:text-[#EAF2EC] flex flex-col">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen w-full">
        <Topbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenQuickRecord={() => setIsQuickRecordOpen(true)}
        />

        <main
          className={cn(
            'flex-1 px-4 py-6 sm:px-6 transition-all duration-300 ease-in-out w-full',
            isCollapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'
          )}
        >
          <div className="mx-auto max-w-7xl w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Persistent Floating Toast Banner (IoT Mesh Connected) */}
      {isToastVisible && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-[#173426] px-4 py-2 text-xs text-white shadow-xl dark:bg-[#1E3F2E] border border-white/10 animate-in slide-in-from-bottom-3">
          <span className="flex h-2 w-2 rounded-full bg-[#22C55E] animate-ping" />
          <Wifi className="h-3.5 w-3.5 text-[#22C55E]" />
          <span className="font-semibold">{t('system_connected')}</span>
          <span className="text-white/70 hidden sm:inline">
            {t('system_synced')}
          </span>
          <button
            onClick={() => setIsToastVisible(false)}
            aria-label={t('dismiss')}
            className="ml-2 text-white/50 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Modals */}
      <LogoutModal />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <QuickRecordModal isOpen={isQuickRecordOpen} onClose={() => setIsQuickRecordOpen(false)} />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppShellContent>{children}</AppShellContent>
    </SidebarProvider>
  );
}
