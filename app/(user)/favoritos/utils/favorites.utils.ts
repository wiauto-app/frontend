import type { VehicleImage } from "@/interfaces/vehicle.interface";
import type { VehicleListItemPreview } from "@/interfaces/vehicle-list.interface";
import {
  formatPrice,
  getConditionLabel,
  getVehicleBadge,
  getVehicleModelName,
} from "@/app/(public)/vehiculos/utils";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";

export const formatFavoritePublishedDate = (value: string | undefined): string => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const formatPriceChange = (priceChange: number | null | undefined): string => {
  if (priceChange === null || priceChange === undefined || priceChange === 0) {
    return "Sin cambios";
  }

  const formatted = formatPrice(Math.abs(priceChange));
  return priceChange < 0 ? `-${formatted}` : `+${formatted}`;
};

export const toVehicleListItemAdapter = (
  vehicle: VehicleListItemPreview,
): VehicleListItem =>
  ({
    id: vehicle.id,
    title: vehicle.title,
    condition: vehicle.condition ?? "used",
    price: vehicle.price,
    is_featured: vehicle.is_featured ?? false,
  }) as VehicleListItem;

export const getFavoriteVehicleBadge = (vehicle: VehicleListItemPreview): string =>
  getVehicleBadge(toVehicleListItemAdapter(vehicle));

export const getFavoriteVehicleModelName = (vehicle: VehicleListItemPreview): string =>
  getVehicleModelName(toVehicleListItemAdapter(vehicle));

export const getFavoriteVehicleHref = (vehicleId: string): string =>
  `/vehiculo/${vehicleId}`;

export const toCarouselImages = (
  vehicle: VehicleListItemPreview,
): VehicleImage[] => {
  if (!vehicle.image_url) {
    return [];
  }

  return [{ id: `${vehicle.id}-primary`, url: vehicle.image_url }];
};

export const getFavoriteVehicleTagLabel = (
  vehicle: VehicleListItemPreview,
): string => {
  if (vehicle.category?.name) {
    return vehicle.category.name;
  }

  if (vehicle.is_featured) {
    return "Destacado";
  }

  return getConditionLabel(vehicle.condition ?? "used");
};

export const formatVehicleCountLabel = (count: number): string => {
  if (count === 1) {
    return "1 auto";
  }
  return `${count} autos`;
};
