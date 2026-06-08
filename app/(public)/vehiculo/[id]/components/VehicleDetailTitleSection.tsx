import { Vehicle } from "@/interfaces/vehicle.interface";
import { CustomSeparator } from "@/components/ui/customSeparator";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleDetailPricingSection } from "./VehicleDetailPricingSection";
import { VehicleDetailDates } from "./VehicleDetailDates";

type VehicleDetailTitleSectionProps = {
  vehicle: Vehicle;
};

export const VehicleDetailTitleSection = ({
  vehicle,
}: VehicleDetailTitleSectionProps) => (
  <Card>
    <CardContent className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-900">{vehicle.title}</h1>
      <CustomSeparator />
      <VehicleDetailPricingSection vehicle={vehicle} />
      <VehicleDetailDates
        created_at={vehicle.created_at}
        updated_at={vehicle.updated_at}
      />
    </CardContent>
  </Card>
);
