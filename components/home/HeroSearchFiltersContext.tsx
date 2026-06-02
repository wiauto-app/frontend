"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { HeroSearchFilters } from "@/interfaces/hero-facet.interface";

type HeroSearchFiltersContextValue = {
  filters: HeroSearchFilters;
  setMakeSlug: (make_slug?: string) => void;
  setModelSlug: (model_slug?: string) => void;
  setProvinceSlug: (province_slug?: string) => void;
  setMunicipalitySlug: (municipality_slug?: string) => void;
  setUntilPrice: (until_price?: number) => void;
  clearMakeModel: () => void;
  clearProvinceMunicipality: () => void;
  facetQueryParams: HeroSearchFilters;
};

const HeroSearchFiltersContext =
  createContext<HeroSearchFiltersContextValue | null>(null);

export const HeroSearchFiltersProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [filters, setFilters] = useState<HeroSearchFilters>({});

  const setMakeSlug = useCallback((make_slug?: string) => {
    setFilters((prev) => ({
      ...prev,
      make_slug,
      model_slug: undefined,
    }));
  }, []);

  const setModelSlug = useCallback((model_slug?: string) => {
    setFilters((prev) => ({ ...prev, model_slug }));
  }, []);

  const setProvinceSlug = useCallback((province_slug?: string) => {
    setFilters((prev) => ({
      ...prev,
      province_slug,
      municipality_slug: undefined,
    }));
  }, []);

  const setMunicipalitySlug = useCallback((municipality_slug?: string) => {
    setFilters((prev) => ({ ...prev, municipality_slug }));
  }, []);

  const setUntilPrice = useCallback((until_price?: number) => {
    setFilters((prev) => ({ ...prev, until_price }));
  }, []);

  const clearMakeModel = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      make_slug: undefined,
      model_slug: undefined,
    }));
  }, []);

  const clearProvinceMunicipality = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      province_slug: undefined,
      municipality_slug: undefined,
    }));
  }, []);

  const facetQueryParams = useMemo(
    (): HeroSearchFilters => ({
      make_slug: filters.make_slug,
      model_slug: filters.model_slug,
      province_slug: filters.province_slug,
      municipality_slug: filters.municipality_slug,
      until_price: filters.until_price,
    }),
    [filters],
  );

  const value = useMemo(
    (): HeroSearchFiltersContextValue => ({
      filters,
      setMakeSlug,
      setModelSlug,
      setProvinceSlug,
      setMunicipalitySlug,
      setUntilPrice,
      clearMakeModel,
      clearProvinceMunicipality,
      facetQueryParams,
    }),
    [
      filters,
      setMakeSlug,
      setModelSlug,
      setProvinceSlug,
      setMunicipalitySlug,
      setUntilPrice,
      clearMakeModel,
      clearProvinceMunicipality,
      facetQueryParams,
    ],
  );

  return (
    <HeroSearchFiltersContext.Provider value={value}>
      {children}
    </HeroSearchFiltersContext.Provider>
  );
};

export const useHeroSearchFilters = (): HeroSearchFiltersContextValue => {
  const context = useContext(HeroSearchFiltersContext);
  if (!context) {
    throw new Error(
      "useHeroSearchFilters debe usarse dentro de HeroSearchFiltersProvider",
    );
  }
  return context;
};
