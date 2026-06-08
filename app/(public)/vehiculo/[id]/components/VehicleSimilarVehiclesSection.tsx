import { VehiclesListingSectionFromFilters } from "@/components/vehicles/listing/VehiclesListingSectionFromFilters";

type VehicleSimilarVehiclesSectionProps = {
  vehicleId: string;
};

export const VehicleSimilarVehiclesSection = async ({
  vehicleId,
}: VehicleSimilarVehiclesSectionProps) => {
  return (
    <VehiclesListingSectionFromFilters
      title={{ lead: "Vehículos", highlight: "similares" }}
      variant="carousel"
      vehicleId={vehicleId}
      pageSize={4}
    />
  );
};
