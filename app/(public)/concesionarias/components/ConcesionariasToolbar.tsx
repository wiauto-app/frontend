"use client";

import { useRouter } from "next/navigation";
import { ArrowDownWideNarrow, Filter } from "lucide-react";
import { Suspense } from "react";
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
import { useFiltersManager } from "@/hooks/useFiltersManager";
import {
  DEALER_FILTER_KEYS,
  DEALER_FILTER_KEYS_LIST,
} from "../constants/filterKeys.constants";

type ConcesionariasToolbarProps = {
  total: number;
};

export function ConcesionariasToolbar({ total }: ConcesionariasToolbarProps) {
  const router = useRouter();
  const { values, applyUrlUpdates } = useFiltersManager({
    keys: DEALER_FILTER_KEYS_LIST,
  });

  const currentSort =
    String(values[DEALER_FILTER_KEYS.SORT] ?? "relevance") || "relevance";

  const handleSortChange = (value: string | null) => {
    if (!value) {
      return;
    }

    applyUrlUpdates({
      [DEALER_FILTER_KEYS.SORT]: value === "relevance" ? undefined : value,
      [DEALER_FILTER_KEYS.PAGE]: undefined,
    });
    router.refresh();
  };

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label ??
    "Más relevantes";

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-700">
        <span style={{ color: "#0061F2" }}>{total}</span> concesionarios
        encontrados
      </p>

      <div className="flex flex-col items-stretch gap-2 text-sm text-slate-600 sm:flex-row sm:items-center">
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Sheet>
            <SheetTrigger className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 bg-background px-3 py-2 text-sm font-medium shadow-xs hover:bg-muted sm:hidden">
              <Filter className="size-4" />
              Filtros
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 sm:w-[400px]">
              <SheetHeader className="sr-only">
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>
                  Opciones de filtrado para concesionarios
                </SheetDescription>
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

          <span className="hidden whitespace-nowrap sm:inline">
            Ordenar por:
          </span>
          <div className="relative flex-1 sm:flex-none">
            <ArrowDownWideNarrow className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-500" />
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger
                className="h-10 w-full min-w-[200px] rounded-lg border border-slate-200 bg-white pl-10 pr-8 text-sm font-medium text-slate-700 sm:w-52"
                aria-label="Ordenar concesionarios"
                id="dealers-sort-select"
              >
                <SelectValue>{currentSortLabel}</SelectValue>
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
