"use client";

import { useMemo } from "react";
import { X } from "lucide-react";

import {
  buildActiveFilterChips,
  hasVisibleActiveFilters,
} from "@/lib/vehicles/build-active-filter-chips";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";
import { useActiveFiltersStore } from "../stores/activeFiltersStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const ActiveFiltersChips = () => {
  const { activeFilters } = useActiveFiltersStore();
  const {
    filters,
    commitFilters,
    handleBrandToggle,
    setSearchInput,
    resetFilters,
  } = useVehiclesListingFilters();

  const chips = useMemo(
    () =>
      buildActiveFilterChips(activeFilters, {
        filters,
        commitFilters,
        handleBrandToggle,
        setSearchInput,
      }),
    [
      activeFilters,
      commitFilters,
      filters,
      handleBrandToggle,
      setSearchInput,
    ],
  );

  if (!hasVisibleActiveFilters(activeFilters, filters) && chips.length === 0) {
    return null;
  }

  return (
    <section
      className="mb-4 flex flex-wrap items-center gap-2"
      aria-label="Filtros activos"
    >
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="outline"
          className="border-primary bg-primary/10 text-primary"
          // className="inline-flex items-center gap-1.5 rounded-full border border-[#C7D9F5] bg-[#EBF2FF] px-3 py-1.5 text-xs font-semibold text-[#0061F2]"
        >
          {chip.label}
          <button
            type="button"
            onClick={chip.onRemove}
            className="rounded-full p-0.5 h-auto w-auto hover:bg-[#0061F2]/10"
            aria-label={`Quitar filtro ${chip.label}`}
          >
            <X className="size-3.5" aria-hidden />
          </button>
        </Badge>
      ))}
      {chips.length > 1 && (
        <Button
          type="button"
          variant="link"
          onClick={resetFilters}
          className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-[#0061F2]"
        >
          Limpiar todos
        </Button>
      )}
    </section>
  );
};
