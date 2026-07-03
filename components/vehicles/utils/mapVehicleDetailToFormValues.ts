import type { Vehicle } from "@/interfaces/vehicle.interface";
import type { VehicleSchema } from "../types/vehicles.types";

export const mapVehicleDetailToFormValues = (
  vehicle: Vehicle,
): VehicleSchema => {
  const version = vehicle.version;
  const active_price =
    vehicle.vehicle_prices?.find((item) => item.status === "active") ??
    vehicle.prices?.find((item) => item.status === "active");

  const cuota_ids =
    vehicle.cuotas?.map((cuota) => cuota.id) ??
    (vehicle.cuota_id ? [vehicle.cuota_id] : []);

  return {
    vin_code: vehicle.vin_code ?? undefined,
    vehicle_type_id: vehicle.vehicle_type_id ?? "",
    category_id: vehicle.category?.id ?? undefined,
    description: vehicle.description,
    price: vehicle.price,
    vehicle_price_id: active_price?.id,
    mileage: vehicle.mileage,
    condition: vehicle.condition,
    lat: vehicle.lat,
    lng: vehicle.lng,
    version_id: vehicle.version_id,
    catalog_make_id: version.make_id,
    catalog_model_id: version.model_id,
    catalog_body_type_id: version.body_type_id,
    catalog_fuel_type_id: version.fuel_type_id,
    catalog_year_id: version.year_id,
    traction_id: vehicle.traction_id,
    transmission_type: vehicle.transmission_type,
    power: vehicle.power,
    displacement: vehicle.displacement,
    autonomy: vehicle.autonomy,
    battery_capacity: vehicle.battery_capacity,
    time_to_charge: vehicle.time_to_charge,
    license_plate: vehicle.license_plate || undefined,
    publisher_type: vehicle.publisher_type,
    phone: {
      phone_code: vehicle.phone_code,
      phone: vehicle.phone,
    },
    show_phone: vehicle.show_phone ?? true,
    has_whatsapp: vehicle.has_whatsapp ?? false,
    email: vehicle.email,
    color_id: vehicle.color_id ?? undefined,
    dgt_label_id: vehicle.dgt_label_id ?? undefined,
    warranty_type_id: vehicle.warranty_type_id ?? undefined,
    features_ids: vehicle.features_ids,
    services_ids: vehicle.services_ids,
    cuota_ids,
    images: vehicle.images.map((img, order) => ({ path: img.url, order })),
    videos: [],
  };
};
