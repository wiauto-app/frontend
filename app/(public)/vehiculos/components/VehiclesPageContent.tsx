"use client";

import { useState } from "react";
import { Car } from "lucide-react";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { VehicleGridCard } from "./VehicleGridCard";
import { VehicleListCard } from "./VehicleListCard";
import { VehiclesPagination } from "./VehiclesPagination";
import { Button } from "@/components/ui/button";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";

type VehiclesListingViewProps = {
  vehicles: VehicleListItem[];
  total: number;
};

function VehiclesListingView({ vehicles, total }: VehiclesListingViewProps) {
  const { filters, resetFilters, goToPage } = useVehiclesListingFilters();

  const totalPages = Math.ceil(total / (filters.limit || 12));
  const currentPage = filters.page || 1;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="min-w-0 flex-1">
        {vehicles.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center">
            <Car className="mx-auto size-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No se encontraron vehículos
            </h3>
            <p className="mt-2 text-slate-500">
              Intenta ajustar los filtros o realizar una nueva búsqueda
            </p>
            <Button
              type="button"
              onClick={resetFilters}
              className="mt-4 bg-[#0061F2] text-white hover:opacity-90 rounded-lg px-4 py-2 font-semibold"
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <>
            <div className={"flex flex-col gap-4"}>
              {vehicles.map((vehicle) => (
                <VehicleListCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>

            <VehiclesPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export interface VehiclesPageContentProps {
  vehicles: VehicleListItem[];
  total: number;
}

export function VehiclesPageContent({
  vehicles,
  total,
}: VehiclesPageContentProps) {
  return <VehiclesListingView vehicles={vehicles} total={total} />;
}
