"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { SearchableHierarchySelect } from "../ui/searchableHierarchySelect";
import { heroFacetService } from "@/services/search/heroFacetService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { buildVehicleListingHref } from "@/lib/vehicles/listing-url/build-listing-url";
import type {
  HeroCatalogFacetItem,
  HeroFacetCascadeFilters,
} from "@/interfaces/hero-facet.interface";
import type { HierarchySelectItem } from "@/interfaces/makeSelector.interface";
import type { HierarchyMultiValue } from "./types";
import { EMPTY_HIERARCHY_MULTI_VALUE } from "./types";
import { formatHierarchyMultiDisplay } from "./hierarchyMultiUtils";
import { ProvinceQuickBadges } from "./ProvinceQuickBadges";
import type { ProvinceQuickBadgeItem } from "./utils/build-province-badges";

type HeroHierarchyItem = HierarchySelectItem;

const catalogToItem = (item: HeroCatalogFacetItem): HeroHierarchyItem => ({
  id: item.id,
  slug: item.slug,
  label: item.name,
  count: item.vehicle_count,
});

interface ProvinceSelectorBaseProps {
  facetQueryParams?: HeroFacetCascadeFilters;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  listTitle?: string;
  showQuickBadges?: boolean;
  quickBadgeLimit?: number;
  quickBadgeProvinces?: ProvinceQuickBadgeItem[];
}

interface ProvinceSelectorControlledProps extends ProvinceSelectorBaseProps {
  value: HierarchyMultiValue;
  onValueChange: (value: HierarchyMultiValue) => void;
  onNavigate?: never;
}

interface ProvinceSelectorNavigationProps extends ProvinceSelectorBaseProps {
  value?: never;
  onValueChange?: never;
  onNavigate?: (href: string) => void;
}

export type ProvinceSelectorProps =
  | ProvinceSelectorControlledProps
  | ProvinceSelectorNavigationProps;

export const ProvinceSelector = ({
  value,
  onValueChange,
  facetQueryParams = {},
  label = "Provincia",
  placeholder = "Selecciona provincia o municipio",
  searchPlaceholder = "Buscar provincia…",
  listTitle = "Provincias más populares",
  showQuickBadges = false,
  quickBadgeLimit = 7,
  quickBadgeProvinces = [],
  onNavigate,
}: ProvinceSelectorProps) => {
  const router = useRouter();
  const is_navigation_mode = Boolean(onNavigate);
  const [search, setSearch] = useState("");
  const debounced_search = useDebouncedValue(search, 300);
  const [expanded_province_slugs, setExpandedProvinceSlugs] = useState<
    Set<string>
  >(new Set());
  const [children_by_province_slug, setChildrenByProvinceSlug] = useState<
    Record<string, HeroHierarchyItem[]>
  >({});
  const [loading_province_slugs, setLoadingProvinceSlugs] = useState<
    Set<string>
  >(new Set());

  const controlled_value = value ?? EMPTY_HIERARCHY_MULTI_VALUE;

  const { data: provinces = [], isLoading } = useQuery({
    queryKey: ["hero-facets", "provinces", facetQueryParams, debounced_search],
    queryFn: () =>
      heroFacetService.getProvinces(
        facetQueryParams,
        debounced_search.trim() || undefined,
      ),
  });

  const items = useMemo(() => provinces.map(catalogToItem), [provinces]);

  const displayValue = useMemo(
    () =>
      is_navigation_mode
        ? null
        : formatHierarchyMultiDisplay(
            controlled_value,
            provinces.map(catalogToItem),
            Object.values(children_by_province_slug).flatMap(
              (municipalities) => municipalities,
            ),
          ),
    [controlled_value, provinces, children_by_province_slug, is_navigation_mode],
  );

  const handleNavigate = useCallback(
    (href: string) => {
      if (onNavigate) {
        onNavigate(href);
        return;
      }
      router.push(href);
    },
    [onNavigate, router],
  );

  const handleSelectProvince = useCallback(
    (item: HeroHierarchyItem) => {
      handleNavigate(
        buildVehicleListingHref({ provinces_slugs: [item.slug] }),
      );
    },
    [handleNavigate],
  );

  const handleSelectMunicipality = useCallback(
    (_parent: HeroHierarchyItem, child: HeroHierarchyItem) => {
      handleNavigate(
        buildVehicleListingHref({ municipalities_slugs: [child.slug] }),
      );
    },
    [handleNavigate],
  );

  const handleExpandItem = useCallback(
    async (item: HeroHierarchyItem) => {
      const province_slug = item.slug;
      const is_expanded = expanded_province_slugs.has(province_slug);

      if (is_expanded) {
        setExpandedProvinceSlugs((prev) => {
          const next = new Set(prev);
          next.delete(province_slug);
          return next;
        });
        return;
      }

      setExpandedProvinceSlugs((prev) => new Set(prev).add(province_slug));

      if (children_by_province_slug[province_slug]) {
        return;
      }

      setLoadingProvinceSlugs((prev) => new Set(prev).add(province_slug));

      try {
        const municipalities = await heroFacetService.getMunicipalities(
          province_slug,
          facetQueryParams,
        );
        setChildrenByProvinceSlug((prev) => ({
          ...prev,
          [province_slug]: municipalities.map(catalogToItem),
        }));
      } finally {
        setLoadingProvinceSlugs((prev) => {
          const next = new Set(prev);
          next.delete(province_slug);
          return next;
        });
      }
    },
    [children_by_province_slug, expanded_province_slugs, facetQueryParams],
  );

  const hierarchy_select_props = is_navigation_mode
    ? {
        selection_mode: "single" as const,
        showFooterActions: false,
        onSelectItem: handleSelectProvince,
        onSelectChild: handleSelectMunicipality,
      }
    : {
        selection_mode: "multiple" as const,
        value: controlled_value,
        onValueChange: onValueChange!,
      };

  return (
    <div className="flex flex-col">
      <SearchableHierarchySelect
        label={label}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        listTitle={listTitle}
        items={items}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={setSearch}
        displayValue={displayValue}
        emptyMessage="No se encontraron provincias"
        isItemExpandable={() => true}
        isItemExpanded={(item) => expanded_province_slugs.has(item.slug)}
        isLoadingChildren={(item) => loading_province_slugs.has(item.slug)}
        getChildren={(item) => children_by_province_slug[item.slug]}
        onExpandItem={handleExpandItem}
        {...hierarchy_select_props}
      />
      {showQuickBadges ? (
        <ProvinceQuickBadges
          provinces={quickBadgeProvinces}
          limit={quickBadgeLimit}
        />
      ) : null}
    </div>
  );
};
