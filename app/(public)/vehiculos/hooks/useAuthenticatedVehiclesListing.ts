"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/app/contexts/auth/useUser";
import type {
  FindAllVehiclesParams,
  VehicleListItem,
} from "@/interfaces/vehicle.interface";
import { buildVehiclesQueryString } from "@/lib/vehicles/build-vehicles-query-params";
import { vehicleService } from "@/services/vehicleService";
import { useVehiclesListingFilters } from "./useVehiclesListingFilters";

interface UseAuthenticatedVehiclesListingParams {
  initialVehicles: VehicleListItem[];
  initialTotal: number;
}

interface UseAuthenticatedVehiclesListingResult {
  vehicles: VehicleListItem[];
  total: number;
  isRefreshing: boolean;
  handleDismissed: (vehicleId: string) => void;
  filters: FindAllVehiclesParams;
}

/**
 * SSR anónimo con cache compartida; con sesión, refetch autenticado
 * (cookies) sin depender de esa cache para respetar descartes.
 */
export const useAuthenticatedVehiclesListing = ({
  initialVehicles,
  initialTotal,
}: UseAuthenticatedVehiclesListingParams): UseAuthenticatedVehiclesListingResult => {
  const { isAuthenticated, isLoading: isAuthLoading } = useUser();
  const { filters } = useVehiclesListingFilters();
  const filtersQueryKey = useMemo(
    () => buildVehiclesQueryString(filters),
    [filters],
  );
  const filtersRef = useRef(filters);
  filtersRef.current = filters;
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [total, setTotal] = useState(initialTotal);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }
    setVehicles(initialVehicles);
    setTotal(initialTotal);
  }, [initialVehicles, initialTotal, isAuthenticated]);

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) {
      return;
    }

    let cancelled = false;

    const refresh = async () => {
      setIsRefreshing(true);
      try {
        const response = await vehicleService.vehicles.findAll(
          filtersRef.current,
        );
        if (cancelled || !response.ok || !response.data) {
          return;
        }

        setVehicles(response.data.data ?? []);
        setTotal(response.data.total ?? 0);
      } finally {
        if (!cancelled) {
          setIsRefreshing(false);
        }
      }
    };

    void refresh();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isAuthLoading, filtersQueryKey]);

  const handleDismissed = useCallback((vehicleId: string) => {
    setVehicles((current) => {
      const next = current.filter((vehicle) => vehicle.id !== vehicleId);
      setTotal((currentTotal) =>
        Math.max(0, currentTotal - (current.length - next.length)),
      );
      return next;
    });
  }, []);

  return {
    vehicles,
    total,
    isRefreshing,
    handleDismissed,
    filters,
  };
};
