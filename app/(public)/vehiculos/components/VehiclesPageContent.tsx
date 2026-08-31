"use client";

import { Car } from "lucide-react";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import type { ReactNode } from "react";
import { VehicleGridCard } from "./VehicleGridCard";
import { VehiclesPagination } from "./VehiclesPagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFiltersManager } from "@/hooks/useFiltersManager";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuthenticatedVehiclesListing } from "../hooks/useAuthenticatedVehiclesListing";
import { useVehiclesListingFilters } from "../hooks/useVehiclesListingFilters";
import { SHOW_MAP_KEY } from "../[[...slug]]/constants/filterKeys.constants";
import { useSelectedVehicleStore } from "../stores/selectedVehicleStore";
import { VehiclesMap } from "./vehiclesMap";
import { MapButton } from "./mapButton";
import { BuyAssistantBannerCard } from "./buyAssistantBannerCard";

interface VehiclesListingViewProps {
  vehicles: VehicleListItem[];
  total: number;
  onDismissed?: (vehicleId: string) => void;
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

  if (vehicles?.length === 0) {
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
        <div className="lg:hidden">
          <BuyAssistantBannerCard />
        </div>
        {vehicles.map((vehicle) => (
          <VehicleGridCard
            className="bg-white shadow-md hover:shadow-xl"
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
  titleNode?: ReactNode;
  activeFiltersNode?: ReactNode;
}

export const VehiclesPageContent = ({
  vehicles,
  total,
  isMapVisible = false,
  titleNode,
  activeFiltersNode,
}: VehiclesPageContentProps) => {
  const { resetFilters, goToPage,filters } = useVehiclesListingFilters();
  // const { vehicles, total, handleDismissed, filters } =
  //   useAuthenticatedVehiclesListing({
  //     initialVehicles,
  //     initialTotal,
  //   });
  
  const { handleChange } = useFiltersManager({
    keys: [SHOW_MAP_KEY],
  });
  const is_below_lg = useMediaQuery("(max-width: 1023px)");
  const clearSelectedVehicle = useSelectedVehicleStore(
    (state) => state.clearSelectedVehicle,
  );

  const is_mobile_map_open = isMapVisible && is_below_lg;

  const handleMapDialogOpenChange = (open: boolean) => {
    if (open) {
      return;
    }

    handleChange(SHOW_MAP_KEY, "false");
    clearSelectedVehicle();
  };

  return (
    <>
      <div className="mx-auto min-w-0 flex-1  space-y-2">
        <div className="flex items-center justify-between">
          {titleNode}
          <MapButton />
        </div>
        {activeFiltersNode}
        <VehiclesListingView
          vehicles={vehicles}
          total={total}
          // onDismissed={handleDismissed}
          goToPage={goToPage}
          resetFilters={resetFilters}
          pageLimit={filters.limit || 12}
          currentPage={filters.page || 1}
        />
      </div>

      {isMapVisible ? (
        <div className="hidden min-w-0 shrink-0 basis-[min(100%,600px)] lg:block xl:basis-180">
          <VehiclesMap
            vehicles={vehicles}
            total={total}
            isMapVisible={isMapVisible}
            mapId="vehicles-listing-map-desktop"
          />
        </div>
      ) : null}

      <Dialog open={is_mobile_map_open} onOpenChange={handleMapDialogOpenChange}>
        <DialogContent
          showCloseButton
          className="flex h-dvh max-h-dvh w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:max-w-none **:data-[slot=dialog-close]:z-50 **:data-[slot=dialog-close]:bg-background/90 **:data-[slot=dialog-close]:shadow-sm"
          aria-describedby={undefined}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Mapa de vehículos</DialogTitle>
            <DialogDescription>
              Visualiza en el mapa los vehículos del listado actual.
            </DialogDescription>
          </DialogHeader>
          <div className="relative min-h-0 flex-1">
            <VehiclesMap
              vehicles={vehicles}
              total={total}
              isMapVisible={is_mobile_map_open}
              mapId="vehicles-listing-map-mobile"
              className="static h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
