"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";


import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { Button } from "@/components/ui/button";
import { CustomCheckbox } from "@/components/ui/customCheckbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchInput } from "@/components/ui/searchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { heroFacetService } from "@/services/search/heroFacetService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useHeroSearchFilters } from "./HeroSearchFiltersContext";
import { Badge } from "../ui/badge";
import { WiautoImage } from "../ui/wiautoImage";

interface MakeModelsListProps {
  make: HeroCatalogFacetItem;
  isOpen: boolean;
  cascadeFilters: {
    province_slug?: string;
    municipality_slug?: string;
    until_price?: number;
  };
}

const buildMakeTriggerLabel = (
  selectedMakes: HeroCatalogFacetItem[],
  selectedModels: HeroCatalogFacetItem[],
): string => {
  if (selectedModels.length > 0) {
    return selectedModels.map((model) => model.name).join(", ");
  }

  if (selectedMakes.length > 0) {
    return selectedMakes.map((make) => make.name).join(", ");
  }

  return "Marca / modelo";
};

const MakeModelsList = ({
  make,
  isOpen,
  cascadeFilters,
}: MakeModelsListProps) => {
  const { selectedMakes, selectedModels, handleToggleMake, handleToggleModel } =
    useHeroSearchFilters();

  const { data: models = [], isLoading } = useQuery({
    queryKey: ["hero-facets", "models", make.slug, cascadeFilters],
    queryFn: () => heroFacetService.getModels([make.slug], cascadeFilters),
    enabled: isOpen,
  });

  const is_make_selected = selectedMakes.some(
    (selected_make) => selected_make.id === make.id,
  );
  const selected_models_for_make = selectedModels.filter(
    (model) => model.make_id === make.id || model.make_slug === make.slug,
  );
  const is_all_models_selected =
    is_make_selected && selected_models_for_make.length === 0;

  const selected_model_ids = useMemo(
    () => new Set(selectedModels.map((model) => model.id)),
    [selectedModels],
  );

  const handleAllModelsChange = (checked: boolean) => {
    if (checked) {
      selected_models_for_make.forEach((model) => {
        handleToggleModel(model, false);
      });
      handleToggleMake(make, true);
      return;
    }

    handleToggleMake(make, false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 pl-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-8 w-full rounded-sm bg-muted-foreground/20"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pl-1">
      <CustomCheckbox
        checked={is_all_models_selected}
        onChange={(event) => handleAllModelsChange(event.target.checked)}
        label={
          <div className="flex w-full items-center justify-between gap-2">
            <p className="truncate font-medium">Todos los modelos</p>
            <span className="shrink-0 text-xs text-muted-foreground">
              {make.vehicle_count}
            </span>
          </div>
        }
      />
      {models.length === 0 ? (
        <p className="px-1 py-1 text-sm text-muted-foreground">
          No hay modelos disponibles
        </p>
      ) : (
        models.map((model) => (
          <CustomCheckbox
            key={model.id}
            checked={selected_model_ids.has(model.id)}
            onChange={(event) => handleToggleModel(model, event.target.checked)}
            label={
              <div className="flex w-full items-center justify-between gap-2">
                <p className="truncate">{model.name}</p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {model.vehicle_count}
                </span>
              </div>
            }
          />
        ))
      )}
    </div>
  );
};

export const HeroFiltersMakeSelector = () => {
  const { selectedMakes, selectedModels, facetQueryParams } =
    useHeroSearchFilters();
  const [search, setSearch] = useState("");
  const [open_values, setOpenValues] = useState<string[]>([]);
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

  const open_value_set = useMemo(() => new Set(open_values), [open_values]);

  const trigger_label = useMemo(
    () => buildMakeTriggerLabel(selectedMakes, selectedModels),
    [selectedMakes, selectedModels],
  );

  const handleAccordionValueChange = (value: string | string[]) => {
    setOpenValues(Array.isArray(value) ? value : value ? [value] : []);
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="w-full justify-start text-base"
            aria-label="Seleccionar marca y modelo"
          >
            <div className="flex w-full items-center justify-between text-sm">
              <span className="truncate">{trigger_label}</span>
              <ChevronDown className="size-4 shrink-0 opacity-50" />
            </div>
          </Button>
        }
      />
      <PopoverContent
        align="end"
        className="flex w-full md:w-96  flex-col gap-2 "
      >
        <SearchInput
          placeholder="Buscar marca"
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
          aria-label="Buscar marca"
        />
        <div className=" max-h-96 overflow-y-auto">
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
          {!isLoading && makes.length === 0 && (
            <p className="px-1 py-2 text-sm text-muted-foreground">
              No hay marcas disponibles
            </p>
          )}
          {!isLoading && makes.length > 0 && (
            <Accordion
              multiple
              value={open_values}
              onValueChange={handleAccordionValueChange}
              className="w-full flex flex-col gap-2"
            >
              {makes.map((make) => {
                const make_value = String(make.id);
                const is_open = open_value_set.has(make_value);

                return (
                  <AccordionItem className="border px-2 rounded-md" value={make_value} key={make.id}>
                    <AccordionTrigger className="py-3 **:data-[slot=accordion-trigger-icon]:!text-primary">
                      <div className="flex w-full items-center justify-between gap-2 pr-2">
                        <div className="flex min-w-0 items-center gap-2">
                          {make.image_url ? (
                            <WiautoImage
                              src={make.image_url}
                              alt=""
                              width={30}
                              height={30}
                              sizes="15px"
                              className=" shrink-0 rounded-sm object-contain"
                              aria-hidden
                            />
                          ) : null}
                          <span className="truncate">{make.name}</span>
                        </div>
                        <Badge className="shrink-0 text-xs font-normal text-muted-foreground bg-primary/10 text-primary">
                          {make.vehicle_count} Vehículos
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <MakeModelsList
                        make={make}
                        isOpen={is_open}
                        cascadeFilters={make_cascade_filters}
                      />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
