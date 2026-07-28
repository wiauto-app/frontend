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

const buildModelTriggerLabel = (
  selectedModels: HeroCatalogFacetItem[],
): string => {
  if (!selectedModels.length) {
    return "Modelo";
  }

  return selectedModels.map((model) => model.name).join(", ");
};

export const HeroFiltersModelSelector = () => {
  const {
    selectedMakes,
    selectedModels,
    handleToggleModel,
    facetQueryParams,
  } = useHeroSearchFilters();
  const [search, setSearch] = useState("");
  const debounced_search = useDebouncedValue(search, 300);

  const make_slugs = useMemo(
    () => selectedMakes.map((make) => make.slug),
    [selectedMakes],
  );

  const model_cascade_filters = useMemo(
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

  const { data: models = [], isLoading } = useQuery({
    queryKey: [
      "hero-facets",
      "models",
      make_slugs,
      model_cascade_filters,
      debounced_search,
    ],
    queryFn: () =>
      heroFacetService.getModels(
        make_slugs.length > 0 ? make_slugs : undefined,
        model_cascade_filters,
        debounced_search.trim() || undefined,
      ),
  });

  const selected_model_ids = useMemo(
    () => new Set(selectedModels.map((model) => model.id)),
    [selectedModels],
  );

  const trigger_label = useMemo(
    () => buildModelTriggerLabel(selectedModels),
    [selectedModels],
  );

  const handleModelCheckedChange = (
    model: HeroCatalogFacetItem,
    checked: boolean,
  ) => {
    handleToggleModel(model, checked);
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-start text-base"
            aria-label="Seleccionar modelo"
          >
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
          placeholder="Buscar modelo"
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
        {!isLoading && models.length === 0 && (
          <p className="px-1 py-2 text-sm text-muted-foreground">
            No hay modelos disponibles
          </p>
        )}
        {!isLoading &&
          models.map((model) => (
            <CustomCheckbox
              key={model.id}
              checked={selected_model_ids.has(model.id)}
              onChange={(event) =>
                handleModelCheckedChange(model, event.target.checked)
              }
              label={
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate">{model.name}</p>
                    {model.make_name ? (
                      <p className="truncate text-xs text-muted-foreground">
                        {model.make_name}
                      </p>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {model.vehicle_count}
                  </span>
                </div>
              }
            />
          ))}
      </PopoverContent>
    </Popover>
  );
};
