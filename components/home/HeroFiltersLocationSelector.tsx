"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchInput } from "@/components/ui/searchInput";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocationSelectorData } from "@/components/selectors/FilterLocationSelector/hooks/useLocationSelectorData";
import { LocationSelectorItem } from "@/components/selectors/FilterLocationSelector/locationSelectorItem";
import type { LocationSelectedItem } from "@/components/selectors/FilterLocationSelector/interfaces/locationSelector.interface";
import type { LocationUrlPayload } from "@/components/selectors/FilterLocationSelector/utils/location-selection";
import { ProvinceQuickBadges } from "@/components/selectors/ProvinceQuickBadges";
import type { ProvinceQuickBadgeItem } from "@/components/selectors/utils/build-province-badges";
import { buildHeroListingHref } from "@/lib/vehicles/listing-url";
import { useOptionalHeroSearchFilters } from "./HeroSearchFiltersContext";

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

export interface HeroFiltersLocationSelectorProps {
  navigateOnSelect?: boolean;
  onNavigate?: (href: string) => void;
  showQuickBadges?: boolean;
  quickBadgeLimit?: number;
  quickBadgeProvinces?: ProvinceQuickBadgeItem[];
  placeholder?: string;
}

export const HeroFiltersLocationSelector = ({
  navigateOnSelect = false,
  onNavigate,
  showQuickBadges = false,
  quickBadgeLimit = 7,
  quickBadgeProvinces = [],
  placeholder = "Ubicación",
}: HeroFiltersLocationSelectorProps = {}) => {
  const router = useRouter();
  const hero_context = useOptionalHeroSearchFilters();
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

  const handleApplyLocationPayload = useCallback(
    (payload: LocationUrlPayload) => {
      if (navigateOnSelect) {
        const href = buildHeroListingHref(payload);
        if (onNavigate) {
          onNavigate(href);
          return;
        }
        router.push(href);
        return;
      }

      if (!hero_context) {
        throw new Error(
          "HeroFiltersLocationSelector requiere HeroSearchFiltersProvider cuando navigateOnSelect es false",
        );
      }

      hero_context.setLocationPayload(payload);
    },
    [hero_context, navigateOnSelect, onNavigate, router],
  );

  const trigger_label = useMemo(() => {
    if (navigateOnSelect) {
      return placeholder;
    }

    return buildLocationTriggerLabel(selectedItems, provinces, municipalities);
  }, [
    municipalities,
    navigateOnSelect,
    placeholder,
    provinces,
    selectedItems,
  ]);

  return (
    <div className="flex flex-col">
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" className="w-full justify-start text-base" aria-label="Seleccionar ubicación">
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
            aria-label="Buscar ubicación"
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
                onApplyLocationPayload={handleApplyLocationPayload}
              />
            ))}
        </PopoverContent>
      </Popover>
      {showQuickBadges ? (
        <ProvinceQuickBadges
          provinces={quickBadgeProvinces}
          limit={quickBadgeLimit}
        />
      ) : null}
    </div>
  );
};
