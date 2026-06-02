"use client";

import { Search, ArrowDownWideNarrow, LayoutGrid, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";


export function VehiclesToolbar() {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-[#EEF3FA]">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:gap-4 lg:py-4">
        <div className="flex gap-2 rounded-md border border-slate-200 bg-white p-1 shadow-sm">
          <Button onClick={() => router.push("/vehiculos")}>Comprar</Button>
          <Button
            variant="outline"
            onClick={() => router.push("/crear-vehiculo")}
          >
            Vender
          </Button>
        </div>

        <form className="min-w-[220px] flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar"
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors focus:border-[#0061F2] focus:ring-1 focus:ring-[#0061F2]"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden sm:block">
            <ArrowDownWideNarrow className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <select
              className="h-11 appearance-none rounded-lg border border-slate-200 bg-white pl-10 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-[#0061F2]"
              aria-label="Ordenar"
            >
             
            </select>
          </div>

          <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 bg-white">
            <button type="button" aria-label="Vista en lista">
              <List className="size-4" />
            </button>
            <button type="button" aria-label="Vista en cuadrícula">
              <LayoutGrid className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
