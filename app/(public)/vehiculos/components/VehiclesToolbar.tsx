"use client";

import { Search, SlidersHorizontal, ArrowDownWideNarrow, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND_BLUE } from "../constants";

type VehiclesToolbarProps = {
  mode: "buy" | "sell";
  onModeChange: (mode: "buy" | "sell") => void;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (event: React.FormEvent) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  sortOptions: readonly { value: string; label: string }[];
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
};

export function VehiclesToolbar({
  mode,
  onModeChange,
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  sidebarOpen,
  onToggleSidebar,
  sortValue,
  onSortChange,
  sortOptions,
  viewMode,
  onViewModeChange,
}: VehiclesToolbarProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-[#EEF3FA]">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:gap-4 lg:py-4">
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => onModeChange("buy")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              mode === "buy" ? "text-white" : "text-slate-600 hover:text-slate-900",
            )}
            style={mode === "buy" ? { backgroundColor: BRAND_BLUE } : undefined}
          >
            Comprar
          </button>
          <button
            type="button"
            onClick={() => onModeChange("sell")}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              mode === "sell" ? "text-white" : "text-slate-600 hover:text-slate-900",
            )}
            style={mode === "sell" ? { backgroundColor: BRAND_BLUE } : undefined}
          >
            Vender
          </button>
        </div>

        <form onSubmit={onSearchSubmit} className="min-w-[220px] flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              placeholder="Buscar"
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors focus:border-[#0061F2] focus:ring-1 focus:ring-[#0061F2]"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors",
              sidebarOpen
                ? "border-[#0061F2] bg-white text-[#0061F2]"
                : "border-slate-200 bg-white text-slate-700 hover:border-[#0061F2] hover:text-[#0061F2]",
            )}
          >
            <SlidersHorizontal className="size-4" />
            Filtros
          </button>

          <div className="relative hidden sm:block">
            <ArrowDownWideNarrow className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <select
              value={sortValue}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-11 appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-[#0061F2]"
              aria-label="Ordenar"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={cn(
                "flex size-11 items-center justify-center transition-colors",
                viewMode === "list" ? "text-white" : "text-slate-500 hover:text-slate-800",
              )}
              style={viewMode === "list" ? { backgroundColor: BRAND_BLUE } : undefined}
              aria-label="Vista en lista"
            >
              <List className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "flex size-11 items-center justify-center transition-colors",
                viewMode === "grid" ? "text-white" : "text-slate-500 hover:text-slate-800",
              )}
              style={viewMode === "grid" ? { backgroundColor: BRAND_BLUE } : undefined}
              aria-label="Vista en cuadrícula"
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
