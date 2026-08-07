"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";
import { NavbarPublishButton } from "../navbar/components/NavbarPublishButton";
import { PriceUntilSelector } from "../selectors/priceUntilSelector";
// import { useDebouncedValue } from "@/hooks/useDebouncedValue";
// import { heroFacetService } from "@/services/search/heroFacetService";
import { cn } from "@/lib/utils";
import {
  HeroSearchFiltersProvider,
  useHeroSearchFilters,
} from "./HeroSearchFiltersContext";
import { HeroFiltersMakeSelector } from "./HeroFiltersMakeSelector";
// import { HeroFiltersModelSelector } from "./HeroFiltersModelSelector";
import { HeroFiltersLocationSelector } from "./HeroFiltersLocationSelector";
import { HeroReferenceSearch } from "./HeroReferenceSearch";

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

const HeroModeToggle = ({ mode, onModeChange }: HeroModeToggleProps) => {
  return (
    <div
      className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
      role="tablist"
      aria-label="Modo de búsqueda"
    >
      <Button
        type="button"
        role="tab"
        aria-selected={mode === "filters"}
        variant={mode === "filters" ? "default" : "ghost"}
        className={cn(
          "rounded-md",
          mode !== "filters" && "text-muted-foreground",
        )}
        onClick={() => onModeChange("filters")}
      >
        Filtros
      </Button>
      <Button
        type="button"
        role="tab"
        aria-selected={mode === "reference"}
        variant={mode === "reference" ? "default" : "ghost"}
        className={cn(
          "rounded-md",
          mode !== "reference" && "text-muted-foreground",
        )}
        onClick={() => onModeChange("reference")}
      >
        Referencia
      </Button>
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
      className="grid grid-cols-1 gap-4 md:w-84 w-full"
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
    <div className="min-w-xs space-y-2">
      <div className="grid w-full grid-cols-2 gap-1 rounded-xl bg-white p-2 lg:w-fit">
        <Button className="rounded-lg">Comprar</Button>
        <NavbarPublishButton variant="outline" className="rounded-lg" />
      </div>
      <Card size="sm" className="w-full">
        <CardContent className="space-y-4">
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
