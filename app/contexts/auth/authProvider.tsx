"use client";

import { authService } from "@/services/authService";
import { AuthContext } from "./authContext";
import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await authService.getMe();
      if(!response.ok) {
        return null
      }
      return response.data;
    },
  });

  const refreshUser = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  }, [queryClient]);

  const logout = useCallback(async () => {
    await authService.logout();
    refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user: user?.id ? user : undefined,
      isLoading,
      isAuthenticated: !!user,
      refreshUser,
      logout,
    }),
    [user, isLoading, refreshUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
