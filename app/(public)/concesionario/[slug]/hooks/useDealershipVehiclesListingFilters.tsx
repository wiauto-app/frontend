"use client";

import {
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { HierarchyMultiValue } from "@/components/selectors/types";
import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import {
  orderDirectionFromUrlSegment,
  orderDirectionToUrlSegment,
} from "@/lib/vehicles/listing-url";
import { getConditionLabel } from "@/app/(public)/vehiculos/utils";
import {
  VehiclesListingFiltersContext,
  type VehiclesListingFiltersContextValue,
} from "@/app/(public)/vehiculos/hooks/useVehiclesListingFilters";

import { buildDealershipVehicleHref } from "../utils/buildDealershipVehicleHref";
import { parseDealershipVehicleFilters } from "../utils/parseDealershipVehicleFilters";

type FilterChip = {
  key: string;
  label: string;
  onRemove: () => void;
};

const toggleLocalSelection = <T,>(
  value: T,
  setter: React.Dispatch<React.SetStateAction<T[]>>,
) => {
  setter((prev) =>
    prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
  );
};

export const useDealershipVehiclesListingFilters =
  (): VehiclesListingFiltersContextValue => {
    const context = useContext(VehiclesListingFiltersContext);
    if (!context) {
      throw new Error(
        "useDealershipVehiclesListingFilters debe usarse dentro de DealershipVehiclesFiltersProvider",
      );
    }
    return context;
  };

type DealershipVehiclesFiltersProviderProps = {
  slug: string;
  children: ReactNode;
};

export const DealershipVehiclesFiltersProvider = ({
  slug,
  children,
}: DealershipVehiclesFiltersProviderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const filters = useMemo(
    () => parseDealershipVehicleFilters(searchParams),
    [searchParams],
  );

  const urlKey = `${slug}?${searchParams.toString()}`;

  const parseCurrentUrl = useCallback(
    () => parseDealershipVehicleFilters(searchParams),
    [searchParams],
  );

  const [syncedUrlKey, setSyncedUrlKey] = useState(urlKey);
  const [searchInput, setSearchInput] = useState(filters.query || "");
  const [priceMin, setPriceMin] = useState(filters.since_price?.toString() || "");
  const [priceMax, setPriceMax] = useState(filters.until_price?.toString() || "");

  if (urlKey !== syncedUrlKey) {
    setSyncedUrlKey(urlKey);
    setSearchInput(filters.query || "");
    setPriceMin(filters.since_price?.toString() || "");
    setPriceMax(filters.until_price?.toString() || "");
  }

  const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [selectedEngines, setSelectedEngines] = useState<string[]>([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
  const [selectedDoors, setSelectedDoors] = useState<number[]>([]);
  const [selectedTrunks, setSelectedTrunks] = useState<string[]>([]);

  const sortValue = `${filters.order_by}-${orderDirectionToUrlSegment(
    filters.order_direction ?? "DESC",
  )}`;

  const pushFilters = useCallback(
    (nextFilters: FindAllVehiclesParams) => {
      router.push(buildDealershipVehicleHref(slug, nextFilters));
    },
    [router, slug],
  );

  const commitFilters = useCallback(
    (nextFilters: FindAllVehiclesParams) => {
      startTransition(() => {
        pushFilters(nextFilters);
      });
    },
    [pushFilters],
  );

  const resetLocalFilters = useCallback(() => {
    setSearchInput("");
    setPriceMin("");
    setPriceMax("");
    setSelectedGenerations([]);
    setSelectedVersions([]);
    setSelectedEngines([]);
    setSelectedBodyTypes([]);
    setSelectedDoors([]);
    setSelectedTrunks([]);
  }, []);

  const resetFilters = useCallback(() => {
    resetLocalFilters();
    router.push(`/concesionaria/${slug}`);
  }, [resetLocalFilters, router, slug]);

  const toggleArrayFilter = useCallback(
    (key: "fuel_type_slugs" | "traction_slugs", value: string) => {
      const current = (filters[key] as string[]) || [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      commitFilters({
        ...filters,
        [key]: next.length > 0 ? next : undefined,
        page: 1,
      });
    },
    [commitFilters, filters],
  );

  const handleSearch = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      pushFilters({
        ...filters,
        query: searchInput.trim() || undefined,
        page: 1,
      });
    },
    [filters, pushFilters, searchInput],
  );

  const handleSortChange = useCallback(
    (value: string) => {
      const match = value.match(/^(.+)-(asc|desc)$/i);
      if (!match) return;

      const direction = orderDirectionFromUrlSegment(match[2]);
      if (!direction) return;

      pushFilters({
        ...filters,
        order_by: match[1],
        order_direction: direction,
        page: 1,
      });
    },
    [filters, pushFilters],
  );

  const goToPage = useCallback(
    (page: number) => {
      pushFilters({ ...filters, page });
    },
    [filters, pushFilters],
  );

  const handlePriceBlur = useCallback(() => {
    commitFilters({
      ...filters,
      since_price: priceMin ? Number(priceMin) : undefined,
      until_price: priceMax ? Number(priceMax) : undefined,
      page: 1,
    });
  }, [commitFilters, filters, priceMax, priceMin]);

  const handleConditionChange = useCallback(
    (condition: "new" | "used" | undefined) => {
      commitFilters({ ...filters, condition, page: 1 });
    },
    [commitFilters, filters],
  );

  const handleBrandToggle = useCallback(
    (slugValue: string) => {
      if (!slugValue) {
        commitFilters({
          ...filters,
          makes_slugs: undefined,
          models_slugs: undefined,
          page: 1,
        });
        return;
      }

      const current = filters.makes_slugs ?? [];
      const next = current.includes(slugValue)
        ? current.filter((item) => item !== slugValue)
        : [...current, slugValue];

      commitFilters({
        ...filters,
        makes_slugs: next.length > 0 ? next : undefined,
        models_slugs: next.length > 0 ? filters.models_slugs : undefined,
        page: 1,
      });
    },
    [commitFilters, filters],
  );

  const handleMakeModelMultiChange = useCallback(
    (value: HierarchyMultiValue) => {
      commitFilters({
        ...filters,
        makes_slugs:
          value.parent_slugs.length > 0 ? value.parent_slugs : undefined,
        models_slugs:
          value.child_slugs.length > 0 ? value.child_slugs : undefined,
        page: 1,
      });
    },
    [commitFilters, filters],
  );

  const handleLocationMultiChange = useCallback(
    (value: HierarchyMultiValue) => {
      commitFilters({
        ...filters,
        provinces_slugs:
          value.parent_slugs.length > 0 ? value.parent_slugs : undefined,
        municipalities_slugs:
          value.child_slugs.length > 0 ? value.child_slugs : undefined,
        page: 1,
      });
    },
    [commitFilters, filters],
  );

  const handleGenerationToggle = useCallback(
    (label: string, since: number, until: number) => {
      const active = selectedGenerations.includes(label);
      setSelectedGenerations((prev) =>
        active ? prev.filter((item) => item !== label) : [...prev, label],
      );
      commitFilters({
        ...filters,
        since_year: active ? undefined : since,
        until_year: active ? undefined : until,
        page: 1,
      });
    },
    [commitFilters, filters, selectedGenerations],
  );

  const handleVersionToggle = useCallback((version: string) => {
    toggleLocalSelection(version, setSelectedVersions);
  }, []);

  const handleEngineToggle = useCallback((engine: string) => {
    toggleLocalSelection(engine, setSelectedEngines);
  }, []);

  const handleFuelToggle = useCallback(
    (slugValue: string) => {
      toggleArrayFilter("fuel_type_slugs", slugValue);
    },
    [toggleArrayFilter],
  );

  const handleBodyTypeToggle = useCallback((slugValue: string) => {
    toggleLocalSelection(slugValue, setSelectedBodyTypes);
  }, []);

  const handleDoorToggle = useCallback((door: number) => {
    toggleLocalSelection(door, setSelectedDoors);
  }, []);

  const handleTrunkToggle = useCallback((trunk: string) => {
    toggleLocalSelection(trunk, setSelectedTrunks);
  }, []);

  const handleTractionToggle = useCallback(
    (slugValue: string) => {
      toggleArrayFilter("traction_slugs", slugValue);
    },
    [toggleArrayFilter],
  );

  const activeFilterChips = useMemo(() => {
    const chips: FilterChip[] = [];

    if (filters.query) {
      chips.push({
        key: "query",
        label: `Búsqueda: ${filters.query}`,
        onRemove: () => {
          setSearchInput("");
          commitFilters({ ...filters, query: undefined, page: 1 });
        },
      });
    }
    if (filters.condition) {
      chips.push({
        key: "condition",
        label: getConditionLabel(filters.condition),
        onRemove: () => commitFilters({ ...filters, condition: undefined, page: 1 }),
      });
    }
    filters.makes_slugs?.forEach((slugValue) => {
      chips.push({
        key: `make-${slugValue}`,
        label: slugValue,
        onRemove: () => handleBrandToggle(slugValue),
      });
    });
    filters.models_slugs?.forEach((slugValue) => {
      chips.push({
        key: `model-${slugValue}`,
        label: slugValue,
        onRemove: () => {
          const next_models = filters.models_slugs?.filter(
            (item) => item !== slugValue,
          );
          commitFilters({
            ...filters,
            models_slugs: next_models?.length ? next_models : undefined,
            page: 1,
          });
        },
      });
    });
    filters.provinces_slugs?.forEach((slugValue) => {
      chips.push({
        key: `province-${slugValue}`,
        label: slugValue,
        onRemove: () => {
          const next_provinces = filters.provinces_slugs?.filter(
            (item) => item !== slugValue,
          );
          commitFilters({
            ...filters,
            provinces_slugs: next_provinces?.length ? next_provinces : undefined,
            page: 1,
          });
        },
      });
    });
    filters.municipalities_slugs?.forEach((slugValue) => {
      chips.push({
        key: `municipality-${slugValue}`,
        label: slugValue,
        onRemove: () => {
          const next_municipalities = filters.municipalities_slugs?.filter(
            (item) => item !== slugValue,
          );
          commitFilters({
            ...filters,
            municipalities_slugs: next_municipalities?.length
              ? next_municipalities
              : undefined,
            page: 1,
          });
        },
      });
    });
    filters.fuel_type_slugs?.forEach((slugValue) => {
      chips.push({
        key: `fuel-${slugValue}`,
        label: slugValue,
        onRemove: () => toggleArrayFilter("fuel_type_slugs", slugValue),
      });
    });
    filters.traction_slugs?.forEach((slugValue) => {
      chips.push({
        key: `traction-${slugValue}`,
        label: slugValue,
        onRemove: () => toggleArrayFilter("traction_slugs", slugValue),
      });
    });

    return chips;
  }, [commitFilters, filters, handleBrandToggle, toggleArrayFilter]);

  const value = useMemo(
    () => ({
      filters,
      commitFilters,
      priceMin,
      priceMax,
      selectedGenerations,
      selectedVersions,
      selectedEngines,
      selectedBodyTypes,
      selectedDoors,
      selectedTrunks,
      sortValue,
      searchInput,
      setSearchInput,
      handleSearch,
      handleSortChange,
      handleConditionChange,
      handleBrandToggle,
      handleMakeModelMultiChange,
      handleLocationMultiChange,
      handlePriceMinChange: setPriceMin,
      handlePriceMaxChange: setPriceMax,
      handlePriceBlur,
      handleGenerationToggle,
      handleVersionToggle,
      handleEngineToggle,
      handleFuelToggle,
      handleBodyTypeToggle,
      handleDoorToggle,
      handleTrunkToggle,
      handleTractionToggle,
      resetFilters,
      goToPage,
      activeFilterChips,
      parseCurrentUrl,
    }),
    [
      activeFilterChips,
      commitFilters,
      filters,
      goToPage,
      handleBodyTypeToggle,
      handleBrandToggle,
      handleMakeModelMultiChange,
      handleLocationMultiChange,
      handleConditionChange,
      handleDoorToggle,
      handleEngineToggle,
      handleFuelToggle,
      handleGenerationToggle,
      handlePriceBlur,
      handleSearch,
      handleSortChange,
      handleTractionToggle,
      handleTrunkToggle,
      handleVersionToggle,
      parseCurrentUrl,
      priceMax,
      priceMin,
      resetFilters,
      searchInput,
      selectedBodyTypes,
      selectedDoors,
      selectedEngines,
      selectedGenerations,
      selectedTrunks,
      selectedVersions,
      sortValue,
    ],
  );

  return (
    <VehiclesListingFiltersContext.Provider value={value}>
      {children}
    </VehiclesListingFiltersContext.Provider>
  );
};
