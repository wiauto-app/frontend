"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SearchInput } from "@/components/ui/searchInput";
import {
  filterFeatureGroupsByQuery,
  formatSelectedCountLabel,
  groupFeaturesByCategory,
  type GroupableFeature,
} from "./utils/groupFeaturesByCategory";

type GroupedFeaturesAccordionMode = "all-open" | "first-open" | "collapsed";

interface GroupedFeaturesAccordionProps<T extends GroupableFeature> {
  features: T[];
  selectedKeys: string[];
  getItemKey: (feature: T) => string;
  accordionMode: GroupedFeaturesAccordionMode;
  renderItems: (features: T[]) => ReactNode;
  leadingContent?: ReactNode;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
}

export const GroupedFeaturesAccordion = <T extends GroupableFeature>({
  features,
  selectedKeys,
  getItemKey,
  accordionMode,
  renderItems,
  leadingContent,
  searchPlaceholder = "Buscar equipamiento",
  emptyMessage,
  isLoading = false,
}: GroupedFeaturesAccordionProps<T>) => {
  const [search, setSearch] = useState("");
  const [openValues, setOpenValues] = useState<string[]>([]);
  const [hasInitializedOpen, setHasInitializedOpen] = useState(false);

  const allGroups = useMemo(
    () => groupFeaturesByCategory(features),
    [features],
  );

  const groups = useMemo(
    () => filterFeatureGroupsByQuery(allGroups, search),
    [allGroups, search],
  );

  useEffect(() => {
    if (search.trim()) {
      setOpenValues(groups.map((group) => group.slug));
      return;
    }

    if (hasInitializedOpen || groups.length === 0) {
      return;
    }

    if (accordionMode === "all-open") {
      setOpenValues(groups.map((group) => group.slug));
    } else if (accordionMode === "first-open") {
      setOpenValues([groups[0].slug]);
    } else {
      setOpenValues([]);
    }

    setHasInitializedOpen(true);
  }, [accordionMode, groups, hasInitializedOpen, search]);

  const handleValueChange = (value: string[]) => {
    setOpenValues(value);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const resolvedEmptyMessage =
    emptyMessage ??
    (search.trim()
      ? "No hay equipamiento que coincida con la búsqueda"
      : "No hay equipamiento disponible");

  return (
    <div className="space-y-3">
      <SearchInput
        value={search}
        onChange={handleSearchChange}
        placeholder={searchPlaceholder}
        aria-label="Buscar equipamiento"
      />
      {leadingContent}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando equipamiento…</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">{resolvedEmptyMessage}</p>
      ) : (
        <Accordion
          multiple
          value={openValues}
          onValueChange={handleValueChange}
          className="w-full"
        >
          {groups.map((group) => {
            const selectedCount = allGroups
              .find((item) => item.slug === group.slug)
              ?.features.filter((feature) =>
                selectedKeys.includes(getItemKey(feature)),
              ).length ?? 0;

            return (
              <AccordionItem
                key={group.slug}
                value={group.slug}
                className="border-border"
              >
                <AccordionTrigger type="button" className="hover:no-underline">
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-2">
                    <span className="truncate">{group.label}</span>
                    {selectedCount > 0 ? (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {formatSelectedCountLabel(selectedCount)}
                      </span>
                    ) : null}
                  </span>
                </AccordionTrigger>
                <AccordionContent>{renderItems(group.features)}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
};
