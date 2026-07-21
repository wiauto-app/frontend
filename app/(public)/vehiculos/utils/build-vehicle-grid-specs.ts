import type { LucideIcon } from "lucide-react";
import {
  CarFront,
  Cog,
  Gauge,
  MapPin,
  Palette,
  Zap,
} from "lucide-react";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";

const TRANSMISSION_LABELS: Record<string, string> = {
  manual: "Manual",
  automatic: "Automático",
};

const MAX_GRID_SPECS = 4;

export interface VehicleGridSpec {
  key: string;
  label: string;
  value: string;
  Icon: LucideIcon;
}

const getLocationLabel = (vehicle: VehicleListItem): string | null => {
  const details = vehicle.address_details;
  if (!details) return null;

  return (
    details.municipality?.trim() ||
    details.province?.trim() ||
    details.neighborhood?.trim() ||
    null
  );
};

export const buildVehicleGridSpecs = (
  vehicle: VehicleListItem,
): VehicleGridSpec[] => {
  const specs: VehicleGridSpec[] = [];

  if (vehicle.mileage >= 0) {
    specs.push({
      key: "mileage",
      label: "Kilometraje",
      value: `${vehicle.mileage.toLocaleString("es-ES")} km`,
      Icon: Gauge,
    });
  }

  if (vehicle.transmission_type) {
    const transmissionLabel = TRANSMISSION_LABELS[vehicle.transmission_type];
    if (transmissionLabel) {
      specs.push({
        key: "transmission",
        label: "Transmisión",
        value: transmissionLabel,
        Icon: Cog,
      });
    }
  }

  if (vehicle.power && vehicle.power > 0) {
    specs.push({
      key: "power",
      label: "Potencia",
      value: `${vehicle.power} CV`,
      Icon: Zap,
    });
  }

  if (vehicle.vehicle_type?.name) {
    specs.push({
      key: "vehicle-type",
      label: "Tipo",
      value: vehicle.vehicle_type.name,
      Icon: CarFront,
    });
  }

  const location = getLocationLabel(vehicle);
  if (location) {
    specs.push({
      key: "location",
      label: "Ubicación",
      value: location,
      Icon: MapPin,
    });
  }

  if (vehicle.color?.name) {
    specs.push({
      key: "color",
      label: "Color",
      value: vehicle.color.name,
      Icon: Palette,
    });
  }

  return specs.slice(0, MAX_GRID_SPECS);
};

export const getPublisherTypeLabel = (
  publisherType: VehicleListItem["publisher_type"],
): string | null => {
  if (publisherType === "professional") return "Profesional";
  if (publisherType === "particular") return "Particular";
  return null;
};
