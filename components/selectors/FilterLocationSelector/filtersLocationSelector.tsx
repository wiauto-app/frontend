"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { useActiveFiltersStore } from "@/app/(public)/vehiculos/stores/activeFiltersStore";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/searchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

import { useGeolocationLocationFilter } from "./hooks/useGeolocationLocationFilter";
import { useLocationSelectorData } from "./hooks/useLocationSelectorData";
import { NearbyLocationFilter } from "./nearbyLocationFilter";
import { LocationSelectorItem } from "./locationSelectorItem";
import { useSelectedLocationItemsStore } from "./stores/selectedLocationItemsStore";
import {
  buildLocationSelectorSyncSignature,
  syncLocationSelectorFromActiveFilters,
} from "./utils/syncFromActiveFilters";

export const FiltersLocationSelector = () => {
  const { activeFilters } = useActiveFiltersStore();
  const [selectedProvinces, setSelectedProvinces] = useState<
    HeroCatalogFacetItem[]
  >([]);

  const { selectedItems, setSelectedItems } = useSelectedLocationItemsStore();
  const geolocation_filter = useGeolocationLocationFilter();
  const { isActive: is_geo_active, radiusKmLabel } = geolocation_filter;
  const {
    provinces,
    municipalities,
    isLoading,
    isLoadingMunicipalities,
    search,
    setSearch,
  } = useLocationSelectorData(selectedProvinces);

  const sync_signature = useMemo(
    () => buildLocationSelectorSyncSignature(activeFilters),
    [activeFilters],
  );

  const last_synced_signature = useRef<string | null>(null);
  const synced_with_facet_municipalities = useRef(false);

  const needs_municipality_discovery = useMemo(
    () =>
      Boolean(
        activeFilters?.resolved.municipalities.length &&
        !activeFilters.resolved.provinces.length &&
        selectedProvinces.length === 0 &&
        provinces.length > 0,
      ),
    [activeFilters, provinces.length, selectedProvinces.length],
  );

  useEffect(() => {
    if (!needs_municipality_discovery) {
      return;
    }
    setSelectedProvinces(provinces);
  }, [needs_municipality_discovery, provinces]);

  useEffect(() => {
    if (!is_geo_active) {
      return;
    }
    setSelectedProvinces([]);
    setSelectedItems([]);
  }, [is_geo_active, setSelectedItems]);

  useEffect(() => {
    if (!activeFilters || sync_signature == null) {
      if (last_synced_signature.current != null) {
        setSelectedProvinces([]);
        setSelectedItems([]);
        last_synced_signature.current = null;
        synced_with_facet_municipalities.current = false;
      }
      return;
    }

    if (provinces.length === 0) {
      return;
    }

    const signature_unchanged =
      last_synced_signature.current === sync_signature;
    const needs_municipalities_resync =
      signature_unchanged &&
      !synced_with_facet_municipalities.current &&
      municipalities.length > 0;

    if (signature_unchanged && !needs_municipalities_resync) {
      return;
    }

    const { selected_items, expanded_provinces } =
      syncLocationSelectorFromActiveFilters(
        activeFilters,
        provinces,
        municipalities,
      );

    setSelectedProvinces(expanded_provinces);
    setSelectedItems(selected_items);
    last_synced_signature.current = sync_signature;
    synced_with_facet_municipalities.current = municipalities.length > 0;
  }, [
    activeFilters,
    municipalities,
    provinces,
    setSelectedItems,
    sync_signature,
  ]);

  const trigger_label = useMemo(() => {
    if (is_geo_active) {
      return `Cerca de mi ubicación · ${radiusKmLabel}`;
    }
    if (!selectedItems.length) {
      return "Selecciona una ubicación";
    }
    const province_names = activeFilters?.resolved.provinces
      .map((province) => province.name)
      .join(", ");
    const municipality_names = activeFilters?.resolved.municipalities
      .map((municipality) => municipality.name)
      .join(", ");
    return `${province_names ?? ""} ${municipality_names ? `· ${municipality_names}` : ""}`.trim();
  }, [
    activeFilters?.resolved.municipalities,
    activeFilters?.resolved.provinces,
    is_geo_active,
    radiusKmLabel,
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
        <NearbyLocationFilter {...geolocation_filter} />
        <div>
          <SearchInput
            placeholder="Buscar provincia"
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
          />
        </div>
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
          provinces.map((province) => (
            <LocationSelectorItem
              selectedProvinces={selectedProvinces}
              setSelectedProvinces={setSelectedProvinces}
              isLoading={isLoadingMunicipalities}
              municipalities={municipalities}
              key={province.id}
              item={province}
            />
          ))}
       
      </PopoverContent>
    </Popover>
  );
};
