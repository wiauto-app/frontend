"use client";

import { Car } from "lucide-react";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { VehicleGridCard } from "./VehicleGridCard";
import { VehiclesPagination } from "./VehiclesPagination";
import { Button } from "@/components/ui/button";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";

interface VehiclesListingViewProps {
  vehicles: VehicleListItem[];
  total: number;
}

const VehiclesListingView = ({
  vehicles,
  total,
}: VehiclesListingViewProps) => {
  const { filters, resetFilters, goToPage } = useVehiclesListingFilters();

  const totalPages = Math.ceil(total / (filters.limit || 12));
  const currentPage = filters.page || 1;

  if (vehicles.length === 0) {
    return (
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
          className="mt-4 rounded-lg bg-[#0061F2] px-4 py-2 font-semibold text-white hover:opacity-90"
        >
          Limpiar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4">
        {vehicles.map((vehicle) => (
          <VehicleGridCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      <VehiclesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </div>
  );
};

export interface VehiclesPageContentProps {
  vehicles: VehicleListItem[];
  total: number;
}

export const VehiclesPageContent = ({
  vehicles,
  total,
}: VehiclesPageContentProps) => {
  return <VehiclesListingView vehicles={vehicles} total={total} />;
};
