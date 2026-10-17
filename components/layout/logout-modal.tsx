'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

export function LogoutModal() {
  const { isLogoutModalOpen, setIsLogoutModalOpen, logout } = useAuth();

  if (!isLogoutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl border border-[#ECE6DB] bg-white p-6 shadow-2xl dark:border-[#233528] dark:bg-[#162319]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEECEC] text-[#DF5D52] dark:bg-[#341818] mb-4">
          <LogOut className="h-6 w-6 stroke-[2.2]" />
        </div>

        <h3 className="text-lg font-bold text-[#18251C] dark:text-white">Sign Out of FarmSync?</h3>
        <p className="mt-2 text-xs text-[#6A786E] dark:text-[#90A294]">
          You will need to sign in again to access Oakridge Organic Farm telemetry and records.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => setIsLogoutModalOpen(false)}
            className="flex-1 rounded-xl border border-[#D5CEC0] py-2.5 text-xs font-semibold text-[#445047] hover:bg-[#F3EFE7] dark:border-[#2D4032] dark:text-[#D1E0D4] dark:hover:bg-[#1E2E22]"
          >
            Cancel
          </button>
          <button
            onClick={logout}
            className="flex-1 rounded-xl bg-[#DF5D52] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#C94D43] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
