import type { QuickVehicleSchema } from "../schemas/quick-vehicle.schema";
import { serializeVehiclePayload } from "./serializeVehiclePayload";

export const serializeQuickVehiclePayload = (
  data: QuickVehicleSchema,
  options?: { isUpdate?: boolean },
) => {
  const payload = serializeVehiclePayload(
    {
      ...data,
      vehicle_type_id: "",
      traction_id: data.traction_id,
      displacement: data.displacement,
      power: data.power,
      transmission_type: data.transmission_type,
      publisher_type: data.publisher_type ?? "particular",
      description: data.description.trim(),
      vin_code: undefined,
      category_id: undefined,
      cuota_ids: [],
      videos: [],
      color_id: undefined,
      dgt_label_id: undefined,
      warranty_type_id: undefined,
      vehicle_price_id: undefined,
    },
    {
      only_temp_images: options?.isUpdate,
      is_update: options?.isUpdate,
    },
  );

  delete payload.vehicle_type_id;

  return payload;
};
