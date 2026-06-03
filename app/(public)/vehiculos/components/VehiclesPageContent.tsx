"use client";

import { useState } from "react";
import { Car } from "lucide-react";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { VehicleGridCard } from "./VehicleGridCard";
import { VehicleListCard } from "./VehicleListCard";
import { VehiclesPagination } from "./VehiclesPagination";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";

type VehiclesListingViewProps = {
  vehicles: VehicleListItem[];
  total: number;
};

function VehiclesListingView({ vehicles, total }: VehiclesListingViewProps) {
  const { filters, resetFilters, goToPage } = useVehiclesListingFilters();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const totalPages = Math.ceil(total / (filters.limit || 12));
  const currentPage = filters.page || 1;

  return (
    <div>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1">
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-600">
                {total} resultados
              </p>
            </div>

            {vehicles.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center">
                <Car className="mx-auto size-16 text-slate-300" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  No se encontraron vehículos
                </h3>
                <p className="mt-2 text-slate-500">
                  Intenta ajustar los filtros o realizar una nueva búsqueda
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center rounded-lg bg-[#0061F2] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                      : "flex flex-col gap-4"
                  }
                >
                  {vehicles.map((vehicle) =>
                    viewMode === "grid" ? (
                      <VehicleGridCard key={vehicle.id} vehicle={vehicle} />
                    ) : (
                      <VehicleListCard key={vehicle.id} vehicle={vehicle} />
                    ),
                  )}
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
      </div>
    </div>
  );
}

type VehiclesPageContentProps = {
  vehicles: VehicleListItem[];
  total: number;
};

export function VehiclesPageContent({
  vehicles,
  total,
}: VehiclesPageContentProps) {
  return <VehiclesListingView vehicles={vehicles} total={total} />;
}
