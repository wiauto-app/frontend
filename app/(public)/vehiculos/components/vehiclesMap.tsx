"use client";

import { CustomMap } from "@/components/customMap";
import { DEFAULT_CENTER } from "@/constants/map.constants";
import { VehiclesMarker } from "@/components/ui/vehiclesMarker";
import { VehiclesPageContentProps } from "./VehiclesPageContent";
import { useSelectedVehicleStore } from "../stores/selectedVehicleStore";
import { VehicleMapCard } from "./VehicleMapCard";

export interface VehiclesMapProps extends VehiclesPageContentProps {
  isMapVisible: boolean;
}

export const VehiclesMap = ({ vehicles }: VehiclesMapProps) => {
  const setSelectedVehicle = useSelectedVehicleStore(
    (state) => state.setSelectedVehicle,
  );

  return (
    <div className="sticky top-39.5 h-[calc(100dvh-160px)] w-full">
      <CustomMap
        mapId="vehicle-publish-map"
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
            variant={!vehicle.is_featured ? "default" : "dot"}
            onClick={() => setSelectedVehicle(vehicle)}
          />
        ))}
      </CustomMap>
      <VehicleMapCard />
    </div>
  );
};
