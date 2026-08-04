"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { heroFacetService } from "@/services/search/heroFacetService";
import type { LocationSelectedItem } from "@/components/selectors/FilterLocationSelector/interfaces/locationSelector.interface";
import type { LocationUrlPayload } from "@/components/selectors/FilterLocationSelector/utils/location-selection";
import {
  buildLocationUrlPayload,
  isFullProvinceMunicipalitySelection,
  normalizeSelectedItemsForProvince,
} from "@/components/selectors/FilterLocationSelector/utils/location-selection";
import { ProvinceQuickBadges } from "@/components/selectors/ProvinceQuickBadges";
import type { ProvinceQuickBadgeItem } from "@/components/selectors/utils/build-province-badges";
import { buildHeroListingHref } from "@/lib/vehicles/listing-url";
import { useOptionalHeroSearchFilters } from "./HeroSearchFiltersContext";

interface ProvinceMunicipalitiesListProps {
  province: HeroCatalogFacetItem;
  isOpen: boolean;
  selectedItems: LocationSelectedItem[];
  onApplySelection: (nextItems: LocationSelectedItem[]) => void;
  onMunicipalitiesLoaded: (municipalities: HeroCatalogFacetItem[]) => void;
}

const buildLocationTriggerLabel = (
  selectedItems: LocationSelectedItem[],
  provinces: HeroCatalogFacetItem[],
  municipalities: HeroCatalogFacetItem[],
  placeholder: string,
): string => {
  if (!selectedItems.length) {
    return placeholder;
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

  return names.length > 0 ? names.join(", ") : placeholder;
};

const ProvinceMunicipalitiesList = ({
  province,
  isOpen,
  selectedItems,
  onApplySelection,
  onMunicipalitiesLoaded,
}: ProvinceMunicipalitiesListProps) => {
  const { data: municipalities = [], isLoading } = useQuery({
    queryKey: ["hero-facets", "municipalities", province.slug],
    queryFn: async () => {
      const items = await heroFacetService.getMunicipalities(province.slug, {});
      return items.map((item) => ({
        ...item,
        province_id: province.id,
      }));
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (municipalities.length === 0) {
      return;
    }
    onMunicipalitiesLoaded(municipalities);
  }, [municipalities, onMunicipalitiesLoaded]);

  const selected_municipality_slugs = selectedItems
    .filter(
      (item) =>
        item.type === "municipality" && item.province_id === province.id,
    )
    .map((item) => item.slug);

  const is_province_all_selected =
    selectedItems.some(
      (item) => item.type === "province" && item.province_id === province.id,
    ) ||
    isFullProvinceMunicipalitySelection(
      selected_municipality_slugs,
      municipalities,
    );

  const selected_municipality_slugs_set = new Set(selected_municipality_slugs);

  const applySelection = (next_items: LocationSelectedItem[]) => {
    const normalized = normalizeSelectedItemsForProvince(
      next_items,
      province,
      municipalities,
    );
    onApplySelection(normalized);
  };

  const handleSelectProvince = (checked: boolean) => {
    if (checked) {
      applySelection([
        ...selectedItems.filter(
          (item) =>
            !(
              item.type === "province" && item.province_id === province.id
            ) &&
            !(
              item.type === "municipality" && item.province_id === province.id
            ),
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

    applySelection(
      selectedItems.filter(
        (item) =>
          !(item.type === "province" && item.province_id === province.id) &&
          !(
            item.type === "municipality" && item.province_id === province.id
          ),
      ),
    );
  };

  const handleSelectMunicipality = (
    checked: boolean,
    municipality: HeroCatalogFacetItem,
  ) => {
    const province_id = municipality.province_id ?? province.id;
    const next_items = checked
      ? [
          ...selectedItems.filter(
            (item) =>
              !(
                item.type === "municipality" && item.slug === municipality.slug
              ) &&
              !(item.type === "province" && item.province_id === province_id),
          ),
          {
            value: true,
            type: "municipality" as const,
            slug: municipality.slug,
            province_id,
          },
        ]
      : selectedItems.filter(
          (item) =>
            !(
              item.type === "municipality" && item.slug === municipality.slug
            ),
        );

    applySelection(next_items);
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
        checked={is_province_all_selected}
        onChange={(event) => handleSelectProvince(event.target.checked)}
        label={
          <div className="flex w-full items-center justify-between gap-2">
            <p className="truncate font-medium">Todos los municipios</p>
            <span className="shrink-0 text-xs text-muted-foreground">
              {province.vehicle_count}
            </span>
          </div>
        }
      />
      {municipalities.length === 0 ? (
        <p className="px-1 py-1 text-sm text-muted-foreground">
          No hay municipios disponibles
        </p>
      ) : (
        municipalities.map((municipality) => (
          <CustomCheckbox
            key={municipality.id}
            checked={
              is_province_all_selected ||
              selected_municipality_slugs_set.has(municipality.slug)
            }
            disabled={is_province_all_selected}
            onChange={(event) =>
              handleSelectMunicipality(event.target.checked, municipality)
            }
            label={
              <div className="flex w-full items-center justify-between gap-2">
                <p className="truncate">{municipality.name}</p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {municipality.vehicle_count}
                </span>
              </div>
            }
          />
        ))
      )}
    </div>
  );
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
  const [known_municipalities, setKnownMunicipalities] = useState<
    HeroCatalogFacetItem[]
  >([]);
  const [search, setSearch] = useState("");
  const [open_values, setOpenValues] = useState<string[]>([]);
  const debounced_search = useDebouncedValue(search, 300);

  const { data: provinces = [], isLoading } = useQuery({
    queryKey: ["hero-facets", "provinces", debounced_search],
    queryFn: () =>
      heroFacetService.getProvinces(
        {},
        debounced_search.trim() || undefined,
      ),
  });

  const open_value_set = useMemo(() => new Set(open_values), [open_values]);

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

  const handleMunicipalitiesLoaded = useCallback(
    (municipalities: HeroCatalogFacetItem[]) => {
      setKnownMunicipalities((previous) => {
        const by_slug = new Map(
          previous.map((municipality) => [municipality.slug, municipality]),
        );
        for (const municipality of municipalities) {
          by_slug.set(municipality.slug, municipality);
        }
        return Array.from(by_slug.values());
      });
    },
    [],
  );

  const trigger_label = useMemo(() => {
    if (navigateOnSelect) {
      return placeholder;
    }

    return buildLocationTriggerLabel(
      selectedItems,
      provinces,
      known_municipalities,
      placeholder,
    );
  }, [
    known_municipalities,
    navigateOnSelect,
    placeholder,
    provinces,
    selectedItems,
  ]);

  const handleAccordionValueChange = (value: string | string[]) => {
    setOpenValues(Array.isArray(value) ? value : value ? [value] : []);
  };

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
          className="flex w-full md:w-96 flex-col gap-2"
        >
          <SearchInput
            placeholder="Buscar provincia"
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
            aria-label="Buscar ubicación"
          />
          <div className="max-h-96 overflow-y-auto">
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
            {!isLoading && provinces.length === 0 && (
              <p className="px-1 py-2 text-sm text-muted-foreground">
                No hay provincias disponibles
              </p>
            )}
            {!isLoading && provinces.length > 0 && (
              <Accordion
                multiple={false}
                value={open_values}
                onValueChange={handleAccordionValueChange}
                className="flex w-full flex-col gap-2"
              >
                {provinces.map((province) => {
                  const province_value = String(province.id);
                  const is_open = open_value_set.has(province_value);

                  return (
                    <AccordionItem
                      className="rounded-md border px-2"
                      value={province_value}
                      key={province.id}
                    >
                      <AccordionTrigger className="py-3 **:data-[slot=accordion-trigger-icon]:!text-primary">
                        <div className="flex w-full items-center justify-between gap-2 pr-2">
                          <span className="truncate">{province.name}</span>
                          <Badge className="shrink-0 bg-primary/10 text-xs font-normal text-primary">
                            {province.vehicle_count} Vehículos
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ProvinceMunicipalitiesList
                          province={province}
                          isOpen={is_open}
                          selectedItems={selectedItems}
                          onApplySelection={handleApplySelection}
                          onMunicipalitiesLoaded={handleMunicipalitiesLoaded}
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
      {showQuickBadges ? (
        <ProvinceQuickBadges
          provinces={quickBadgeProvinces}
          limit={quickBadgeLimit}
        />
      ) : null}
    </div>
  );
};
