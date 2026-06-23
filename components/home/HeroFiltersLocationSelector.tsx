"use client";

import { useMemo, useState } from "react";

import { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchInput } from "@/components/ui/searchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocationSelectorData } from "@/components/selectors/FilterLocationSelector/hooks/useLocationSelectorData";
import { LocationSelectorItem } from "@/components/selectors/FilterLocationSelector/locationSelectorItem";
import type { LocationSelectedItem } from "@/components/selectors/FilterLocationSelector/interfaces/locationSelector.interface";
import { useHeroSearchFilters } from "./HeroSearchFiltersContext";
import { ChevronDown } from "lucide-react";

const buildLocationTriggerLabel = (
  selectedItems: LocationSelectedItem[],
  provinces: HeroCatalogFacetItem[],
  municipalities: HeroCatalogFacetItem[],
): string => {
  if (!selectedItems.length) {
    return "Ubicación";
  }

  const provinceBySlug = new Map(
    provinces.map((province) => [province.slug, province.name]),
  );
  const municipalityBySlug = new Map(
    municipalities.map((municipality) => [municipality.slug, municipality.name]),
  );

  const names = selectedItems
    .map((item) => {
      if (item.type === "province") {
        return provinceBySlug.get(item.slug) ?? item.slug;
      }
      return municipalityBySlug.get(item.slug) ?? item.slug;
    })
    .filter(Boolean);

  return names.length > 0 ? names.join(", ") : "Ubicación";
};

export const HeroFiltersLocationSelector = () => {
  const { setLocationPayload } = useHeroSearchFilters();
  const [selectedProvinces, setSelectedProvinces] = useState<
    HeroCatalogFacetItem[]
  >([]);
  const [selectedItems, setSelectedItems] = useState<LocationSelectedItem[]>(
    [],
  );

  const {
    provinces,
    municipalities,
    isLoading,
    isLoadingMunicipalities,
    search,
    setSearch,
  } = useLocationSelectorData(selectedProvinces);

  const trigger_label = useMemo(
    () =>
      buildLocationTriggerLabel(selectedItems, provinces, municipalities),
    [municipalities, provinces, selectedItems],
  );

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" className="h-11 w-full justify-start text-base">
            <div className="flex items-center justify-between w-full text-sm ">
              {trigger_label}
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
          placeholder="Buscar provincia"
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
          provinces.map((province) => (
            <LocationSelectorItem
              key={province.id}
              item={province}
              municipalities={municipalities}
              isLoading={isLoadingMunicipalities}
              selectedProvinces={selectedProvinces}
              setSelectedProvinces={setSelectedProvinces}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              onApplyLocationPayload={setLocationPayload}
            />
          ))}
      </PopoverContent>
    </Popover>
  );
};
