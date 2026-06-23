"use client";

import { useQuery } from "@tanstack/react-query";
import type { OwnerDashboardPeriod } from "@/interfaces/owner-dashboard.interface";
import { ownerDashboardService } from "@/services/ownerDashboard/ownerDashboardService";

export const OWNER_DASHBOARD_QUERY_KEY = "owner-dashboard" as const;

type UseOwnerDashboardOptions = {
  period?: OwnerDashboardPeriod;
  enabled?: boolean;
};

export const useOwnerDashboard = ({
  period = "30d",
  enabled = true,
}: UseOwnerDashboardOptions = {}) => {
  const query = useQuery({
    queryKey: [OWNER_DASHBOARD_QUERY_KEY, period],
    queryFn: async () => {
      const response = await ownerDashboardService.getDashboard(period);

      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudo cargar el resumen del dashboard",
        );
      }

      return response.data;
    },
    staleTime: 60_000,
    enabled,
  });

  return {
    dashboard: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};
