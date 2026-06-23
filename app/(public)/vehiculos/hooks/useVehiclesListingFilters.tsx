"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import type { HierarchyMultiValue } from "@/components/selectors/types";
import type { FindAllVehiclesParams } from "@/interfaces/vehicle.interface";
import {
  buildVehicleListingHref,
  orderDirectionFromUrlSegment,
  orderDirectionToUrlSegment,
  parseVehicleListingUrl,
} from "@/lib/vehicles/listing-url";
import { getConditionLabel } from "../utils";

type FilterChip = {
  key: string;
  label: string;
  onRemove: () => void;
};

export type VehiclesListingFiltersContextValue = {
  filters: FindAllVehiclesParams;
  commitFilters: (nextFilters: FindAllVehiclesParams) => void;
  priceMin: string;
  priceMax: string;
  selectedGenerations: string[];
  selectedVersions: string[];
  selectedEngines: string[];
  selectedBodyTypes: string[];
  selectedDoors: number[];
  selectedTrunks: string[];
  sortValue: string;
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearch: (event: FormEvent) => void;
  handleSortChange: (value: string) => void;
  handleConditionChange: (condition: "new" | "used" | undefined) => void;
  handleBrandToggle: (slug: string) => void;
  handleMakeModelMultiChange: (value: HierarchyMultiValue) => void;
  handleLocationMultiChange: (value: HierarchyMultiValue) => void;
  handlePriceMinChange: (value: string) => void;
  handlePriceMaxChange: (value: string) => void;
  handlePriceBlur: () => void;
  handleGenerationToggle: (label: string, since: number, until: number) => void;
  handleVersionToggle: (version: string) => void;
  handleEngineToggle: (engine: string) => void;
  handleFuelToggle: (slug: string) => void;
  handleBodyTypeToggle: (slug: string) => void;
  handleDoorToggle: (door: number) => void;
  handleTrunkToggle: (trunk: string) => void;
  handleTractionToggle: (slug: string) => void;
  resetFilters: () => void;
  goToPage: (page: number) => void;
  activeFilterChips: FilterChip[];
  parseCurrentUrl: () => FindAllVehiclesParams;
};

const VehiclesListingFiltersContext =
  createContext<VehiclesListingFiltersContextValue | null>(null);

export { VehiclesListingFiltersContext };

const resolveSlugArray = (slug: string | string[] | undefined): string[] => {
  if (!slug) {
    return [];
  }
  return Array.isArray(slug) ? slug : [slug];
};

const toggleLocalSelection = <T,>(
  value: T,
  setter: React.Dispatch<React.SetStateAction<T[]>>,
) => {
  setter((prev) =>
    prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
  );
};

export const useVehiclesListingFilters = (): VehiclesListingFiltersContextValue => {
  const context = useContext(VehiclesListingFiltersContext);
  if (!context) {
    throw new Error(
      "useVehiclesListingFilters debe usarse dentro de VehiclesListingFiltersProvider",
    );
  }
  return context;
};

type VehiclesListingFiltersProviderProps = {
  children: ReactNode;
};

export const VehiclesListingFiltersProvider = ({
  children,
}: VehiclesListingFiltersProviderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routeParams = useParams();
  const slugSegments = resolveSlugArray(routeParams.slug);
  const [, startTransition] = useTransition();

  const filters = useMemo(
    () => parseVehicleListingUrl(slugSegments, searchParams),
    [searchParams, slugSegments],
  );

  const urlKey = `${slugSegments.join("/")}?${searchParams.toString()}`;

  const parseCurrentUrl = useCallback(
    () => parseVehicleListingUrl(slugSegments, searchParams),
    [searchParams, slugSegments],
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
      router.push(buildVehicleListingHref(nextFilters));
    },
    [router],
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
    router.push("/vehiculos");
  }, [resetLocalFilters, router]);

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
    (slug: string) => {
      if (!slug) {
        commitFilters({
          ...filters,
          makes_slugs: undefined,
          models_slugs: undefined,
          page: 1,
        });
        return;
      }

      const current = filters.makes_slugs ?? [];
      const next = current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug];

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
    (slug: string) => {
      toggleArrayFilter("fuel_type_slugs", slug);
    },
    [toggleArrayFilter],
  );

  const handleBodyTypeToggle = useCallback((slug: string) => {
    toggleLocalSelection(slug, setSelectedBodyTypes);
  }, []);

  const handleDoorToggle = useCallback((door: number) => {
    toggleLocalSelection(door, setSelectedDoors);
  }, []);

  const handleTrunkToggle = useCallback((trunk: string) => {
    toggleLocalSelection(trunk, setSelectedTrunks);
  }, []);

  const handleTractionToggle = useCallback(
    (slug: string) => {
      toggleArrayFilter("traction_slugs", slug);
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
    filters.makes_slugs?.forEach((slug) => {
      chips.push({
        key: `make-${slug}`,
        label: slug,
        onRemove: () => handleBrandToggle(slug),
      });
    });
    filters.models_slugs?.forEach((slug) => {
      chips.push({
        key: `model-${slug}`,
        label: slug,
        onRemove: () => {
          const next_models = filters.models_slugs?.filter(
            (item) => item !== slug,
          );
          commitFilters({
            ...filters,
            models_slugs: next_models?.length ? next_models : undefined,
            page: 1,
          });
        },
      });
    });
    filters.provinces_slugs?.forEach((slug) => {
      chips.push({
        key: `province-${slug}`,
        label: slug,
        onRemove: () => {
          const next_provinces = filters.provinces_slugs?.filter(
            (item) => item !== slug,
          );
          commitFilters({
            ...filters,
            provinces_slugs: next_provinces?.length
              ? next_provinces
              : undefined,
            page: 1,
          });
        },
      });
    });
    filters.municipalities_slugs?.forEach((slug) => {
      chips.push({
        key: `municipality-${slug}`,
        label: slug,
        onRemove: () => {
          const next_municipalities = filters.municipalities_slugs?.filter(
            (item) => item !== slug,
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
    filters.fuel_type_slugs?.forEach((slug) => {
      chips.push({
        key: `fuel-${slug}`,
        label: slug,
        onRemove: () => toggleArrayFilter("fuel_type_slugs", slug),
      });
    });
    filters.traction_slugs?.forEach((slug) => {
      chips.push({
        key: `traction-${slug}`,
        label: slug,
        onRemove: () => toggleArrayFilter("traction_slugs", slug),
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
