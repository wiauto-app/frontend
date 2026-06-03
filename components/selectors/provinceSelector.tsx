"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchableHierarchySelect } from "../ui/searchableHierarchySelect";
import { heroFacetService } from "@/services/search/heroFacetService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type {
  HeroCatalogFacetItem,
  HeroFacetCascadeFilters,
} from "@/interfaces/hero-facet.interface";
import type { HierarchySelectItem } from "@/interfaces/makeSelector.interface";
import type { HierarchyMultiValue } from "./types";
import { formatHierarchyMultiDisplay } from "./hierarchyMultiUtils";

type HeroHierarchyItem = HierarchySelectItem;

const catalogToItem = (item: HeroCatalogFacetItem): HeroHierarchyItem => ({
  id: item.id,
  slug: item.slug,
  label: item.name,
  count: item.vehicle_count,
});

export type ProvinceSelectorProps = {
  value: HierarchyMultiValue;
  onValueChange: (value: HierarchyMultiValue) => void;
  facetQueryParams?: HeroFacetCascadeFilters;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  listTitle?: string;
};

export const ProvinceSelector = ({
  value,
  onValueChange,
  facetQueryParams = {},
  label = "Provincia",
  placeholder = "Selecciona provincia o municipio",
  searchPlaceholder = "Buscar provincia…",
  listTitle = "Provincias más populares",
}: ProvinceSelectorProps) => {
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

  const { data: provinces = [], isLoading } = useQuery({
    queryKey: ["hero-facets", "provinces", facetQueryParams, debounced_search],
    queryFn: () =>
      heroFacetService.getProvinces(
        facetQueryParams,
        debounced_search.trim() || undefined,
      ),
  });

  const items = useMemo(() => provinces.map(catalogToItem), [provinces]);

  const parent_label_lookup = useCallback(
    (slug: string) => provinces.find((item) => item.slug === slug)?.name,
    [provinces],
  );

  const child_label_lookup = useCallback(
    (slug: string) => {
      for (const municipalities of Object.values(children_by_province_slug)) {
        const match = municipalities.find((item) => item.slug === slug);
        if (match) {
          return match.label;
        }
      }
      return undefined;
    },
    [children_by_province_slug],
  );

  const displayValue = useMemo(
    () =>
      formatHierarchyMultiDisplay(
        value,
        provinces.map(catalogToItem),
        Object.values(children_by_province_slug).flatMap((municipalities) => municipalities),
      ),
    [value, provinces, children_by_province_slug],
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

  return (
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
      selection_mode="multiple"
      value={value}
      onValueChange={onValueChange}
      isItemExpandable={() => true}
      isItemExpanded={(item) => expanded_province_slugs.has(item.slug)}
      isLoadingChildren={(item) => loading_province_slugs.has(item.slug)}
      getChildren={(item) => children_by_province_slug[item.slug]}
      onExpandItem={handleExpandItem}
    />
  );
};
