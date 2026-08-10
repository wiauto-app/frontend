"use client";

import { ArrowDownWideNarrow, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchVehiclesInput } from "./searchVehiclesInput";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SORT_OPTIONS } from "../constants";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";

interface VehiclesToolbarProps {
  filtersNode?: React.ReactNode;
}

export function VehiclesToolbar({ filtersNode }: VehiclesToolbarProps) {
  const router = useRouter();
  const { sortValue, handleSortChange } = useVehiclesListingFilters();

  return (
    <div className="sticky top-20 z-30 border-b border-slate-200 bg-[#EEF3FA]">
      <div className="mx-auto flex container-custom items-center justify-between md:justify-start gap-3 px-4 py-3 sm:px-6 lg:gap-4 lg:py-4">
        <div className="hidden md:flex gap-2 rounded-md border border-slate-200 bg-white p-1 shadow-sm">
          <Button onClick={() => router.push("/vehiculos")}>Comprar</Button>
          <Button
            variant="outline"
            onClick={() => router.push("/publicar")}
          >
            Vender
          </Button>
        </div>

        <SearchVehiclesInput />

        <div className="flex items-center gap-2 sm:gap-3">
          {filtersNode && (
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger
                  render={
                    <Button variant="outline" className="h-11 px-3">
                      <Filter className="h-5 w-5" />
                    </Button>
                  }
                ></SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] sm:w-[400px] overflow-y-auto p-0"
                >
                  <div className="p-4 border-b">
                    <SheetTitle>Filtros</SheetTitle>
                  </div>
                  <div className="p-4">{filtersNode}</div>
                </SheetContent>
              </Sheet>
            </div>
          )}

          <div className="relative">
            <ArrowDownWideNarrow className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-slate-500" />
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
                className="h-11 w-full  rounded-lg border border-slate-200 bg-white pl-10 pr-8 font-medium text-slate-700"
                aria-label="Ordenar resultados"
              >
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
