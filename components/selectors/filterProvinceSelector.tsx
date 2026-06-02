"use client";

import { useCallback, useMemo, useState, type MouseEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type {
  HeroCatalogFacetItem,
  HeroSearchFilters,
} from "@/interfaces/hero-facet.interface";
import { heroFacetService } from "@/services/search/heroFacetService";

export type LocationFilterValue = {
  province_slug?: string;
  municipality_slug?: string;
  province_name?: string;
  municipality_name?: string;
};

type ProvinceHierarchyItem = {
  id: string | number;
  slug: string;
  label: string;
  count?: number;
};

const catalogToItem = (item: HeroCatalogFacetItem): ProvinceHierarchyItem => ({
  id: item.id,
  slug: item.slug,
  label: item.name,
  count: item.vehicle_count,
});

const formatCount = (count: number) =>
  count.toLocaleString("es-ES", { maximumFractionDigits: 0 });

const ProvinceItemLeading = ({ label }: { label: string }) => {
  const initials = label.trim().slice(0, 2).toUpperCase();
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold tracking-wide text-muted-foreground"
      aria-hidden
    >
      {initials}
    </span>
  );
};

type FilterProvinceSelectorProps = {
  value: LocationFilterValue;
  onValueChange: (value: LocationFilterValue) => void;
  facetQueryParams?: HeroSearchFilters;
  listTitle?: string;
  emptyMessage?: string;
};

export const FilterProvinceSelector = ({
  value,
  onValueChange,
  facetQueryParams = {},
  listTitle = "Provincias más populares",
  emptyMessage = "No se encontraron provincias",
}: FilterProvinceSelectorProps) => {
  const [search, setSearch] = useState("");
  const debounced_search = useDebouncedValue(search, 300);
  const [expanded_province_slugs, setExpandedProvinceSlugs] = useState<
    Set<string>
  >(new Set());
  const [children_by_province_slug, setChildrenByProvinceSlug] = useState<
    Record<string, ProvinceHierarchyItem[]>
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

  const handleToggleExpand = useCallback(
    async (item: ProvinceHierarchyItem) => {
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
        const municipality_facet_filters = { ...facetQueryParams };
        delete municipality_facet_filters.province_slug;
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

  const handleExpandClick = (
    item: ProvinceHierarchyItem,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    void handleToggleExpand(item);
  };

  const handleSelectProvince = (item: ProvinceHierarchyItem) => {
    onValueChange({
      province_slug: item.slug,
      province_name: item.label,
      municipality_slug: undefined,
      municipality_name: undefined,
    });
  };

  const handleSelectMunicipality = (
    parent: ProvinceHierarchyItem,
    child: ProvinceHierarchyItem,
  ) => {
    onValueChange({
      province_slug: parent.slug,
      province_name: parent.label,
      municipality_slug: child.slug,
      municipality_name: child.label,
    });
  };

  const isSelectedProvince = (item: ProvinceHierarchyItem) =>
    value.province_slug === item.slug && !value.municipality_slug;

  const isSelectedMunicipality = (
    parent: ProvinceHierarchyItem,
    child: ProvinceHierarchyItem,
  ) =>
    value.province_slug === parent.slug &&
    value.municipality_slug === child.slug;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar provincia…"
          aria-label="Buscar provincia"
          className="h-10 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      {listTitle ? (
        <p className="text-sm font-semibold text-foreground">{listTitle}</p>
      ) : null}

      <div
        className="max-h-64 overflow-y-auto overscroll-contain rounded-lg border border-border"
        role="listbox"
        aria-label="Provincias y municipios"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Cargando…
          </div>
        ) : items.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          <div className="flex flex-col p-1">
            {items.map((item) => {
              const expanded = expanded_province_slugs.has(item.slug);
              const children = children_by_province_slug[item.slug] ?? [];
              const loading_children = loading_province_slugs.has(item.slug);
              const selected_province = isSelectedProvince(item);

              return (
                <div key={item.id} className="flex flex-col">
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-2 py-2 transition-colors",
                      selected_province && "bg-primary/10",
                    )}
                  >
                    <ProvinceItemLeading label={item.label} />
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected_province}
                      className="flex min-w-0 flex-1 items-center justify-between gap-2 text-left text-sm outline-none"
                      onClick={() => handleSelectProvince(item)}
                    >
                      <span className="truncate font-semibold text-foreground">
                        {item.label}
                      </span>
                      {item.count !== undefined ? (
                        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                          {formatCount(item.count)}
                        </span>
                      ) : null}
                    </button>
                    <button
                      type="button"
                      className="flex size-8 shrink-0 items-center justify-center rounded-md outline-none hover:bg-muted focus-visible:bg-muted"
                      aria-expanded={expanded}
                      aria-label={`Ver municipios de ${item.label}`}
                      onClick={(event) => handleExpandClick(item, event)}
                    >
                      <ChevronDown
                        className={cn(
                          "size-4 text-foreground transition-transform duration-200",
                          expanded && "rotate-180",
                        )}
                        aria-hidden
                      />
                    </button>
                  </div>

                  {expanded ? (
                    <div className="mb-1 ml-11 flex flex-col gap-0.5 border-l-2 border-border pl-3">
                      {loading_children ? (
                        <div className="flex items-center gap-2 px-2 py-2 text-xs text-muted-foreground">
                          <Loader2
                            className="size-3.5 animate-spin"
                            aria-hidden
                          />
                          Cargando municipios…
                        </div>
                      ) : children.length === 0 ? (
                        <p className="px-2 py-2 text-xs text-muted-foreground">
                          Sin municipios
                        </p>
                      ) : (
                        children.map((child) => {
                          const selected_child = isSelectedMunicipality(
                            item,
                            child,
                          );
                          return (
                            <button
                              key={child.id}
                              type="button"
                              role="option"
                              aria-selected={selected_child}
                              className={cn(
                                "rounded-md px-2 py-2 text-left text-sm outline-none hover:bg-muted focus-visible:bg-muted",
                                selected_child &&
                                  "bg-primary/10 font-medium text-primary",
                              )}
                              onClick={() =>
                                handleSelectMunicipality(item, child)
                              }
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="truncate">{child.label}</span>
                                {child.count !== undefined ? (
                                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                                    {formatCount(child.count)}
                                  </span>
                                ) : null}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
