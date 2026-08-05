"use client";

import { Car } from "lucide-react";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import type { ReactNode } from "react";
import { VehicleGridCard } from "./VehicleGridCard";
import { VehiclesPagination } from "./VehiclesPagination";
import { Button } from "@/components/ui/button";
import { useAuthenticatedVehiclesListing } from "../hooks/useAuthenticatedVehiclesListing";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";
import { BuyAssistantBannerCard } from "./buyAssistantBannerCard";
import { VehiclesMap } from "./vehiclesMap";
import { MapButton } from "./mapButton";

interface VehiclesListingViewProps {
  vehicles: VehicleListItem[];
  total: number;
  onDismissed: (vehicleId: string) => void;
  goToPage: (page: number) => void;
  resetFilters: () => void;
  pageLimit: number;
  currentPage: number;
}

const VehiclesListingView = ({
  vehicles,
  total,
  onDismissed,
  goToPage,
  resetFilters,
  pageLimit,
  currentPage,
}: VehiclesListingViewProps) => {
  const totalPages = Math.ceil(total / pageLimit);

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
        <BuyAssistantBannerCard />
        {vehicles.map((vehicle) => (
          <VehicleGridCard
            key={vehicle.id}
            vehicle={vehicle}
            onDismissed={onDismissed}
          />
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
  isMapVisible?: boolean;
  titleNode: ReactNode;
  activeFiltersNode: ReactNode;
}

export const VehiclesPageContent = ({
  vehicles: initialVehicles,
  total: initialTotal,
  isMapVisible = false,
  titleNode,
  activeFiltersNode,
}: VehiclesPageContentProps) => {
  const { resetFilters, goToPage } = useVehiclesListingFilters();
  const { vehicles, total, handleDismissed, filters } =
    useAuthenticatedVehiclesListing({
      initialVehicles,
      initialTotal,
    });

  return (
    <>
      <div className="mx-auto min-w-0 flex-1 py-2">
        <div className="flex items-center justify-between">
          {titleNode}
          <MapButton />
        </div>
        {activeFiltersNode}
        <VehiclesListingView
          vehicles={vehicles}
          total={total}
          onDismissed={handleDismissed}
          goToPage={goToPage}
          resetFilters={resetFilters}
          pageLimit={filters.limit || 12}
          currentPage={filters.page || 1}
        />
      </div>
      {isMapVisible ? (
        <div className="hidden min-w-0 shrink-0 basis-[min(100%,420px)] lg:block xl:basis-[480px]">
          <VehiclesMap
            vehicles={vehicles}
            total={total}
            isMapVisible={isMapVisible}
          />
        </div>
      ) : null}
    </>
  );
};
