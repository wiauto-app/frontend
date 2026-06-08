import { MapPin } from "lucide-react";
import type { VehicleDetailLocation } from "../types/vehicle-detail.types";
import { VehicleDetailCard } from "./VehicleDetailCard";

type VehicleDetailLocationSectionProps = {
  location: VehicleDetailLocation;
};

export const VehicleDetailLocationSection = ({
  location,
}: VehicleDetailLocationSectionProps) => (
  <VehicleDetailCard
    title={
      <>
        <MapPin className="size-5 text-primary" aria-hidden /> Ubicación
      </>
    }
  >
    <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-200">
      <div className="text-center">
        <MapPin className="mx-auto size-8 text-gray-400" aria-hidden />
        <p className="mt-1 text-xs text-gray-500">Mapa</p>
      </div>
    </div>

    <div className="mt-3 text-sm">
      <div className="flex items-center justify-between text-gray-500">
        <span>{location.area}</span>
        <span>{location.road}</span>
      </div>
      {location.address_lines.map((line) => (
        <p key={line} className="mt-1 text-xs text-gray-500 first:mt-1">
          {line}
        </p>
      ))}
    </div>
  </VehicleDetailCard>
);
