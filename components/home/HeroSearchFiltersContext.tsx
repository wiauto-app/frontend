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

import type {
  HeroCatalogFacetItem,
  HeroFacetCascadeFilters,
} from "@/interfaces/hero-facet.interface";
import {
  buildHeroListingHref,
  type HeroListingSearchState,
} from "@/lib/vehicles/listing-url";

interface HeroSearchFiltersContextValue {
  makeModelPayload: MakeModelUrlPayload;
  selectedMakes: HeroCatalogFacetItem[];
  selectedModels: HeroCatalogFacetItem[];
  locationPayload: LocationUrlPayload;
  untilPrice?: number;
  handleToggleMake: (make: HeroCatalogFacetItem, checked: boolean) => void;
  handleToggleModel: (model: HeroCatalogFacetItem, checked: boolean) => void;
  setLocationPayload: (payload: LocationUrlPayload) => void;
  setUntilPrice: (until_price?: number) => void;
  /** Cascada facet desactivada en UI (hero usa catálogo Postgres). Se mantiene por compatibilidad. */
  facetQueryParams: HeroFacetCascadeFilters;
  buildListingHref: () => string;
}

const HeroSearchFiltersContext =
  createContext<HeroSearchFiltersContextValue | null>(null);

const toMakeModelPayload = (
  selectedMakes: HeroCatalogFacetItem[],
  selectedModels: HeroCatalogFacetItem[],
): MakeModelUrlPayload => ({
  marcas:
    selectedMakes.length > 0
      ? selectedMakes.map((make) => make.slug)
      : undefined,
  modelos:
    selectedModels.length > 0
      ? selectedModels.map((model) => model.slug)
      : undefined,
});

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
  const [selectedMakes, setSelectedMakes] = useState<HeroCatalogFacetItem[]>(
    [],
  );
  const [selectedModels, setSelectedModels] = useState<HeroCatalogFacetItem[]>(
    [],
  );
  const [locationPayload, setLocationPayload] = useState<LocationUrlPayload>(
    {},
  );
  const [untilPrice, setUntilPrice] = useState<number | undefined>();

  const makeModelPayload = useMemo(
    () => toMakeModelPayload(selectedMakes, selectedModels),
    [selectedMakes, selectedModels],
  );

  const handleToggleMake = useCallback(
    (make: HeroCatalogFacetItem, checked: boolean) => {
      if (checked) {
        setSelectedMakes((prev) => {
          if (prev.some((item) => item.id === make.id)) {
            return prev;
          }
          return [...prev, make];
        });
        return;
      }

      setSelectedMakes((prev) => prev.filter((item) => item.id !== make.id));
      setSelectedModels((prev) =>
        prev.filter((model) => model.make_id !== make.id),
      );
    },
    [],
  );

  const handleToggleModel = useCallback(
    (model: HeroCatalogFacetItem, checked: boolean) => {
      if (!checked) {
        setSelectedModels((prev) =>
          prev.filter((item) => item.id !== model.id),
        );
        return;
      }

      setSelectedModels((prev) => {
        if (prev.some((item) => item.id === model.id)) {
          return prev;
        }
        return [...prev, model];
      });

      const { make_id, make_slug, make_name } = model;
      if (
        make_id === undefined ||
        !make_slug ||
        !make_name
      ) {
        return;
      }

      setSelectedMakes((prev) => {
        if (prev.some((item) => item.id === make_id)) {
          return prev;
        }
        return [
          ...prev,
          {
            id: make_id,
            slug: make_slug,
            name: make_name,
            vehicle_count: 0,
          },
        ];
      });
    },
    [],
  );

  const facetQueryParams = useMemo(
    () => toFacetQueryParams(makeModelPayload, locationPayload, untilPrice),
    [locationPayload, makeModelPayload, untilPrice],
  );

  const buildListingHref = useCallback(() => {
    const state: HeroListingSearchState = {
      ...makeModelPayload,
      ...locationPayload,
      ...(untilPrice !== undefined ? { precio_hasta: untilPrice } : {}),
    };
    return buildHeroListingHref(state);
  }, [locationPayload, makeModelPayload, untilPrice]);

  const value = useMemo(
    (): HeroSearchFiltersContextValue => ({
      makeModelPayload,
      selectedMakes,
      selectedModels,
      locationPayload,
      untilPrice,
      handleToggleMake,
      handleToggleModel,
      setLocationPayload,
      setUntilPrice,
      facetQueryParams,
      buildListingHref,
    }),
    [
      makeModelPayload,
      selectedMakes,
      selectedModels,
      locationPayload,
      untilPrice,
      handleToggleMake,
      handleToggleModel,
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

export const useOptionalHeroSearchFilters =
  (): HeroSearchFiltersContextValue | null =>
    useContext(HeroSearchFiltersContext);
