import type { Vehicle } from "@/interfaces/vehicle.interface";
import type { QuickVehicleSchema } from "../schemas/quick-vehicle.schema";

export const mapVehicleDetailToQuickFormValues = (
  vehicle: Vehicle,
): QuickVehicleSchema => {
  const version = vehicle.version;

  return {
    images: vehicle.images.map((img, order) => ({ path: img.url, order })),
    version_id: vehicle.version_id,
    catalog_make_id: version?.make_id,
    catalog_model_id: version?.model_id,
    catalog_year_id: version?.year_id,
    condition: vehicle.condition,
    mileage: vehicle.mileage,
    price: vehicle.price,
    lat: vehicle.lat,
    lng: vehicle.lng,
    phone: {
      phone_code: vehicle.phone_code,
      phone: vehicle.phone,
    },
    email: vehicle.email,
    description: vehicle.description,
    transmission_type: vehicle.transmission_type,
    power: vehicle.power,
    displacement: vehicle.displacement,
    traction_id: vehicle.traction_id,
    features_ids: vehicle.features_ids ?? [],
    services_ids: vehicle.services_ids ?? [],
    publisher_type: vehicle.publisher_type,
  };
};
