"use client";

import { authService } from "@/services/authService";
import { User } from "@/interfaces/user.interface";
import { logoutAction } from "@/app/(auth)/authActions/authActions";
import { AuthContext } from "./authContext";
import { useCallback, useEffect, useMemo, useState } from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadInitialSession = async () => {
      setIsLoading(true);
      try {
        const nextUser = await authService.getMe();
        if (!cancelled) {
          setUser(nextUser);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshUser = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const nextUser = await authService.getMe();
      setUser(nextUser);
    } catch (e) {
      setUser(null);
      const message =
        e instanceof Error ? e.message : "No se pudo actualizar el usuario";
      setError(message);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setError(null);
    await logoutAction();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isRefreshing,
      error,
      isAuthenticated: user !== null,
      refreshUser,
      setUser,
      clearError,
      logout,
    }),
    [
      user,
      isLoading,
      isRefreshing,
      error,
      refreshUser,
      clearError,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
