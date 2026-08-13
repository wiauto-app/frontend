"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { authService, type MeResponseDto } from "@/services/authService";
import { AuthContext } from "./authContext";
import { useRouter } from "next/navigation";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MeResponseDto | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authService.getMe();
      if (!response.ok || !response.data?.id) {
        setUser(undefined);
        return;
      }
      setUser(response.data);
    } catch {
      setUser(undefined);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(undefined);
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user?.id),
      refreshUser,
      logout,
    }),
    [user, isLoading, refreshUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
