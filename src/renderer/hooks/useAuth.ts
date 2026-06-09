// src/renderer/hooks/useAuth.ts
import { useState, useEffect, useCallback } from "react";
import authAPI, { type AuthResponse } from "../api/core/auth";

interface UseAuthReturn {
  /** Ang kasalukuyang authenticated user (null kung wala) */
  user: AuthResponse | null;
  /** Kung naglo-load pa ang auth check */
  loading: boolean;
  /** Kung may authenticated user */
  isAuthenticated: boolean;
  /** Mag-logout at i-clear ang user */
  logout: () => Promise<void>;
  /** Manu-manong i-refresh ang user data (hal. pagkatapos mag-update ng profile) */
  refreshUser: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const isLoggedIn = await authAPI.isLoggedIn();
        if (isLoggedIn) {
          await fetchUser();
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    refreshUser,
  };
};