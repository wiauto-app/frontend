"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  HeroFacetCascadeFilters,
  HeroSearchFilters,
} from "@/interfaces/hero-facet.interface";
import { toHeroFacetCascadeFilters } from "@/interfaces/hero-facet.interface";
import type { HierarchyMultiValue } from "@/components/selectors/types";

type HeroSearchFiltersContextValue = {
  filters: HeroSearchFilters;
  setMakeModelValue: (value: HierarchyMultiValue) => void;
  setLocationValue: (value: HierarchyMultiValue) => void;
  setUntilPrice: (until_price?: number) => void;
  clearMakeModel: () => void;
  clearProvinceMunicipality: () => void;
  facetQueryParams: HeroFacetCascadeFilters;
  makeModelValue: HierarchyMultiValue;
  locationValue: HierarchyMultiValue;
};

const HeroSearchFiltersContext =
  createContext<HeroSearchFiltersContextValue | null>(null);

export const HeroSearchFiltersProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [filters, setFilters] = useState<HeroSearchFilters>({});

  const setMakeModelValue = useCallback((value: HierarchyMultiValue) => {
    setFilters((prev) => ({
      ...prev,
      makes_slugs:
        value.parent_slugs.length > 0 ? value.parent_slugs : undefined,
      models_slugs:
        value.child_slugs.length > 0 ? value.child_slugs : undefined,
    }));
  }, []);

  const setLocationValue = useCallback((value: HierarchyMultiValue) => {
    setFilters((prev) => ({
      ...prev,
      provinces_slugs:
        value.parent_slugs.length > 0 ? value.parent_slugs : undefined,
      municipalities_slugs:
        value.child_slugs.length > 0 ? value.child_slugs : undefined,
    }));
  }, []);

  const setUntilPrice = useCallback((until_price?: number) => {
    setFilters((prev) => ({ ...prev, until_price }));
  }, []);

  const clearMakeModel = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      makes_slugs: undefined,
      models_slugs: undefined,
    }));
  }, []);

  const clearProvinceMunicipality = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      provinces_slugs: undefined,
      municipalities_slugs: undefined,
    }));
  }, []);

  const facetQueryParams = useMemo(
    () => toHeroFacetCascadeFilters(filters),
    [filters],
  );

  const makeModelValue = useMemo(
    (): HierarchyMultiValue => ({
      parent_slugs: filters.makes_slugs ?? [],
      child_slugs: filters.models_slugs ?? [],
    }),
    [filters.makes_slugs, filters.models_slugs],
  );

  const locationValue = useMemo(
    (): HierarchyMultiValue => ({
      parent_slugs: filters.provinces_slugs ?? [],
      child_slugs: filters.municipalities_slugs ?? [],
    }),
    [filters.municipalities_slugs, filters.provinces_slugs],
  );

  const value = useMemo(
    (): HeroSearchFiltersContextValue => ({
      filters,
      setMakeModelValue,
      setLocationValue,
      setUntilPrice,
      clearMakeModel,
      clearProvinceMunicipality,
      facetQueryParams,
      makeModelValue,
      locationValue,
    }),
    [
      filters,
      setMakeModelValue,
      setLocationValue,
      setUntilPrice,
      clearMakeModel,
      clearProvinceMunicipality,
      facetQueryParams,
      makeModelValue,
      locationValue,
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
