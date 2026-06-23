"use client";

import type { ReactNode } from "react";
import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type DealershipVehiclesFiltersSheetProps = {
  filtersNode: ReactNode;
};

export const DealershipVehiclesFiltersSheet = ({
  filtersNode,
}: DealershipVehiclesFiltersSheetProps) => (
  <Sheet>
    <SheetTrigger>
      <Button
        variant="outline"
        className="h-10 gap-2 px-3"
        aria-label="Abrir filtros de vehículos"
      >
        <Filter className="size-4" aria-hidden />
        <span>Filtros</span>
      </Button>
    </SheetTrigger>
    <SheetContent
      side="left"
      className="w-[300px] overflow-y-auto p-0 sm:w-[400px]"
    >
      <div className="border-b p-4">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
      </div>
      <div className="p-4">{filtersNode}</div>
    </SheetContent>
  </Sheet>
);
