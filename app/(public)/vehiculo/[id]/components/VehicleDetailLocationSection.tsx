import { MapPin } from "lucide-react";

import { GoogleStaticMap } from "@/components/maps/GoogleStaticMap";
import type { Vehicle } from "@/interfaces/vehicle.interface";
import { VehicleDetailCard } from "./VehicleDetailCard";

interface VehicleDetailLocationSectionProps {
  vehicle: Vehicle;
}

export const VehicleDetailLocationSection = ({
  vehicle,
}: VehicleDetailLocationSectionProps) => {
  const showExactLocation = vehicle.show_exact_location;

  return (
    <VehicleDetailCard
      title={
        <>
          <MapPin className="size-5 text-primary" aria-hidden />
          Ubicación
        </>
      }
    >
      <div className="overflow-hidden rounded-lg">
        <GoogleStaticMap
          lat={vehicle.lat}
          lng={vehicle.lng}
          mode={showExactLocation ? "exact" : "approximate"}
          approximateSeed={vehicle.id}
          className="aspect-video w-full"
          alt={
            showExactLocation
              ? "Ubicación exacta del vehículo"
              : "Zona aproximada del vehículo"
          }
          openInGoogleMaps={showExactLocation}
        />
        {!showExactLocation ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Ubicación aproximada. El anunciante no muestra la dirección exacta.
          </p>
        ) : null}
      </div>
    </VehicleDetailCard>
  );
};
