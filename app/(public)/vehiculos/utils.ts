import { MEDIA_URL } from "@/constants";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";
import type { VehiclePriceHistoryItem } from "@/interfaces/vehicle-price.interface";
import { VEHICLE_PRICE_STATUS } from "@/interfaces/vehicle-price.interface";
import {
  getVehicleDisplayName,
  getVehicleMakeName,
  getVehicleModelLine,
} from "@/lib/vehicles/getVehicleDisplayName";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export type VehicleDisplayPrices = {
  current_price: number;
  previous_price: number | null;
};

export const getVehicleDisplayPrices = (
  price_history: VehiclePriceHistoryItem[] | undefined,
  fallback_price: number,
): VehicleDisplayPrices => {
  const sorted = [...(price_history ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  if (sorted.length === 0) {
    return { current_price: fallback_price, previous_price: null };
  }

  const active_entry = sorted.find(
    (item) => item.status === VEHICLE_PRICE_STATUS.ACTIVE,
  );
  const current_price = active_entry?.price ?? fallback_price;

  if (sorted.length <= 1) {
    return { current_price, previous_price: null };
  }

  const previous_entry = sorted.find(
    (item) => item.status === VEHICLE_PRICE_STATUS.INACTIVE,
  );
  const previous_price =
    previous_entry && previous_entry.price !== current_price
      ? previous_entry.price
      : null;

  return { current_price, previous_price };
};

export const getVehicleFinancingQuote = (
  price: number,
  cuotas: { value: number }[] | undefined,
): { monthly_label: string; months: number } | null => {
  if (!cuotas?.length) {
    return null;
  }

  const months = Math.min(...cuotas.map((cuota) => cuota.value));
  if (!Number.isFinite(months) || months <= 0) {
    return null;
  }

  return {
    monthly_label: formatMonthlyPrice(price, months),
    months,
  };
};

export function formatMonthlyPrice(price: number, cuotas?: number): string {
  const cuotaPrice = cuotas ? price / cuotas : price;
  return (
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cuotaPrice) + "/mes"
  );
}

/** Prefijo del CDN público (`NEXT_PUBLIC_MEDIA_URL`) + pathname `/{bucket}/{key}`. */
export function getImageUrl(image: string): string {
  if (!image) return "/placeholder-car.jpg";
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  if (image.startsWith("/")) {
    return `${MEDIA_URL}${image}`;
  }
  return `${MEDIA_URL}/${image}`;
}


export function getConditionLabel(condition: string): string {
  return condition === "new" ? "Nuevo" : "Usado";
}

export function getVehicleBadge(vehicle: VehicleListItem): string {
  const prefix = vehicle.condition === "new" ? "NEW" : "USED";
  const brand = getVehicleMakeName(vehicle).toUpperCase();
  return brand ? `${prefix} ${brand}` : prefix;
}

export function getVehicleModelName(vehicle: VehicleListItem): string {
  return getVehicleModelLine(vehicle);
}

export { getVehicleDisplayName, getVehicleMakeName };

export function getVehicleTags(vehicle: VehicleListItem): string[] {
  const tags: string[] = ["Reservable"];
  if (vehicle.publisher_type === "dealership") {
    tags.push("Profesional");
  } else if (vehicle.publisher_type === "particular") {
    tags.push("Particular");
  }
  return tags;
}

export function getPrimaryCuotaValue(vehicle: VehicleListItem): number | null {
  const cuota = vehicle.cuotas.find((item) => item.value > 0);
  return cuota?.value ?? null;
}

export function getFinancedPrice(vehicle: VehicleListItem): string | null {
  const cuotaValue = getPrimaryCuotaValue(vehicle);
  if (cuotaValue) {
    return formatMonthlyPrice(cuotaValue);
  }
  const estimated = vehicle.price / 84;
  return formatMonthlyPrice(estimated);
}


export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}


export const getVehicleUrl    = (vehicleId: string): string => {
  return `/vehiculo/${vehicleId}`;
}