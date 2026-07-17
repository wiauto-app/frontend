"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { Button } from "@/components/ui/button";
import { CustomCheckbox } from "@/components/ui/customCheckbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchInput } from "@/components/ui/searchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { heroFacetService } from "@/services/search/heroFacetService";
import { useHeroSearchFilters } from "./HeroSearchFiltersContext";

const buildMakeTriggerLabel = (
  selectedMakes: HeroCatalogFacetItem[],
): string => {
  if (!selectedMakes.length) {
    return "Marca";
  }

  return selectedMakes.map((make) => make.name).join(", ");
};

export const HeroFiltersMakeSelector = () => {
  const { selectedMakes, handleToggleMake, facetQueryParams } =
    useHeroSearchFilters();
  const [search, setSearch] = useState("");
  const debounced_search = useDebouncedValue(search, 300);

  const make_cascade_filters = useMemo(
    () => ({
      province_slug: facetQueryParams.province_slug,
      municipality_slug: facetQueryParams.municipality_slug,
      until_price: facetQueryParams.until_price,
    }),
    [
      facetQueryParams.municipality_slug,
      facetQueryParams.province_slug,
      facetQueryParams.until_price,
    ],
  );

  const { data: makes = [], isLoading } = useQuery({
    queryKey: ["hero-facets", "makes", make_cascade_filters, debounced_search],
    queryFn: () =>
      heroFacetService.getMakes(
        make_cascade_filters,
        debounced_search.trim() || undefined,
      ),
  });

  const selected_make_ids = useMemo(
    () => new Set(selectedMakes.map((make) => make.id)),
    [selectedMakes],
  );

  const trigger_label = useMemo(
    () => buildMakeTriggerLabel(selectedMakes),
    [selectedMakes],
  );

  const handleMakeCheckedChange = (
    make: HeroCatalogFacetItem,
    checked: boolean,
  ) => {
    handleToggleMake(make, checked);
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" className="w-full justify-start text-base">
            <div className="flex w-full items-center justify-between text-sm">
              <span className="truncate">{trigger_label}</span>
              <ChevronDown className="size-4 shrink-0 opacity-50" />
            </div>
          </Button>
        }
      />
      <PopoverContent
        align="start"
        className="flex max-h-80 flex-col gap-2 overflow-y-scroll"
      >
        <SearchInput
          placeholder="Buscar marca"
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
        />
        {isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-8 w-full rounded-sm bg-muted-foreground/20"
              />
            ))}
          </div>
        )}
        {!isLoading &&
          makes.map((make) => (
            <CustomCheckbox
              key={make.id}
              checked={selected_make_ids.has(make.id)}
              onChange={(event) =>
                handleMakeCheckedChange(make, event.target.checked)
              }
              label={
                <div className="flex w-full items-center justify-between">
                  <p>{make.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {make.vehicle_count}
                  </span>
                </div>
              }
            />
          ))}
      </PopoverContent>
    </Popover>
  );
};
