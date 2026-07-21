"use client";
import { CustomMap } from "@/components/customMap";
import { DEFAULT_CENTER } from "@/constants/map.constants";
import { VehiclesPageContentProps } from "./VehiclesPageContent";
import { VehiclesMarker } from "@/components/ui/vehiclesMarker";
import { VEHICLE_LIST_CLASS } from "../constants";

export interface VehiclesMapProps extends VehiclesPageContentProps {
  isMapVisible: boolean;
}

export const VehiclesMap = ({ vehicles, total }: VehiclesMapProps) => {
  return (
    <div className={"w-full " + VEHICLE_LIST_CLASS}>
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
          />
        ))}
      </CustomMap>
    </div>
  );
};
