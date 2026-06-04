"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { MakeModelUrlPayload } from "@/components/selectors/FilterMakeSelector/utils/make-model-selection";
import type { LocationUrlPayload } from "@/components/selectors/FilterLocationSelector/utils/location-selection";

import type { HeroFacetCascadeFilters } from "@/interfaces/hero-facet.interface";
import {
  buildHeroListingHref,
  type HeroListingSearchState,
} from "@/lib/vehicles/listing-url";

type HeroSearchFiltersContextValue = {
  makeModelPayload: MakeModelUrlPayload;
  locationPayload: LocationUrlPayload;
  untilPrice?: number;
  setMakeModelPayload: (payload: MakeModelUrlPayload) => void;
  setLocationPayload: (payload: LocationUrlPayload) => void;
  setUntilPrice: (until_price?: number) => void;
  facetQueryParams: HeroFacetCascadeFilters;
  buildListingHref: () => string;
};

const HeroSearchFiltersContext =
  createContext<HeroSearchFiltersContextValue | null>(null);

const toFacetQueryParams = (
  makeModelPayload: MakeModelUrlPayload,
  locationPayload: LocationUrlPayload,
  until_price?: number,
): HeroFacetCascadeFilters => ({
  make_slugs: makeModelPayload.marcas,
  model_slugs: makeModelPayload.modelos,
  province_slug: locationPayload.provincias?.[0],
  municipality_slug: locationPayload.municipios?.[0],
  until_price,
});

export const HeroSearchFiltersProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [makeModelPayload, setMakeModelPayload] = useState<MakeModelUrlPayload>(
    {},
  );
  const [locationPayload, setLocationPayload] = useState<LocationUrlPayload>({});
  const [untilPrice, setUntilPrice] = useState<number | undefined>();

  const facetQueryParams = useMemo(
    () => toFacetQueryParams(makeModelPayload, locationPayload, untilPrice),
    [locationPayload, makeModelPayload, untilPrice],
  );

  const buildListingHref = useCallback(() => {
    const state: HeroListingSearchState = {
      ...makeModelPayload,
      ...locationPayload,
      ...(untilPrice !== undefined
        ? { precio_hasta: untilPrice }
        : {}),
    };
    return buildHeroListingHref(state);
  }, [locationPayload, makeModelPayload, untilPrice]);

  const value = useMemo(
    (): HeroSearchFiltersContextValue => ({
      makeModelPayload,
      locationPayload,
      untilPrice,
      setMakeModelPayload,
      setLocationPayload,
      setUntilPrice,
      facetQueryParams,
      buildListingHref,
    }),
    [
      makeModelPayload,
      locationPayload,
      untilPrice,
      facetQueryParams,
      buildListingHref,
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
