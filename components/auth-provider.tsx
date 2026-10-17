'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, UserRole } from '@/types';
import { useFarmStore } from '@/hooks/useFarmStore';
import { useTranslation } from '@/components/i18n-provider';

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserProfile;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<AuthResponse>;
  register: (data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    role: UserRole;
    farmName?: string;
    farmLocation?: string;
    inviteCode?: string;
  }) => Promise<AuthResponse>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  canAccess: (module: string) => boolean;
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (open: boolean) => void;
  completePasswordChange: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  switchRole: () => {},
  canAccess: () => true,
  isLogoutModalOpen: false,
  setIsLogoutModalOpen: () => {},
  completePasswordChange: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    currentUser,
    setCurrentUserRole,
    setCurrentUser,
    users,
    registerUser,
    changePassword,
  } = useFarmStore();
  const { t } = useTranslation();

  const [user, setUser] = useState<UserProfile | null>(currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  const login = async (identifier: string, password?: string): Promise<AuthResponse> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = cleanId.replace(/[\s-+]/g, '');
    const matched = users.find((u) => {
      const userCleanEmail = u.email.toLowerCase();
      const userCleanPhone = (u.phone || '').replace(/[\s-+]/g, '');
      return (
        userCleanEmail === cleanId ||
        (cleanPhone.length >= 10 && userCleanPhone.endsWith(cleanPhone.slice(-10)))
      );
    });

    if (!matched) {
      // Friendly, generic error message without leaking user existence
      return {
        success: false,
        message: t('auth.invalid_credentials'),
      };
    }

    setCurrentUser(matched);
    setUser(matched);
    setIsAuthenticated(true);
    return { success: true, user: matched };
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    role: UserRole;
    farmName?: string;
    farmLocation?: string;
    inviteCode?: string;
  }): Promise<AuthResponse> => {
    const result = registerUser(data);
    if (!result.success || !result.user) {
      return { success: false, message: result.message };
    }

    setUser(result.user);
    setIsAuthenticated(true);
    return { success: true, message: result.message, user: result.user };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsLogoutModalOpen(false);
    router.push('/login?logged_out=true');
  };

  const switchRole = (role: UserRole) => {
    setCurrentUserRole(role);
  };

  const completePasswordChange = () => {
    if (user) {
      changePassword(user.id);
      setUser({ ...user, mustChangePassword: false });
    }
  };

  const canAccess = (module: string): boolean => {
    if (!user) return false;
    const role = user.role;

    if (role === 'owner') return true;

    if (role === 'manager') {
      // Manager can do everything except delete farm or transfer ownership
      return true;
    }

    if (role === 'worker') {
      // Worker can only view tasks, crops, livestock, inventory, weather
      // No access to sales, expenses, reports, financial settings
      const forbiddenModules = ['sales', 'expenses', 'finance', 'reports', 'suppliers'];
      return !forbiddenModules.includes(module.toLowerCase());
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        switchRole,
        canAccess,
        isLogoutModalOpen,
        setIsLogoutModalOpen,
        completePasswordChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
