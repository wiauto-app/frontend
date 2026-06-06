"use client";

import { Search, ArrowDownWideNarrow, LayoutGrid, List } from "lucide-react";
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


export function VehiclesToolbar() {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-[#EEF3FA]">
      <div className="mx-auto flex container  items-center gap-3 px-4 py-3 sm:px-6 lg:gap-4 lg:py-4">
        <div className="flex gap-2 rounded-md border border-slate-200 bg-white p-1 shadow-sm">
          <Button onClick={() => router.push("/vehiculos")}>Comprar</Button>
          <Button
            variant="outline"
            onClick={() => router.push("/crear-vehiculo")}
          >
            Vender
          </Button>
        </div>

        <SearchVehiclesInput />

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block">
            <ArrowDownWideNarrow className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500 z-10" />
            <Select>
              <SelectTrigger className="h-11 pl-10 pr-8 w-full rounded-lg bg-white border border-slate-200 font-medium text-slate-700" aria-label="Ordenar">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="recent">Más recientes</SelectItem>
                <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
              </SelectContent>
            </Select>
          </div>

     
        </div>
      </div>
    </div>
  );
}
