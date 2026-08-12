"use client";

import { CustomMap } from "@/components/customMap";
import { DEFAULT_CENTER } from "@/constants/map.constants";
import { VehiclesMarker } from "@/components/ui/vehiclesMarker";
import { cn } from "@/lib/utils";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { useSelectedVehicleStore } from "../stores/selectedVehicleStore";
import { VehicleMapCard } from "./VehicleMapCard";
import { useActiveFiltersStore } from "../stores/activeFiltersStore";
import { useEffect, useState } from "react";
import { getProvincesMapView } from "../utils/getProvincesMapView";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { ProvinceMarker } from "./provinceMarker";

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
  const [defaultCenter, setDefaultCenter] = useState<{ lat: number; lng: number }>(DEFAULT_CENTER);
  const [defaultZoom, setDefaultZoom] = useState<number>(14);
  const setSelectedVehicle = useSelectedVehicleStore(
    (state) => state.setSelectedVehicle,
  );
  const { activeFilters } = useActiveFiltersStore();
  const provinces = activeFilters?.resolved?.provinces;

  useEffect(() => {
    if (provinces) {
      const center = provinces.map((province) => province.center);

      const mapView = getProvincesMapView(center);
      setDefaultCenter(mapView?.center);
      setDefaultZoom(mapView?.zoom);
    }
  }, [provinces])

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
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
      >
        {provinces?.map((province) => (
          <ProvinceMarker
            key={province.id}
            lat={province.center.coordinates[1]}
            lng={province.center.coordinates[0]}
            name={province.name}
          />
        ))}
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
