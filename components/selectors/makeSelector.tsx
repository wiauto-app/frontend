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

export type MakeSelectorProps = {
  value: HierarchyMultiValue;
  onValueChange: (value: HierarchyMultiValue) => void;
  /** Primer slug de cada dimensión para cascada de facetas hero (API acepta uno). */
  facetQueryParams?: HeroFacetCascadeFilters;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
};

export const MakeSelector = ({
  value,
  onValueChange,
  facetQueryParams = {},
  label = "Marca",
  placeholder = "Selecciona marca o modelo",
  searchPlaceholder = "Buscar marca…",
}: MakeSelectorProps) => {
  const [search, setSearch] = useState("");
  const debounced_search = useDebouncedValue(search, 300);
  const [expanded_make_slugs, setExpandedMakeSlugs] = useState<Set<string>>(
    new Set(),
  );
  const [children_by_make_slug, setChildrenByMakeSlug] = useState<
    Record<string, HeroHierarchyItem[]>
  >({});
  const [loading_make_slugs, setLoadingMakeSlugs] = useState<Set<string>>(
    new Set(),
  );

  const { data: makes = [], isLoading } = useQuery({
    queryKey: ["hero-facets", "makes", facetQueryParams, debounced_search],
    queryFn: () =>
      heroFacetService.getMakes(
        facetQueryParams,
        debounced_search.trim() || undefined,
      ),
  });

  const items = useMemo(() => makes.map(catalogToItem), [makes]);

  const displayValue = useMemo(
    () =>
      formatHierarchyMultiDisplay(
        value,
        makes.map(catalogToItem),
        Object.values(children_by_make_slug).flatMap((models) => models),
      ),
    [value, makes, children_by_make_slug],
  );

  const handleExpandItem = useCallback(
    async (item: HeroHierarchyItem) => {
      const make_slug = item.slug;
      const is_expanded = expanded_make_slugs.has(make_slug);

      if (is_expanded) {
        setExpandedMakeSlugs((prev) => {
          const next = new Set(prev);
          next.delete(make_slug);
          return next;
        });
        return;
      }

      setExpandedMakeSlugs((prev) => new Set(prev).add(make_slug));

      if (children_by_make_slug[make_slug]) {
        return;
      }

      setLoadingMakeSlugs((prev) => new Set(prev).add(make_slug));

      try {
        const models = await heroFacetService.getModels(
          make_slug,
          facetQueryParams,
        );
        setChildrenByMakeSlug((prev) => ({
          ...prev,
          [make_slug]: models.map(catalogToItem),
        }));
      } finally {
        setLoadingMakeSlugs((prev) => {
          const next = new Set(prev);
          next.delete(make_slug);
          return next;
        });
      }
    },
    [children_by_make_slug, expanded_make_slugs, facetQueryParams],
  );

  return (
    <SearchableHierarchySelect
      label={label}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      items={items}
      isLoading={isLoading}
      searchValue={search}
      onSearchChange={setSearch}
      displayValue={displayValue}
      emptyMessage="No se encontraron marcas"
      selection_mode="multiple"
      value={value}
      onValueChange={onValueChange}
      isItemExpandable={() => true}
      isItemExpanded={(item) => expanded_make_slugs.has(item.slug)}
      isLoadingChildren={(item) => loading_make_slugs.has(item.slug)}
      getChildren={(item) => children_by_make_slug[item.slug]}
      onExpandItem={handleExpandItem}
    />
  );
};
