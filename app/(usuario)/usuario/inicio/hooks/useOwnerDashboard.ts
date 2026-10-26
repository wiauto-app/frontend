"use client";

import { useQuery } from "@tanstack/react-query";
import { ownerDashboardService } from "@/services/ownerDashboard/ownerDashboardService";

export const OWNER_DASHBOARD_QUERY_KEY = "owner-dashboard" as const;

interface UseOwnerDashboardOptions {
  startDate: string;
  endDate: string;
  enabled?: boolean;
}

export const useOwnerDashboard = ({
  startDate,
  endDate,
  enabled = true,
}: UseOwnerDashboardOptions) => {
  const query = useQuery({
    queryKey: [OWNER_DASHBOARD_QUERY_KEY, startDate, endDate],
    queryFn: async () => {
      const response = await ownerDashboardService.getDashboard({
        startDate,
        endDate,
      });

      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudo cargar el resumen del dashboard",
        );
      }

      return response.data;
    },
    staleTime: 60_000,
    enabled: enabled && Boolean(startDate) && Boolean(endDate),
  });

  return {
    dashboard: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};
