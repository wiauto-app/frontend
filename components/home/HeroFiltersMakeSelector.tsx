"use client";

import { useMemo, useState } from "react";

import { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchInput } from "@/components/ui/searchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { useMakeSelectorData } from "@/components/selectors/FilterMakeSelector/hooks/useMakeSelectorData";
import { MakeSelectorItem } from "@/components/selectors/FilterMakeSelector/makeSelectorItem";
import type { SelectedItem } from "@/components/selectors/FilterMakeSelector/interfaces/makeSelector.interface";
import { useHeroSearchFilters } from "./HeroSearchFiltersContext";

const buildMakeModelTriggerLabel = (
  selectedItems: SelectedItem[],
  makes: HeroCatalogFacetItem[],
  models: HeroCatalogFacetItem[],
): string => {
  if (!selectedItems.length) {
    return "Selecciona una marca";
  }

  const makeBySlug = new Map(makes.map((make) => [make.slug, make.name]));
  const modelBySlug = new Map(models.map((model) => [model.slug, model.name]));

  const makeNames = selectedItems
    .filter((item) => item.type === "make")
    .map((item) => makeBySlug.get(item.slug) ?? item.slug);
  const modelNames = selectedItems
    .filter((item) => item.type === "model")
    .map((item) => modelBySlug.get(item.slug) ?? item.slug);

  const parts = [...makeNames, ...modelNames].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Selecciona una marca";
};

export const HeroFiltersMakeSelector = () => {
  const { setMakeModelPayload } = useHeroSearchFilters();
  const [selectedMakes, setSelectedMakes] = useState<HeroCatalogFacetItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const { makes, models, isLoading, isLoadingModels, search, setSearch } =
    useMakeSelectorData(selectedMakes);

  const trigger_label = useMemo(
    () => buildMakeModelTriggerLabel(selectedItems, makes, models),
    [makes, models, selectedItems],
  );

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" className="h-11 w-full justify-start text-base">
            {trigger_label}
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
            <MakeSelectorItem
              key={make.id}
              item={make}
              models={models}
              isLoading={isLoadingModels}
              selectedMakes={selectedMakes}
              setSelectedMakes={setSelectedMakes}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              onApplyMakeModelPayload={setMakeModelPayload}
            />
          ))}
      </PopoverContent>
    </Popover>
  );
};
