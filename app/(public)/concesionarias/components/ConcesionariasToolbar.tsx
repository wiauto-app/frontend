"use client";

import { ArrowDownWideNarrow, Filter } from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ConcesionariasFiltersPanel } from "./ConcesionariasFiltersPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "../constants";
import { useDealersListingFilters } from "../hooks/useDealersListingFilters";

type ConcesionariasToolbarProps = {
  total: number;
};

export function ConcesionariasToolbar({ total }: ConcesionariasToolbarProps) {
  const { filters, commitFilters } = useDealersListingFilters();

  const handleSortChange = (value: string | null) => {
    if (!value) return;
    commitFilters({ ...filters, sort: value, page: 1 });
  };

  const currentSort =
    SORT_OPTIONS.find((opt) => opt.value === (filters.sort ?? "relevance"))
      ?.label ?? "Más relevantes";

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-700">
        <span style={{ color: "#0061F2" }}>{total}</span> concesionarios
        encontrados
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-sm text-slate-600">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Mobile Filters Button */}
          <Sheet>
            <SheetTrigger >
              <Button
                variant="outline"
                className="flex flex-1 sm:hidden items-center gap-2 border-slate-200"
              >
                <Filter className="size-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 sm:w-[400px]">
              <SheetHeader className="sr-only">
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>Opciones de filtrado para concesionarios</SheetDescription>
              </SheetHeader>
              <div className="h-full overflow-y-auto bg-slate-50">
                <Suspense
                  fallback={
                    <div className="h-96 animate-pulse bg-slate-100" />
                  }
                >
                  <ConcesionariasFiltersPanel />
                </Suspense>
              </div>
            </SheetContent>
          </Sheet>

          <span className="hidden sm:inline whitespace-nowrap">Ordenar por:</span>
          <div className="relative flex-1 sm:flex-none">
            <ArrowDownWideNarrow className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-500" />
            <Select
              value={filters.sort ?? "relevance"}
              onValueChange={handleSortChange}
            >
              <SelectTrigger
                className="h-10 w-full min-w-[200px] rounded-lg border border-slate-200 bg-white pl-10 pr-8 text-sm font-medium text-slate-700 sm:w-52"
                aria-label="Ordenar concesionarios"
                id="dealers-sort-select"
              >
                <SelectValue>{currentSort}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
