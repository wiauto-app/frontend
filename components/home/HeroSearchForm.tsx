"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FileText, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";
import { NavbarPublishButton } from "../navbar/components/NavbarPublishButton";
import { PriceUntilSelector } from "../selectors/priceUntilSelector";
// import { useDebouncedValue } from "@/hooks/useDebouncedValue";
// import { heroFacetService } from "@/services/search/heroFacetService";
import { cn } from "@/lib/utils";
import {
  CONDITION_VEHICLE,
  type ConditionVehicle,
} from "@/interfaces/vehicle.interface";
import {
  HeroSearchFiltersProvider,
  useHeroSearchFilters,
} from "./HeroSearchFiltersContext";
// import { HeroFiltersModelSelector } from "./HeroFiltersModelSelector";
import { HeroReferenceSearch } from "./HeroReferenceSearch";
import { Skeleton } from "../ui/skeleton";
import dynamic from "next/dynamic";

const HeroFiltersMakeSelector = dynamic(
  () =>
    import("./HeroFiltersMakeSelector").then(
      (mod) => mod.HeroFiltersMakeSelector,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-9" />,
  },
);
const HeroFiltersLocationSelector = dynamic(
  () =>
    import("./HeroFiltersLocationSelector").then(
      (mod) => mod.HeroFiltersLocationSelector,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-9" />,
  },
);
type HeroSearchMode = "filters" | "reference";

interface HeroModeToggleProps {
  mode: HeroSearchMode;
  onModeChange: (mode: HeroSearchMode) => void;
}

// CTA con conteo OpenSearch (comentado: label fijo sin hero-count)
// const buildSearchButtonLabel = (
//   count: number | undefined,
//   isLoading: boolean,
// ): string => {
//   if (isLoading && count === undefined) {
//     return "Buscando...";
//   }
//
//   if (count === 1) {
//     return "Buscar 1 coche";
//   }
//
//   return `Buscar ${count ?? 0} coches`;
// };

const SEARCH_BUTTON_LABEL = "Buscar coches";

interface HeroConditionOption {
  value: ConditionVehicle;
  label: string;
}

const HERO_CONDITION_OPTIONS: HeroConditionOption[] = [
  { value: CONDITION_VEHICLE.USED, label: "Segunda mano" },
  { value: CONDITION_VEHICLE.NEW, label: "Nuevos" },
];

const HeroConditionTabs = () => {
  const { condition, setCondition } = useHeroSearchFilters();

  return (
    <div
      className="grid w-full grid-cols-3 gap-1 lg:w-[28rem]"
      role="group"
      aria-label="Tipo de vehículo"
    >
      {HERO_CONDITION_OPTIONS.map((option) => {
        const isActive = condition === option.value;

        return (
          <Button
            key={option.value}
            type="button"
            variant={isActive ? "default" : "outline"}
            aria-pressed={isActive}
            className={cn("rounded-lg", !isActive && "text-foreground")}
            onClick={() => setCondition(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
      <NavbarPublishButton
        variant="outline"
        className="rounded-lg w-full h-full text-foreground"
      />
    </div>
  );
};

const HeroModeToggle = ({ mode, onModeChange }: HeroModeToggleProps) => {
  return (
    <div
      className="grid grid-cols-2"
      role="tablist"
      aria-label="Modo de búsqueda"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "filters"}
        className={cn(
          "py-1 flex items-center gap-2 justify-center relative rounded-none border-b-2 border-transparent bg-transparent",
          "hover:bg-transparent hover:text-primary",
          mode === "filters"
            ? "border-primary text-primary"
            : "text-muted-foreground",
        )}
        onClick={() => onModeChange("filters")}
      >
        <SlidersHorizontal className="size-4" />
        Filtros
      </button>

      <button
        role="tab"
        aria-selected={mode === "reference"}
        className={cn(
          "py-2 flex items-center gap-2 justify-center relative rounded-none  border-b-2 border-transparent bg-transparent",
          "hover:bg-transparent hover:text-primary",
          mode === "reference"
            ? "border-primary text-primary"
            : "text-muted-foreground",
        )}
        onClick={() => onModeChange("reference")}
      >
        <FileText className="size-4" />
        Referencia
      </button>
    </div>
  );
};

const HeroFiltersSearchForm = () => {
  const router = useRouter();
  const {
    buildListingHref,
    // facetQueryParams,
  } = useHeroSearchFilters();

  // Facet OpenSearch hero-count (comentado: CTA fijo)
  // const debounced_facet_params = useDebouncedValue(facetQueryParams, 250);
  // const { data, isPending, isLoading, isFetching } = useQuery({
  //   queryKey: ["hero-count", debounced_facet_params],
  //   queryFn: () => heroFacetService.getCount(debounced_facet_params),
  //   placeholderData: keepPreviousData,
  // });
  // const count = data?.count;
  // const is_count_loading = isPending || isFetching;
  // const search_label = buildSearchButtonLabel(count, is_count_loading);

  const handleSearch = () => {
    router.push(buildListingHref());
  };

  return (
    <form
      className="grid grid-cols-1 gap-2  lg:grid-cols-4  w-full"
      onSubmit={(event) => {
        event.preventDefault();
        handleSearch();
      }}
    >
      <HeroFiltersMakeSelector />
      {/* <HeroFiltersModelSelector /> */}
      <HeroFiltersLocationSelector />
      <PriceUntilSelector />
      <Button type="submit" aria-label={SEARCH_BUTTON_LABEL}>
        <Search className="size-4" />
        {SEARCH_BUTTON_LABEL}
      </Button>
    </form>
  );
};

const HeroSearchFormContent = () => {
  const [mode, setMode] = useState<HeroSearchMode>("filters");

  const handleModeChange = (next_mode: HeroSearchMode) => {
    setMode(next_mode);
  };

  return (
    <div className=" w-full  space-y-2">
      <HeroConditionTabs />
      <Card className="w-full pt-1 pb-4">
        <CardContent className="space-y-2 px-4">
          <HeroModeToggle mode={mode} onModeChange={handleModeChange} />
          {mode === "filters" ? (
            <HeroFiltersSearchForm />
          ) : (
            <HeroReferenceSearch />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export function HeroSearchForm() {
  return (
    <HeroSearchFiltersProvider>
      <HeroSearchFormContent />
    </HeroSearchFiltersProvider>
  );
}
