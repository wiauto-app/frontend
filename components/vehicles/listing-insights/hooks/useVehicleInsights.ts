"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { VehicleInsights } from "@/interfaces/vehicle-insights.interface";
import { vehicleInsightsService } from "../services/vehicleInsightsService";
import { vehicleInsightsQueryKey } from "./listing-insights-query-keys";

export const FEATURED_POLL_INTERVAL_MS = 2_000;
export const FEATURED_POLL_TIMEOUT_MS = 30_000;

interface UseVehicleInsightsOptions {
  initialData?: VehicleInsights | null;
  enabled?: boolean;
  /**
   * Tras volver de Stripe el webhook puede tardar: se reconsulta cada 2 s
   * hasta que `featured.is_active` sea true o pasen 30 s desde el montaje.
   */
  pollFeaturedActivation?: boolean;
}

export const useVehicleInsights = (
  vehicleId: string | null,
  {
    initialData,
    enabled = true,
    pollFeaturedActivation = false,
  }: UseVehicleInsightsOptions = {},
) => {
  // Instante de inicio fijado una sola vez (retorno de checkout conocido al montar).
  const [pollStartedAt] = useState<number | null>(() =>
    pollFeaturedActivation ? Date.now() : null,
  );

  return useQuery({
    queryKey: vehicleInsightsQueryKey(vehicleId ?? ""),
    queryFn: () => vehicleInsightsService.getInsights(vehicleId as string),
    enabled: enabled && Boolean(vehicleId),
    initialData: initialData ?? undefined,
    // Con datos del servidor evitamos el refetch inmediato al hidratar.
    staleTime: initialData ? 30_000 : 0,
    refetchInterval: (query) => {
      if (pollStartedAt === null) {
        return false;
      }
      if (query.state.data?.featured.is_active) {
        return false;
      }
      if (Date.now() - pollStartedAt > FEATURED_POLL_TIMEOUT_MS) {
        return false;
      }
      return FEATURED_POLL_INTERVAL_MS;
    },
  });
};
