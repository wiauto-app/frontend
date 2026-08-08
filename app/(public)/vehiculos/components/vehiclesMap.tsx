"use client";

import { CustomMap } from "@/components/customMap";
import { DEFAULT_CENTER } from "@/constants/map.constants";
import { VehiclesMarker } from "@/components/ui/vehiclesMarker";
import { cn } from "@/lib/utils";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { useSelectedVehicleStore } from "../stores/selectedVehicleStore";
import { VehicleMapCard } from "./VehicleMapCard";

export interface VehiclesMapProps {
  vehicles: VehicleListItem[];
  total: number;
  isMapVisible: boolean;
  className?: string;
  mapId?: string;
}

export const VehiclesMap = ({
  vehicles,
  className,
  mapId = "vehicles-listing-map",
}: VehiclesMapProps) => {
  const setSelectedVehicle = useSelectedVehicleStore(
    (state) => state.setSelectedVehicle,
  );

  return (
    <div
      className={cn(
        "sticky top-39.5 h-[calc(100dvh-160px)] w-full",
        className,
      )}
    >
      <CustomMap
        mapId={mapId}
        gestureHandling="greedy"
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={14}
      >
        {vehicles.map((vehicle) => (
          <VehiclesMarker
            key={vehicle.id}
            position={{
              lat: vehicle.lat,
              lng: vehicle.lng,
            }}
            variant="default"
            onClick={() => setSelectedVehicle(vehicle)}
          />
        ))}
      </CustomMap>
      <VehicleMapCard />
    </div>
  );
};
