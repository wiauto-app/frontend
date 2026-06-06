import { MEDIA_URL } from "@/constants";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMonthlyPrice(price: number): string {
  return (
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price) + "/mes*"
  );
}

export function getImageUrl(image: string): string {
  if (!image) return "/placeholder-car.jpg";
  if (image.startsWith("/")) {
    return `${MEDIA_URL}${image}`;
  }
  else {
    return `${MEDIA_URL}/${image}`;
  }
}


export function getConditionLabel(condition: string): string {
  return condition === "new" ? "Nuevo" : "Usado";
}

export function getVehicleBadge(vehicle: VehicleListItem): string {
  const prefix = vehicle.condition === "new" ? "NEW" : "USED";
  const titleParts = vehicle.title.trim().split(/\s+/);
  const brand = titleParts[0]?.toUpperCase() ?? "";
  return brand ? `${prefix} ${brand}` : prefix;
}

export function getVehicleModelName(vehicle: VehicleListItem): string {
  const titleParts = vehicle.title.trim().split(/\s+/);
  return titleParts.slice(1).join(" ") || vehicle.title;
}

export function getVehicleTags(vehicle: VehicleListItem): string[] {
  const tags: string[] = ["Reservable"];
  if (vehicle.publisher_type === "professional") {
    tags.push("Profesional");
  } else if (vehicle.publisher_type === "particular") {
    tags.push("Particular");
  }
  if (vehicle.is_featured) {
    tags.push("Destacado");
  }
  return tags;
}

export function getFinancedPrice(vehicle: VehicleListItem): string | null {
  if (vehicle.cuota?.value) {
    return formatMonthlyPrice(vehicle.cuota.value);
  }
  const estimated = vehicle.price / 84;
  return formatMonthlyPrice(estimated);
}
