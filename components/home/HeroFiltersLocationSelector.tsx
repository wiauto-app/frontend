"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
import { heroCatalogService } from "@/services/search/heroCatalogService";
import type { LocationSelectedItem } from "@/components/selectors/FilterLocationSelector/interfaces/locationSelector.interface";
import type { LocationUrlPayload } from "@/components/selectors/FilterLocationSelector/utils/location-selection";
import { buildLocationUrlPayload } from "@/components/selectors/FilterLocationSelector/utils/location-selection";
import { ProvinceQuickBadges } from "@/components/selectors/ProvinceQuickBadges";
import type { ProvinceQuickBadgeItem } from "@/components/selectors/utils/build-province-badges";
import { buildHeroListingHref } from "@/lib/vehicles/listing-url";
import { useOptionalHeroSearchFilters } from "./HeroSearchFiltersContext";
import { VirtualizedCheckboxList } from "./VirtualizedCheckboxList";

const buildLocationTriggerLabel = (
  selectedItems: LocationSelectedItem[],
  provinces: HeroCatalogFacetItem[],
  placeholder: string,
): string => {
  if (!selectedItems.length) {
    return placeholder;
  }

  const provinceBySlug = new Map(
    provinces.map((province) => [province.slug, province.name]),
  );

  const names = selectedItems
    .filter((item) => item.type === "province")
    .map((item) => provinceBySlug.get(item.slug) ?? item.slug)
    .filter(Boolean);

  return names.length > 0 ? names.join(", ") : placeholder;
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
  const [selectedItems, setSelectedItems] = useState<LocationSelectedItem[]>(
    [],
  );
  const [search, setSearch] = useState("");
  const debounced_search = useDebouncedValue(search, 300);

  const { data: provinces = [], isLoading } = useQuery({
    queryKey: ["hero-catalog", "provinces", debounced_search],
    queryFn: () =>
      heroCatalogService.getProvinces(debounced_search.trim() || undefined),
  });

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

  const handleApplySelection = useCallback(
    (next_items: LocationSelectedItem[]) => {
      setSelectedItems(next_items);
      handleApplyLocationPayload(buildLocationUrlPayload(next_items));
    },
    [handleApplyLocationPayload],
  );

  const handleSelectProvince = (
    checked: boolean,
    province: HeroCatalogFacetItem,
  ) => {
    if (checked) {
      handleApplySelection([
        ...selectedItems.filter(
          (item) =>
            !(item.type === "province" && item.province_id === province.id),
        ),
        {
          value: true,
          type: "province",
          slug: province.slug,
          province_id: province.id,
        },
      ]);
      return;
    }

    handleApplySelection(
      selectedItems.filter(
        (item) =>
          !(item.type === "province" && item.province_id === province.id),
      ),
    );
  };

  const selected_province_ids = useMemo(
    () =>
      new Set(
        selectedItems
          .filter((item) => item.type === "province")
          .map((item) => item.province_id),
      ),
    [selectedItems],
  );

  const trigger_label = useMemo(() => {
    if (navigateOnSelect) {
      return placeholder;
    }

    return buildLocationTriggerLabel(selectedItems, provinces, placeholder);
  }, [navigateOnSelect, placeholder, provinces, selectedItems]);

  return (
    <div className="flex flex-col">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className="w-full justify-start text-base"
              aria-label="Seleccionar ubicación"
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
          className="flex w-full flex-col gap-2 md:w-96"
        >
          <SearchInput
            placeholder="Buscar provincia"
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
            aria-label="Buscar provincia"
          />
          {isLoading ? (
            <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-8 w-full rounded-sm bg-muted-foreground/20"
                />
              ))}
            </div>
          ) : null}
          {!isLoading && provinces.length === 0 ? (
            <p className="px-1 py-2 text-sm text-muted-foreground">
              No hay provincias disponibles
            </p>
          ) : null}
          {!isLoading && provinces.length > 0 ? (
            <VirtualizedCheckboxList
              items={provinces}
              getItemKey={(province) => province.id}
              className="max-h-96 overflow-y-auto"
              renderItem={(province) => (
                <CustomCheckbox
                  checked={selected_province_ids.has(province.id)}
                  onChange={(event) =>
                    handleSelectProvince(event.target.checked, province)
                  }
                  label={
                    <p className="truncate font-medium">{province.name}</p>
                  }
                />
              )}
            />
          ) : null}
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
