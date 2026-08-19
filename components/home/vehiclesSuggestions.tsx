import { vehicleService } from "@/services/vehicleService";

import { VehiclesListingSection } from "../vehicles/listing/VehiclesListingSection";

export const VehiclesSuggestions = async () => {
  const data = await vehicleService.vehicles.findAll({
    limit: 20,
    page: 1,
  });
  const vehicles = data.data ?? [];

  return (
      <VehiclesListingSection
        title={{ lead: "Vehículos", highlight: "destacados" }}
        variant="carousel"
        vehicles={vehicles.data}
        total={vehicles.total}
        pageSize={4}
      />
  );
};
