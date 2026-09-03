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
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SORT_OPTIONS } from "../constants";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";
import { SearchVehiclesInput } from "./searchVehiclesInput";

interface VehiclesToolbarProps {
  filtersNode?: React.ReactNode;
}

export function VehiclesToolbar({ filtersNode }: VehiclesToolbarProps) {
  const router = useRouter();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { sortValue, handleSortChange } = useVehiclesListingFilters();

  return (
    <div className="sticky top-14 z-30 border-b border-slate-200 bg-[#EEF3FA] md:top-20">
      <div className="container-custom mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-6 md:justify-start lg:gap-4 lg:py-4">
        <div className="hidden gap-2 rounded-md border border-slate-200 bg-white p-1 shadow-sm md:flex">
          <Button onClick={() => router.push("/vehiculos")}>Comprar</Button>
          <Button variant="outline" onClick={() => router.push("/publicar")}>
            Vender
          </Button>
        </div>

        <SearchVehiclesInput>
          <Select
            value={sortValue}
            onValueChange={(value) => {
              if (value) {
                handleSortChange(value);
              }
            }}
            items={SORT_OPTIONS.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
          >
            <SelectTrigger
              size="sm"
              className="size-8 justify-center gap-0 border-0 p-0 shadow-none [&_svg:last-child]:hidden"
              aria-label="Ordenar resultados"
            >
              <ArrowDownUp className="size-4 text-slate-600" aria-hidden />
            </SelectTrigger>
            <SelectContent align="end" className="min-w-44">
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {filtersNode ? (
            <div className="lg:hidden">
              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Abrir filtros"
                    >
                      <Filter className="size-4 text-slate-600" aria-hidden />
                    </Button>
                  }
                />
                <SheetContent
                  side="left"
                  className="w-75 overflow-y-auto p-0 sm:w-100"
                >
               
                  <div >{filtersNode}</div>
                </SheetContent>
              </Sheet>
            </div>
          ) : null}
        </SearchVehiclesInput>
      </div>
    </div>
  );
}
