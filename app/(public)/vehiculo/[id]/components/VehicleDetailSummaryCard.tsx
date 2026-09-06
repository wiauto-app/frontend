import { VehicleFavoriteButton } from "@/app/(public)/vehiculos/components/VehicleFavoriteButton";
import { VehicleShareButton } from "@/app/(public)/vehiculos/components/VehicleShareButton";
import { Card, CardContent } from "@/components/ui/card";
import type { Vehicle } from "@/interfaces/vehicle.interface";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { VehicleDetailPricingSection } from "./VehicleDetailPricingSection";
import { VehicleDetailsTechnicalFeatures } from "./vehicleDetailsTechnicalFeatures";

interface VehicleDetailSummaryCardProps {
  vehicle: Vehicle;
}

export const VehicleDetailSummaryCard = ({
  vehicle,
}: VehicleDetailSummaryCardProps) => {
  const displayName = getVehicleDisplayName(vehicle);

  return (
    <Card size="sm" className="overflow-hidden border-border/80 shadow-sm">
      <CardContent className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold leading-tight text-foreground sm:text-2xl">
            {displayName}
          </h1>
          <div className="flex shrink-0 items-center gap-1">
            <VehicleFavoriteButton vehicleId={vehicle.id} />
            <VehicleShareButton
              vehicleId={vehicle.id}
              vehicleTitle={displayName}
            />
          </div>
        </div>

        <VehicleDetailPricingSection vehicle={vehicle} />

        <div className="border-t border-border pt-5">
          <VehicleDetailsTechnicalFeatures
            vehicle={vehicle}
            labels={[
              "Año",
              "Kilometraje",
              "Combustible",
              "Transmisión",
              "Potencia",
              "Carrocería",
              "Puertas",
              "Tracción",
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
};
