"use client";

import { useQuery } from "@tanstack/react-query";
import { ownerStatisticsService } from "@/services/ownerStatistics/ownerStatisticsService";

export const OWNER_STATISTICS_QUERY_KEY = "owner-statistics" as const;

interface UseOwnerStatisticsOptions {
  since: string;
  until: string;
  enabled?: boolean;
}

export const useOwnerStatistics = ({
  since,
  until,
  enabled = true,
}: UseOwnerStatisticsOptions) => {
  const query = useQuery({
    queryKey: [OWNER_STATISTICS_QUERY_KEY, since, until],
    queryFn: async () => {
      const response = await ownerStatisticsService.getStatistics({
        since,
        until,
      });

      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudieron cargar las estadísticas",
        );
      }

      return response.data;
    },
    staleTime: 60_000,
    enabled: enabled && Boolean(since) && Boolean(until),
  });

  return {
    statistics: query.data ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};
