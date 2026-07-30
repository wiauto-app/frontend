import { Vehicle } from "@/interfaces/vehicle.interface";
import { getVehicleDisplayName } from "@/lib/vehicles/getVehicleDisplayName";
import { VehicleDetailPricingSection } from "./VehicleDetailPricingSection";
import { VehicleDetailDates } from "./VehicleDetailDates";
import { VehicleDetailsTechnicalFeatures } from "./vehicleDetailsTechnicalFeatures";
import { Separator } from "@/components/ui/separator";
import { VehicleDetailCard } from "./VehicleDetailCard";

type VehicleDetailTitleSectionProps = {
  vehicle: Vehicle;
};

export const VehicleDetailTitleSection = ({
  vehicle,
}: VehicleDetailTitleSectionProps) => (
  <VehicleDetailCard title={getVehicleDisplayName(vehicle)}>
    <VehicleDetailPricingSection vehicle={vehicle} />
    <Separator />
    <VehicleDetailsTechnicalFeatures vehicle={vehicle} />
    <Separator />
    <VehicleDetailDates
      created_at={vehicle.created_at}
      updated_at={vehicle.updated_at}
    />
  </VehicleDetailCard>
);
