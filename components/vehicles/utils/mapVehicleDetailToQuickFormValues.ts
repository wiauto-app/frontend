import type { Vehicle } from "@/interfaces/vehicle.interface";
import type { QuickVehicleSchema } from "../schemas/quick-vehicle.schema";

export const mapVehicleDetailToQuickFormValues = (
  vehicle: Vehicle,
): QuickVehicleSchema => {
  const version = vehicle.version;

  const cuota_ids =
    vehicle.cuotas?.map((cuota) => cuota.id) ??
    (vehicle.cuota_id ? [vehicle.cuota_id] : []);

  return {
    show_review_collab: vehicle.show_review_collab === undefined ? true : vehicle.show_review_collab,
    show_first_cuota: vehicle.show_first_cuota,
    by_brand_warranty: vehicle.by_brand_warranty,
    finance_price: vehicle.finance_price,
    show_exact_location: vehicle.show_exact_location,
    vehicle_type_id: vehicle?.vehicle_type?.id ?? "",
    ref: vehicle.ref != null ? String(vehicle.ref) : "",
    license_plate: vehicle.license_plate || "",
    vin_code: vehicle.vin_code ?? "",
    images: vehicle.images.map((img) => ({ id: img.id, path: img.url, order: img.order ?? 0 })),
    videos: [],
    version_id: vehicle.version_id,
    catalog_make_id: version?.make_id,
    catalog_model_id: version?.model_id,
    catalog_year_id: version?.year_id,
    catalog_fuel_type_id: version?.fuel_type_id,
    catalog_fuel_can_charge: Boolean(
      (version?.fuel_type as { can_charge?: boolean } | undefined)?.can_charge,
    ),
    condition: vehicle.condition,
    mileage: vehicle.mileage,
    price: vehicle.price,
    color_id: vehicle.color_id ?? undefined,
    category_id: vehicle.category?.id ?? undefined,
    dgt_label_id: vehicle.dgt_label?.id ?? undefined,
    lat: vehicle.lat,
    lng: vehicle.lng,
    phone: {
      phone_code: vehicle.phone_code,
      phone: vehicle.phone,
    },
    show_phone: vehicle.show_phone ?? true,
    has_whatsapp: vehicle.has_whatsapp ?? false,
    email: vehicle.email,
    description: vehicle.description,
    transmission_type: vehicle.transmission_type,
    power: vehicle.power,
    displacement: vehicle.displacement,
    autonomy: vehicle.autonomy > 0 ? vehicle.autonomy : undefined,
    battery_capacity: vehicle.battery_capacity > 0 ? vehicle.battery_capacity : undefined,
    time_to_charge: vehicle.time_to_charge > 0 ? vehicle.time_to_charge : undefined,
    traction_id: vehicle.traction?.id ?? "",
    features_ids: vehicle.features.map((feature) => feature.id) ?? [],
    services_ids: vehicle.services.map((service) => service.id) ?? [],
    cuota_ids,
    warranty_type_id: vehicle.warranty_type?.id ?? undefined,
    publisher_type: vehicle.publisher_type,
  };
};
