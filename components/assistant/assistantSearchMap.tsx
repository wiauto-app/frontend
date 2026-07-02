"use client";

import { CustomMap } from "@/components/customMap";
import { cn } from "@/lib/utils";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useMemo } from "react";

const SPAIN_CENTER = { lat: 40.4168, lng: -3.7038 };
const SPAIN_DEFAULT_ZOOM = 6;

interface AssistantSearchMapProps {
  vehicles: VehicleListItem[];
  selectedVehicleId?: string;
  onSelectVehicle?: (vehicleId: string) => void;
  fullHeight?: boolean;
}

interface MapPosition {
  lat: number;
  lng: number;
}

interface MapFitBoundsProps {
  positions: MapPosition[];
}

const isValidVehicleCoordinates = (lat: number, lng: number): boolean => {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return false;
  }

  if (lat === 0 && lng === 0) {
    return false;
  }

  return true;
};

const MapFitBounds = ({ positions }: MapFitBoundsProps) => {
  const map = useMap();
  const positionsKey = useMemo(
    () => positions.map((position) => `${position.lat},${position.lng}`).join("|"),
    [positions],
  );

  useEffect(() => {
    if (!map) {
      return;
    }

    if (positions.length === 0) {
      map.setCenter(SPAIN_CENTER);
      map.setZoom(SPAIN_DEFAULT_ZOOM);
      return;
    }

    if (positions.length === 1) {
      map.setCenter(positions[0]);
      map.setZoom(14);
      return;
    }

    const lats = positions.map((position) => position.lat);
    const lngs = positions.map((position) => position.lng);

    map.fitBounds({
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    });
  }, [map, positions, positionsKey]);

  return null;
};

export const AssistantSearchMap = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  fullHeight = false,
}: AssistantSearchMapProps) => {
  const mappableVehicles = useMemo(
    () =>
      vehicles.filter((vehicle) =>
        isValidVehicleCoordinates(vehicle.lat, vehicle.lng),
      ),
    [vehicles],
  );

  const positions = useMemo(
    () =>
      mappableVehicles.map((vehicle) => ({
        lat: vehicle.lat,
        lng: vehicle.lng,
      })),
    [mappableVehicles],
  );

  const defaultCenter =
    positions[0] ?? SPAIN_CENTER;
  const defaultZoom = positions.length > 0 ? 12 : SPAIN_DEFAULT_ZOOM;

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-lg bg-gray-200",
        fullHeight
          ? "h-full min-h-0 max-h-full"
          : "h-48 shrink-0 sm:h-56",
      )}
    >
      <CustomMap
        mapId="assistant-search-map"
        gestureHandling="greedy"
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        style={{ width: "100%", height: "100%" }}
      >
        <MapFitBounds positions={positions} />
        {mappableVehicles.map((vehicle) => (
          <AdvancedMarker
            key={vehicle.id}
            position={{ lat: vehicle.lat, lng: vehicle.lng }}
            onClick={() => onSelectVehicle?.(vehicle.id)}
          >
            <img
              src="/icons/locationMarker.svg"
              alt={`Ubicación de ${vehicle.version_summary.model_name}`}
              className={selectedVehicleId === vehicle.id ? "size-12" : "size-10"}
            />
          </AdvancedMarker>
        ))}
      </CustomMap>
    </div>
  );
};
