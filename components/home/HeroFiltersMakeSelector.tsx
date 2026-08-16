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
// import { heroFacetService } from "@/services/search/heroFacetService";
import { heroCatalogService } from "@/services/search/heroCatalogService";
import { useHeroSearchFilters } from "./HeroSearchFiltersContext";
import { VirtualizedAccordionList } from "./VirtualizedAccordionList";
import { VirtualizedCheckboxList } from "./VirtualizedCheckboxList";
// import { Badge } from "../ui/badge";
import { WiautoImage } from "../ui/wiautoImage";

interface MakeModelsListProps {
  make: HeroCatalogFacetItem;
  isOpen: boolean;
  // cascadeFilters: {
  //   province_slug?: string;
  //   municipality_slug?: string;
  //   until_price?: number;
  // };
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
  // cascadeFilters,
}: MakeModelsListProps) => {
  const { selectedMakes, selectedModels, handleToggleMake, handleToggleModel } =
    useHeroSearchFilters();

  // Facet OpenSearch (comentado: catálogo Postgres sin contadores)
  // const { data: models = [], isLoading } = useQuery({
  //   queryKey: ["hero-facets", "models", make.slug, cascadeFilters],
  //   queryFn: () => heroFacetService.getModels([make.slug], cascadeFilters),
  //   enabled: isOpen,
  // });

  const { data: models = [], isLoading } = useQuery({
    queryKey: ["hero-catalog", "models", make.id],
    queryFn: () =>
      heroCatalogService.getModels(make.id, undefined, {
        id: make.id,
        slug: make.slug,
        name: make.name,
      }),
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
            {/* <span className="shrink-0 text-xs text-muted-foreground">
              {make.vehicle_count}
            </span> */}
          </div>
        }
      />
      {models.length === 0 ? (
        <p className="px-1 py-1 text-sm text-muted-foreground">
          No hay modelos disponibles
        </p>
      ) : (
        <VirtualizedCheckboxList
          items={models}
          getItemKey={(model) => model.id}
          renderItem={(model) => (
            <CustomCheckbox
              checked={selected_model_ids.has(model.id)}
              onChange={(event) =>
                handleToggleModel(model, event.target.checked)
              }
              label={
                <div className="flex w-full items-center justify-between gap-2">
                  <p className="truncate">{model.name}</p>
                  {/* <span className="shrink-0 text-xs text-muted-foreground">
                    {model.vehicle_count}
                  </span> */}
                </div>
              }
            />
          )}
        />
      )}
    </div>
  );
};

export const HeroFiltersMakeSelector = () => {
  const {
    selectedMakes,
    selectedModels,
    // facetQueryParams,
  } = useHeroSearchFilters();
  const [search, setSearch] = useState("");
  const [open_values, setOpenValues] = useState<string[]>([]);
  const debounced_search = useDebouncedValue(search, 300);
  const [open, setOpen] = useState(false);

  // Cascada facet desactivada (catálogo completo sin filtros cruzados)
  // const make_cascade_filters = useMemo(
  //   () => ({
  //     province_slug: facetQueryParams.province_slug,
  //     municipality_slug: facetQueryParams.municipality_slug,
  //     until_price: facetQueryParams.until_price,
  //   }),
  //   [
  //     facetQueryParams.municipality_slug,
  //     facetQueryParams.province_slug,
  //     facetQueryParams.until_price,
  //   ],
  // );

  // Facet OpenSearch (comentado: catálogo Postgres sin contadores)
  // const { data: makes = [], isLoading } = useQuery({
  //   queryKey: ["hero-facets", "makes", make_cascade_filters, debounced_search],
  //   queryFn: () =>
  //     heroFacetService.getMakes(
  //       make_cascade_filters,
  //       debounced_search.trim() || undefined,
  //     ),
  // });

  const { data: makes = [], isLoading } = useQuery({
    queryKey: ["hero-catalog", "makes", debounced_search],
    queryFn: () =>
      heroCatalogService.getMakes(debounced_search.trim() || undefined),
  });

  const trigger_label = useMemo(
    () => buildMakeTriggerLabel(selectedMakes, selectedModels),
    [selectedMakes, selectedModels],
  );

  const handleAccordionValueChange = (value: string | string[]) => {
    setOpenValues(Array.isArray(value) ? value : value ? [value] : []);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
        side="bottom"
        className="flex w-full md:w-96  flex-col gap-2 "
      >
        <SearchInput
          placeholder="Buscar marca"
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
          aria-label="Buscar marca"
        />
        {isLoading && (
          <div className="flex h-60 flex-col gap-2 overflow-y-auto">
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
          <VirtualizedAccordionList
            items={makes}
            getItemKey={(make) => make.id}
            getItemValue={(make) => String(make.id)}
            openValues={open_values}
            onOpenValuesChange={handleAccordionValueChange}
            renderTrigger={(make) => (
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
                {/* <Badge className="shrink-0 text-xs font-normal text-muted-foreground bg-primary/10 text-primary">
                  {make.vehicle_count} Vehículos
                </Badge> */}
              </div>
            )}
            renderContent={(make, is_open) => (
              <MakeModelsList
                make={make}
                isOpen={is_open}
                // cascadeFilters={make_cascade_filters}
              />
            )}
          />
        )}
        <div className="flex items-center justify-end gap-2">
          <Button onClick={() => setOpen(false)} variant="outline" size="sm">
            Cancelar
          </Button>
          <Button onClick={() => setOpen(false)} variant="default" size="sm">
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
