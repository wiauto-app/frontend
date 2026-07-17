import type { QuickVehicleSchema } from "../schemas/quick-vehicle.schema";
import { serializeVehiclePayload } from "./serializeVehiclePayload";

export const serializeQuickVehiclePayload = (
  data: QuickVehicleSchema,
  options?: { isUpdate?: boolean },
) => {
  const { catalog_fuel_can_charge: _canCharge, ...formData } = data;

  return serializeVehiclePayload(
    {
      ...formData,
      publisher_type: formData.publisher_type ?? "particular",
      description: formData?.description?.trim(),
      license_plate: formData.license_plate || undefined,
      vin_code: formData.vin_code || undefined,
    },
    {
      only_temp_images: options?.isUpdate,
      is_update: options?.isUpdate,
    },
  );
};
