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
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { heroCatalogService } from "@/services/search/heroCatalogService";
import type { LocationSelectedItem } from "@/components/selectors/FilterLocationSelector/interfaces/locationSelector.interface";
import type { LocationUrlPayload } from "@/components/selectors/FilterLocationSelector/utils/location-selection";
import {
  buildLocationUrlPayload,
} from "@/components/selectors/FilterLocationSelector/utils/location-selection";
import { ProvinceQuickBadges } from "@/components/selectors/ProvinceQuickBadges";
import type { ProvinceQuickBadgeItem } from "@/components/selectors/utils/build-province-badges";
import { buildHeroListingHref } from "@/lib/vehicles/listing-url";
import { useOptionalHeroSearchFilters } from "./HeroSearchFiltersContext";
import { VirtualizedCheckboxList } from "./VirtualizedCheckboxList";
import { Slider } from "../ui/slider";
import { useFiltersManager } from "@/hooks/useFiltersManager";
import { RADIUS_KEY } from "@/app/(public)/vehiculos/[[...slug]]/constants/filterKeys.constants";

const buildLocationTriggerLabel = (
  selectedSlugs: string[],
  provinces: HeroCatalogFacetItem[],
  placeholder: string,
): string => {
  if (!selectedSlugs.length) {
    return placeholder;
  }

  const provinceBySlug = new Map(
    provinces.map((province) => [province.slug, province.name]),
  );

  const names = selectedSlugs
    .map((slug) => provinceBySlug.get(slug) ?? slug)
    .filter(Boolean);

  return names.length > 0 ? names.join(", ") : placeholder;
};

export interface HeroFiltersLocationSelectorProps {
  /**
   * Slugs de las provincias seleccionadas.
   *
   * Ejemplo:
   * ["madrid", "barcelona"]
   */
  value?: string[];

  /**
   * Devuelve únicamente los slugs seleccionados.
   */
  onChange?: (slugs: string[]) => void;

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

  const { handleChange, values } = useFiltersManager({
    keys: [RADIUS_KEY],
  });

  const radius = Number(values[RADIUS_KEY] ?? 0);

  const [search, setSearch] = useState("");
  const [radiusValue, setRadiusValue] = useState(radius);

  const debounced_search = useDebouncedValue(search, 300);
  const debounced_radius = useDebouncedValue(radiusValue, 500);

  /**
   * Mantener el slider sincronizado si el radius
   * cambia desde otro lugar.
   */
  useEffect(() => {
    setRadiusValue(radius);
  }, [radius]);

  /**
   * Actualizar el filtro únicamente después
   * de que el usuario deje de mover el slider.
   */
  useEffect(() => {
    handleChange(
      RADIUS_KEY,
      debounced_radius > 0
        ? debounced_radius.toString()
        : "",
    );
  }, [debounced_radius, handleChange]);

  /**
   * Catálogo completo.
   *
   * Se utiliza para resolver los slugs seleccionados
   * aunque la búsqueda actual esté filtrando provincias.
   */
  const {
    data: allProvinces = [],
    isLoading: isLoadingAllProvinces,
  } = useQuery({
    queryKey: ["hero-catalog", "provinces"],
    queryFn: () => heroCatalogService.getProvinces(),
    staleTime: 1000 * 60 * 10,
  });

  /**
   * Provincias que se muestran en el selector.
   */
  const {
    data: provinces = [],
    isLoading: isLoadingProvinces,
  } = useQuery({
    queryKey: ["hero-catalog", "provinces", debounced_search],
    queryFn: () =>
      heroCatalogService.getProvinces(
        debounced_search.trim() || undefined,
      ),
    staleTime: 1000 * 60 * 5,
  });

  const isLoading =
    isLoadingProvinces || isLoadingAllProvinces;

  /**
   * Los seleccionados son ÚNICAMENTE slugs.
   *
   * No guardamos objetos de provincia en el estado.
   */
  const selectedSlugs = useMemo(
    () => new Set(value),
    [value],
  );

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
    (nextSlugs: string[]) => {
      /**
       * El componente exterior SIEMPRE recibe slugs.
       */
      onChange?.(nextSlugs);

      /**
       * Para construir el payload necesitamos
       * resolver los slugs a objetos.
       */
      const provinceBySlug = new Map(
        allProvinces.map((province) => [
          province.slug,
          province,
        ]),
      );

      const nextItems: LocationSelectedItem[] = nextSlugs
        .map((slug) => provinceBySlug.get(slug))
        .filter(
          (
            province,
          ): province is HeroCatalogFacetItem =>
            Boolean(province),
        )
        .map((province) => ({
          value: true,
          type: "province" as const,
          slug: province.slug,
          province_id: province.id,
        }));

      handleApplyLocationPayload(
        buildLocationUrlPayload(nextItems),
      );
    },
    [
      allProvinces,
      handleApplyLocationPayload,
      onChange,
    ],
  );

  const handleSelectProvince = useCallback(
    (
      checked: boolean,
      province: HeroCatalogFacetItem,
    ) => {
      const nextSlugs = new Set(selectedSlugs);

      if (checked) {
        nextSlugs.add(province.slug);
      } else {
        nextSlugs.delete(province.slug);
      }

      handleApplySelection(
        Array.from(nextSlugs).filter(Boolean),
      );
    },
    [
      handleApplySelection,
      selectedSlugs,
    ],
  );

  const trigger_label = useMemo(() => {
    if (navigateOnSelect) {
      return placeholder;
    }

    return buildLocationTriggerLabel(
      value,
      allProvinces,
      placeholder,
    );
  }, [
    allProvinces,
    navigateOnSelect,
    placeholder,
    value,
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
          className="flex w-full flex-col gap-3 md:w-96"
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
              getItemKey={(province) => province.slug}
              className="max-h-96 overflow-y-auto"
              renderItem={(province) => (
                <CustomCheckbox
                  checked={selectedSlugs.has(
                    province.slug,
                  )}
                  onChange={(event) => {
                    handleSelectProvince(
                      event.target.checked,
                      province,
                    );
                  }}
                  label={
                    <p className="truncate font-medium">
                      {province.name}
                    </p>
                  }
                />
              )}
            />
          ) : null}

          <div className="flex flex-col gap-2 border-t pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Radio de búsqueda
              </span>

              <span className="font-medium">
                {radiusValue > 0
                  ? `${radiusValue} km`
                  : "Sin límite"}
              </span>
            </div>

            {/* <Slider
              min={0}
              max={100}
              step={1}
              value={[radiusValue]}
              onValueChange={(value) => {
                setRadiusValue(value[0] ?? 0);
              }}
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Sin límite</span>
              <span>100 km</span>
            </div> */}
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