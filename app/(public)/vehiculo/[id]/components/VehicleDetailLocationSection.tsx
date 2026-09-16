"use client";

import { useMemo } from "react";
import { MapPin } from "lucide-react";
import {
  AdvancedMarker,
  Circle,
} from "@vis.gl/react-google-maps";

import { VehicleDetailCard } from "./VehicleDetailCard";
import { Vehicle } from "@/interfaces/vehicle.interface";
import dynamic from "next/dynamic";

const DynamicCustomMap = dynamic(() => import("@/components/customMap").then(mod => mod.CustomMap), { ssr: false });
type VehicleDetailLocationSectionProps = {
  vehicle: Vehicle;
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
        <DynamicCustomMap
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
        </DynamicCustomMap>
      </div>

     
    </VehicleDetailCard>
  );
};