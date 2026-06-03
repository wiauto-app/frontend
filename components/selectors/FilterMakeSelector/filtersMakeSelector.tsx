"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { useActiveFiltersStore } from "@/app/(public)/vehiculos/stores/activeFiltersStore";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useMakeSelectorData } from "./hooks/useMakeSelectorData";
import { MakeSelectorItem } from "./makeSelectorItem";
import { useSelectedItemsStore } from "./stores/selectedItemsStore";
import {
  buildMakeSelectorSyncSignature,
  syncMakeSelectorFromActiveFilters,
} from "./utils/syncFromActiveFilters";
import { SearchInput } from "@/components/ui/searchInput";
import { Skeleton } from "@/components/ui/skeleton";

export const FiltersMakeSelector = () => {
  const { activeFilters } = useActiveFiltersStore();
  const [selectedMakes, setSelectedMakes] = useState<HeroCatalogFacetItem[]>(
    [],
  );

  const { selectedItems, setSelectedItems } = useSelectedItemsStore();
  const { makes, models, isLoading, isLoadingModels, search, setSearch } = useMakeSelectorData(
    selectedMakes,
  );

  const sync_signature = useMemo(
    () => buildMakeSelectorSyncSignature(activeFilters),
    [activeFilters],
  );

  const last_synced_signature = useRef<string | null>(null);
  const synced_with_facet_models = useRef(false);

  useEffect(() => {
    if (!activeFilters || sync_signature == null) {
      if (last_synced_signature.current != null) {
        setSelectedMakes([]);
        setSelectedItems([]);
        last_synced_signature.current = null;
        synced_with_facet_models.current = false;
      }
      return;
    }

    if (makes.length === 0) {
      return;
    }

    const signature_unchanged =
      last_synced_signature.current === sync_signature;
    const needs_models_resync =
      signature_unchanged &&
      !synced_with_facet_models.current &&
      models.length > 0;

    if (signature_unchanged && !needs_models_resync) {
      return;
    }

    const { selected_items, expanded_makes } =
      syncMakeSelectorFromActiveFilters(activeFilters, makes, models);

    setSelectedMakes(expanded_makes);
    setSelectedItems(selected_items);
    last_synced_signature.current = sync_signature;
    synced_with_facet_models.current = models.length > 0;
  }, [
    activeFilters,
    makes,
    models,
    setSelectedItems,
    sync_signature,
  ]);

  const trigger_label = useMemo(() => {
    if (!selectedItems.length) {
      return "Selecciona una marca";
    }
    const makes = activeFilters?.resolved.makes.map(make => make.name).join(", ");
    const models = activeFilters?.resolved.models.map(model => model.name).join(", ");
    return `${makes} ${models ? `· ${models}` : ""}`;
  }, [
    activeFilters?.resolved.makes,
    activeFilters?.resolved.models,
    selectedItems.length,
  ]);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" className="w-full justify-start">
            {trigger_label}
          </Button>
        }
      />
        <PopoverContent
          align="start"
          className="flex max-h-80 flex-col gap-2 overflow-y-scroll"
        >
          <div>
            <SearchInput placeholder="Buscar marca" value={search} onChange={setSearch} onClear={() => setSearch("")} />
          </div>
          {
            isLoading && (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 rounded-sm w-full bg-muted-foreground/20" />
                ))}
              </div>
            )
          }
          {!isLoading && makes.map((make) => (
            <MakeSelectorItem
              selectedMakes={selectedMakes}
              setSelectedMakes={setSelectedMakes}
              isLoading={isLoadingModels}
              models={models}
              key={make.id}
              item={make}
            />
          ))}
        </PopoverContent>
    </Popover>
  );
};
