import { useFormContext } from "react-hook-form";
import { QuickVehicleSchema } from "../../schemas/quick-vehicle.schema";
import { useQuery } from "@tanstack/react-query";
import { fuelTypesService } from "../../services/fuelTypesService";

export const useCanCharge = () => {
  const form = useFormContext<QuickVehicleSchema>();

  const catalogFuelTypeId = form.watch("catalog_fuel_type_id");

  const { data: fuelType } = useQuery({
    queryKey: ["catalogFuelType", catalogFuelTypeId],
    queryFn: () => fuelTypesService.findOne(catalogFuelTypeId!),
    enabled: Boolean(catalogFuelTypeId),
  });

  const canCharge = fuelType?.can_charge ?? false;

  return {
    canCharge,
  };
};
