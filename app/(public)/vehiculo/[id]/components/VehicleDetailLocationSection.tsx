"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";
import {
  AdvancedMarker,
  Circle,
} from "@vis.gl/react-google-maps";

import { VehicleDetailCard } from "./VehicleDetailCard";
import { CustomMap } from "@/components/customMap";
import { Vehicle } from "@/interfaces/vehicle.interface";

type VehicleDetailLocationSectionProps = {
  vehicle: Vehicle;
};

const getAddressLines = (vehicle: Vehicle): string[] => {
  if (vehicle.address_details?.formatted_lines?.length) {
    return vehicle.address_details.formatted_lines;
  }

  if (vehicle.address?.trim()) {
    return vehicle.address
      .split("\n")
      .filter((line) => line.trim().length > 0);
  }

  return [];
};

const getRandomNearbyPosition = (
  lat: number,
  lng: number,
  radiusMeters = 500,
) => {
  const earthRadius = 6378137;

  const distance = Math.random() * radiusMeters;
  const bearing = Math.random() * Math.PI * 2;

  const offsetLat =
    (distance * Math.cos(bearing)) / earthRadius;

  const offsetLng =
    (distance * Math.sin(bearing)) /
    (earthRadius * Math.cos((lat * Math.PI) / 180));

  return {
    lat: lat + (offsetLat * 180) / Math.PI,
    lng: lng + (offsetLng * 180) / Math.PI,
  };
};

export const VehicleDetailLocationSection = ({
  vehicle,
}: VehicleDetailLocationSectionProps) => {
  const addressLines = getAddressLines(vehicle);
  const showExactLocation = vehicle.show_exact_location;

  const mapPosition = useMemo(() => {
    if (showExactLocation) {
      return {
        lat: vehicle.lat,
        lng: vehicle.lng,
      };
    }

    return getRandomNearbyPosition(
      vehicle.lat,
      vehicle.lng,
      500,
    );
  }, [
    vehicle.lat,
    vehicle.lng,
    showExactLocation,
  ]);

  return (
    <VehicleDetailCard
      title={
        <>
          <MapPin
            className="size-5 text-primary"
            aria-hidden
          />
          Ubicación
        </>
      }
    >
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gray-200">
        <CustomMap
          mapId="map"
          gestureHandling="greedy"
          defaultCenter={mapPosition}
          defaultZoom={showExactLocation ? 15 : 14}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          {showExactLocation ? (
            <AdvancedMarker position={mapPosition}>
              <img
                src="/icons/locationMarker.svg"
                alt="Marcador de ubicación"
                className="size-20"
              />
            </AdvancedMarker>
          ) : (
            <Circle
              center={mapPosition}
              radius={350}
              strokeColor="#0153E8"
              strokeOpacity={0.8}
              strokeWeight={2}
              fillColor="#0153E8"
              fillOpacity={0.15}
            />
          )}
        </CustomMap>
      </div>

      {addressLines.length > 0 && (
        <div
          className="mt-4 space-y-1 text-sm"
          aria-label="Dirección del vehículo"
        >
          {addressLines.map((line, index) => (
            <p
              key={`${line}-${index}`}
              className={
                index === 0
                  ? "font-semibold uppercase text-slate-800"
                  : "text-slate-500"
              }
            >
              {line}
            </p>
          ))}
        </div>
      )}
    </VehicleDetailCard>
  );
};