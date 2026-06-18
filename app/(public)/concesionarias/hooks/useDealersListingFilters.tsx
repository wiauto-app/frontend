"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { DealerFilters } from "../interfaces";
import { buildDealersHref, parseDealersUrl } from "../utils/dealersUrl";

type DealersListingFiltersContextValue = {
  filters: DealerFilters;
  commitFilters: (nextFilters: DealerFilters) => void;
  resetFilters: () => void;
  goToPage: (page: number) => void;
};

const DealersListingFiltersContext =
  createContext<DealersListingFiltersContextValue | null>(null);

export const useDealersListingFilters = (): DealersListingFiltersContextValue => {
  const context = useContext(DealersListingFiltersContext);
  if (!context) {
    throw new Error(
      "useDealersListingFilters debe usarse dentro de DealersListingFiltersProvider",
    );
  }
  return context;
};

type DealersListingFiltersProviderProps = {
  children: ReactNode;
};

export const DealersListingFiltersProvider = ({
  children,
}: DealersListingFiltersProviderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const filters = useMemo(
    () => parseDealersUrl([], searchParams),
    [searchParams],
  );

  const pushFilters = useCallback(
    (nextFilters: DealerFilters) => {
      router.push(buildDealersHref(nextFilters));
    },
    [router],
  );

  const commitFilters = useCallback(
    (nextFilters: DealerFilters) => {
      startTransition(() => {
        pushFilters(nextFilters);
      });
    },
    [pushFilters],
  );

  const resetFilters = useCallback(() => {
    router.push("/concesionarias");
  }, [router]);

  const goToPage = useCallback(
    (page: number) => {
      pushFilters({ ...filters, page });
    },
    [filters, pushFilters],
  );

  const value = useMemo(
    () => ({
      filters,
      commitFilters,
      resetFilters,
      goToPage,
    }),
    [filters, commitFilters, resetFilters, goToPage],
  );

  return (
    <DealersListingFiltersContext.Provider value={value}>
      {children}
    </DealersListingFiltersContext.Provider>
  );
};
