"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  HierarchySelectItem,
  SearchableHierarchySelect,
} from "../ui/searchableHierarchySelect";
import { heroFacetService } from "@/services/search/heroFacetService";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { HeroCatalogFacetItem } from "@/interfaces/hero-facet.interface";
import { useHeroSearchFilters } from "../home/HeroSearchFiltersContext";

type HeroHierarchyItem = HierarchySelectItem & { slug: string };

const catalogToItem = (item: HeroCatalogFacetItem): HeroHierarchyItem => ({
  id: item.id,
  slug: item.slug,
  label: item.name,
  count: item.vehicle_count,
});

export const ProvinceSelector = () => {
  const {
    filters,
    facetQueryParams,
    setProvinceSlug,
    setMunicipalitySlug,
  } = useHeroSearchFilters();

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

  const displayValue = useMemo(() => {
    if (filters.province_slug && filters.municipality_slug) {
      const province = provinces.find(
        (item) => item.slug === filters.province_slug,
      );
      const municipalities =
        children_by_province_slug[filters.province_slug] ?? [];
      const municipality = municipalities.find(
        (item) => item.slug === filters.municipality_slug,
      );
      if (province && municipality) {
        return `${province.name} · ${municipality.label}`;
      }
    }
    if (filters.province_slug) {
      const province = provinces.find(
        (item) => item.slug === filters.province_slug,
      );
      if (province) {
        return province.name;
      }
    }
    return null;
  }, [
    filters.province_slug,
    filters.municipality_slug,
    provinces,
    children_by_province_slug,
  ]);

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
        const { province_slug: _selected_province, ...municipality_facet_filters } =
          facetQueryParams;
        const municipalities = await heroFacetService.getMunicipalities(
          province_slug,
          municipality_facet_filters,
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

  const handleSelectProvince = useCallback(
    (item: HeroHierarchyItem) => {
      setProvinceSlug(item.slug);
      setMunicipalitySlug(undefined);
    },
    [setProvinceSlug, setMunicipalitySlug],
  );

  const handleSelectMunicipality = useCallback(
    (parent: HeroHierarchyItem, child: HeroHierarchyItem) => {
      setProvinceSlug(parent.slug);
      setMunicipalitySlug(child.slug);
    },
    [setProvinceSlug, setMunicipalitySlug],
  );

  return (
    <SearchableHierarchySelect
      label="Provincia"
      placeholder="Selecciona provincia o municipio"
      searchPlaceholder="Buscar provincia…"
      listTitle="Provincias más populares"
      items={items}
      isLoading={isLoading}
      searchValue={search}
      onSearchChange={setSearch}
      displayValue={displayValue}
      emptyMessage="No se encontraron provincias"
      isItemExpandable={() => true}
      isItemExpanded={(item) =>
        expanded_province_slugs.has((item as HeroHierarchyItem).slug)
      }
      isLoadingChildren={(item) =>
        loading_province_slugs.has((item as HeroHierarchyItem).slug)
      }
      getChildren={(item) =>
        children_by_province_slug[(item as HeroHierarchyItem).slug]
      }
      onExpandItem={handleExpandItem}
      onSelectItem={handleSelectProvince}
      onSelectChild={handleSelectMunicipality}
    />
  );
};
