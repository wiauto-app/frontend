"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  HierarchySelectItem,
  SearchableHierarchySelect,
} from "../ui/searchableHierarchySelect";
import { heroFacetService } from "@/services/search/heroFacetService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type {
  HeroCatalogFacetItem,
  HeroSearchFilters,
} from "@/interfaces/hero-facet.interface";
import type { MakeModelValue } from "./types";

type HeroHierarchyItem = HierarchySelectItem & { slug: string };

const catalogToItem = (item: HeroCatalogFacetItem): HeroHierarchyItem => ({
  id: item.id,
  slug: item.slug,
  label: item.name,
  count: item.vehicle_count,
});

export type MakeSelectorProps = {
  value: MakeModelValue;
  onValueChange: (value: MakeModelValue) => void;
  facetQueryParams?: HeroSearchFilters;
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

  const displayValue = useMemo(() => {
    if (value.make_slug && value.model_slug) {
      const make = makes.find((item) => item.slug === value.make_slug);
      const models = children_by_make_slug[value.make_slug] ?? [];
      const model = models.find((item) => item.slug === value.model_slug);
      if (make && model) {
        return `${make.name} · ${model.label}`;
      }
    }
    if (value.make_slug) {
      const make = makes.find((item) => item.slug === value.make_slug);
      if (make) {
        return make.name;
      }
    }
    return null;
  }, [value.make_slug, value.model_slug, makes, children_by_make_slug]);

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
        const { make_slug: _selected_make, ...models_facet_filters } =
          facetQueryParams;
        const models = await heroFacetService.getModels(
          make_slug,
          models_facet_filters,
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

  const handleSelectMake = useCallback(
    (item: HeroHierarchyItem) => {
      onValueChange({
        make_slug: item.slug,
        model_slug: undefined,
      });
    },
    [onValueChange],
  );

  const handleSelectModel = useCallback(
    (parent: HeroHierarchyItem, child: HeroHierarchyItem) => {
      onValueChange({
        make_slug: parent.slug,
        model_slug: child.slug,
      });
    },
    [onValueChange],
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
      isItemExpandable={() => true}
      isItemExpanded={(item) =>
        expanded_make_slugs.has((item as HeroHierarchyItem).slug)
      }
      isLoadingChildren={(item) =>
        loading_make_slugs.has((item as HeroHierarchyItem).slug)
      }
      getChildren={(item) =>
        children_by_make_slug[(item as HeroHierarchyItem).slug]
      }
      onExpandItem={handleExpandItem}
      onSelectItem={handleSelectMake}
      onSelectChild={handleSelectModel}
    />
  );
};
