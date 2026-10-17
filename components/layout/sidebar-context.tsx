'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type SidebarState = 'expanded' | 'collapsed';

interface SidebarContextType {
  state: SidebarState;
  isMobileOpen: boolean;
  toggleSidebar: () => void;
  setSidebarState: (state: SidebarState) => void;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  toggleMobileDrawer: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const STORAGE_KEY = 'farmsync-sidebar-state';

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SidebarState>('expanded');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Restore state from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SidebarState | null;
      if (saved === 'expanded' || saved === 'collapsed') {
        setState(saved);
      }
    } catch {
      // Ignore localStorage errors in private mode
    }
    setMounted(true);
  }, []);

  // Trigger window resize event so Recharts & responsive components redraw smoothly
  const triggerResize = useCallback(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 310);
    }
  }, []);

  const setSidebarState = useCallback((newState: SidebarState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, newState);
    } catch {
      // Ignore
    }
    triggerResize();
  }, [triggerResize]);

  const toggleSidebar = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      // On mobile/tablet, toggle drawer
      setIsMobileOpen((prev) => !prev);
    } else {
      // On desktop, toggle between expanded and collapsed
      setSidebarState(state === 'expanded' ? 'collapsed' : 'expanded');
    }
  }, [state, setSidebarState]);

  const openMobileDrawer = useCallback(() => setIsMobileOpen(true), []);
  const closeMobileDrawer = useCallback(() => setIsMobileOpen(false), []);
  const toggleMobileDrawer = useCallback(() => setIsMobileOpen((prev) => !prev), []);

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar, isMobileOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isMobileOpen) {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = originalStyle;
        };
      }
    }
  }, [isMobileOpen]);

  return (
    <SidebarContext.Provider
      value={{
        state,
        isMobileOpen,
        toggleSidebar,
        setSidebarState,
        openMobileDrawer,
        closeMobileDrawer,
        toggleMobileDrawer,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
