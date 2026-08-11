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

type LocationSelectorValue =
  | LocationSelectedItem[]
  | string[];

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
  value?: LocationSelectorValue;

  onChange?: (items: LocationSelectorValue) => void;

  navigateOnSelect?: boolean;

  onNavigate?: (href: string) => void;

  showQuickBadges?: boolean;
  quickBadgeLimit?: number;
  quickBadgeProvinces?: ProvinceQuickBadgeItem[];
  placeholder?: string;
}

export const HeroFiltersLocationSelector = ({
  value = [],
  onChange,
  navigateOnSelect = false,
  onNavigate,
  showQuickBadges = false,
  quickBadgeLimit = 7,
  quickBadgeProvinces = [],
  placeholder = "Ubicación",
}: HeroFiltersLocationSelectorProps) => {
  const router = useRouter();
  const hero_context = useOptionalHeroSearchFilters();

  const [search, setSearch] = useState("");
  const debounced_search = useDebouncedValue(search, 300);

  const { data: provinces = [], isLoading } = useQuery({
    queryKey: ["hero-catalog", "provinces", debounced_search],
    queryFn: () =>
      heroCatalogService.getProvinces(
        debounced_search.trim() || undefined,
      ),
  });

  /**
   * Convierte SIEMPRE el value externo a
   * LocationSelectedItem[] para uso interno.
   *
   * string[] representa slugs:
   *
   * ["madrid", "barcelona"]
   *
   * LocationSelectedItem[] mantiene el formato original.
   */
  const selectedLocationItems = useMemo<LocationSelectedItem[]>(() => {
    if (value.length === 0) {
      return [];
    }

    if (typeof value[0] === "string") {
      const selectedSlugs = new Set(value as string[]);

      return provinces
        .filter((province) =>
          selectedSlugs.has(province.slug),
        )
        .map((province) => ({
          value: true,
          type: "province" as const,
          slug: province.slug,
          province_id: province.id,
        }));
    }

    return value as LocationSelectedItem[];
  }, [provinces, value]);

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
        return;
      }

      hero_context.setLocationPayload(payload);
    },
    [
      hero_context,
      navigateOnSelect,
      onNavigate,
      router,
    ],
  );

  const handleApplySelection = useCallback(
    (nextItems: LocationSelectedItem[]) => {
      /**
       * Si el value original era string[],
       * devolvemos string[].
       *
       * Si era LocationSelectedItem[],
       * devolvemos LocationSelectedItem[].
       */
      if (
        value.length === 0 ||
        typeof value[0] === "string"
      ) {
        onChange?.(
          nextItems.map((item) => item.slug),
        );
      } else {
        onChange?.(nextItems);
      }

      handleApplyLocationPayload(
        buildLocationUrlPayload(nextItems),
      );
    },
    [
      handleApplyLocationPayload,
      onChange,
      value,
    ],
  );

  const handleSelectProvince = useCallback(
    (
      checked: boolean,
      province: HeroCatalogFacetItem,
    ) => {
      if (checked) {
        const alreadySelected =
          selectedLocationItems.some(
            (item) =>
              item.type === "province" &&
              item.province_id === province.id,
          );

        if (alreadySelected) {
          return;
        }

        handleApplySelection([
          ...selectedLocationItems,
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
        selectedLocationItems.filter(
          (item) =>
            !(
              item.type === "province" &&
              item.province_id === province.id
            ),
        ),
      );
    },
    [
      handleApplySelection,
      selectedLocationItems,
    ],
  );

  /**
   * Aquí selectedLocationItems SIEMPRE es
   * LocationSelectedItem[], por lo que .filter()
   * siempre existe.
   */
  const selected_province_ids = useMemo(
    () =>
      new Set(
        selectedLocationItems
          .filter(
            (item) => item.type === "province",
          )
          .map(
            (item) => item.province_id,
          ),
      ),
    [selectedLocationItems],
  );

  const trigger_label = useMemo(() => {
    if (navigateOnSelect) {
      return placeholder;
    }

    return buildLocationTriggerLabel(
      selectedLocationItems,
      provinces,
      placeholder,
    );
  }, [
    navigateOnSelect,
    placeholder,
    provinces,
    selectedLocationItems,
  ]);

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
                <span className="truncate">
                  {trigger_label}
                </span>

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
              {Array.from({ length: 5 }).map(
                (_, index) => (
                  <Skeleton
                    key={index}
                    className="h-8 w-full rounded-sm bg-muted-foreground/20"
                  />
                ),
              )}
            </div>
          ) : null}

          {!isLoading &&
          provinces.length === 0 ? (
            <p className="px-1 py-2 text-sm text-muted-foreground">
              No hay provincias disponibles
            </p>
          ) : null}

          {!isLoading &&
          provinces.length > 0 ? (
            <VirtualizedCheckboxList
              items={provinces}
              getItemKey={(province) =>
                province.id
              }
              className="max-h-96 overflow-y-auto"
              renderItem={(province) => (
                <CustomCheckbox
                  checked={selected_province_ids.has(
                    province.id,
                  )}
                  onChange={(event) =>
                    handleSelectProvince(
                      event.target.checked,
                      province,
                    )
                  }
                  label={
                    <p className="truncate font-medium">
                      {province.name}
                    </p>
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
