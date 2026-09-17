"use client";

import { useState } from "react";
import { ArrowDownUp, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SORT_OPTIONS } from "../constants";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";
import { AiSearchForm } from "@/components/home/aiSearchForm";
import { ButtonGroup } from "@/components/ui/button-group";

interface VehiclesToolbarProps {
  filtersNode?: React.ReactNode;
}

interface SortSelectProps {
  value: string;
  label: string;
  onChange: (value: string) => void;
  className?: string;
}

const SortSelect = ({ value, label, onChange, className }: SortSelectProps) => {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue) {
          onChange(nextValue);
        }
      }}
      items={SORT_OPTIONS.map((option) => ({
        label: option.label,
        value: option.value,
      }))}
    >
      <SelectTrigger
        size="sm"
        className={className}
        aria-label={`Ordenar resultados: ${label}`}
      >
        <ArrowDownUp className="size-4 shrink-0 text-slate-600" aria-hidden />
        <SelectValue className="truncate text-xs font-medium text-slate-700">
          {label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="min-w-44">
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export function VehiclesToolbar({ filtersNode }: VehiclesToolbarProps) {
  const router = useRouter();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { sortValue, handleSortChange } = useVehiclesListingFilters();
  const selectedSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortValue)?.label ??
    "Ordenar";

  const handleOpenFilters = () => {
    setIsFiltersOpen(true);
  };

  return (
    <div className="sticky top-14 z-30 border-b border-slate-200 bg-[#EEF3FA] md:top-20">
      <div className="container-custom mx-auto flex flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-start lg:gap-4 lg:py-4">
        <ButtonGroup className="w-full shrink-0 justify-center rounded-full sm:w-auto sm:justify-start">
          <Button
            type="button"
            className="flex-1 sm:flex-none"
            onClick={() => router.push("/vehiculos")}
          >
            Comprar
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => router.push("/publicar")}
          >
            Vender
          </Button>
        </ButtonGroup>

        <div className="flex min-w-0 w-full flex-1 flex-col gap-2">
          <AiSearchForm
            showLabel={false}
            showExamples={false}
            endContent={
              <>
                <SortSelect
                  value={sortValue}
                  label={selectedSortLabel}
                  onChange={handleSortChange}
                  className="h-8 max-w-44 min-w-0 gap-1.5 border-0 bg-transparent px-2 shadow-none"
                />
                {filtersNode ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="lg:hidden"
                    aria-label="Abrir filtros"
                    onClick={handleOpenFilters}
                  >
                    <Filter className="size-4 text-slate-600" aria-hidden />
                  </Button>
                ) : null}
              </>
            }
          />

          <div className="flex w-full items-center gap-2 md:hidden">
            <SortSelect
              value={sortValue}
              label={selectedSortLabel}
              onChange={handleSortChange}
              className="h-9 min-w-0 flex-1 gap-1.5 border-slate-200 bg-white px-3 shadow-none"
            />
            {filtersNode ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 shrink-0 gap-1.5 border-slate-200 bg-white px-3"
                aria-label="Abrir filtros"
                onClick={handleOpenFilters}
              >
                <Filter className="size-4 text-slate-600" aria-hidden />
                <span className="text-xs font-medium text-slate-700">
                  Filtros
                </span>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {filtersNode ? (
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <SheetContent side="left" className="w-75 overflow-y-auto p-0 sm:w-100">
            <div>{filtersNode}</div>
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}
