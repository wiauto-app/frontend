"use client";
import { MapPin } from "lucide-react";
import { VehicleDetailCard } from "./VehicleDetailCard";
import { CustomMap } from "@/components/customMap";
import { Vehicle } from "@/interfaces/vehicle.interface";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

type VehicleDetailLocationSectionProps = {
  vehicle: Vehicle;
};

const getAddressLines = (vehicle: Vehicle): string[] => {
  if (vehicle.address_details?.formatted_lines?.length) {
    return vehicle.address_details.formatted_lines;
  }

  if (vehicle.address?.trim()) {
    return vehicle.address.split("\n").filter((line) => line.trim().length > 0);
  }

  return [];
};

export const VehicleDetailLocationSection = ({
  vehicle,
}: VehicleDetailLocationSectionProps) => {
  const addressLines = getAddressLines(vehicle);

  return (
    <VehicleDetailCard
      title={
        <>
          <MapPin className="size-5 text-primary" aria-hidden /> Ubicación
        </>
      }
    >
      <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-200">
        <CustomMap
          mapId="map"
          gestureHandling={"greedy"}
          defaultCenter={{ lat: vehicle.lat, lng: vehicle.lng }}
          defaultZoom={15}
          style={{ width: "100%", height: "100%" }}
        >
          <AdvancedMarker position={{ lat: vehicle.lat, lng: vehicle.lng }}>
            <img
              src="/icons/locationMarker.svg"
              alt="Marcador de ubicación"
              className="size-20"
            />
          </AdvancedMarker>
        </CustomMap>
      </div>

      {addressLines.length > 0 ? (
        <div className="mt-4 space-y-1 text-sm" aria-label="Dirección del vehículo">
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
      ) : null}
    </VehicleDetailCard>
  );
};
