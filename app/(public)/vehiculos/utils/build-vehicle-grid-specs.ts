import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  CarFront,
  Cog,
  Fuel,
  Gauge,
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

export const buildVehicleGridSpecs = (
  vehicle: VehicleListItem,
): VehicleGridSpec[] => {
  const specs: VehicleGridSpec[] = [];
  if (vehicle.dgt_label) {

    specs.push({
      key: "dgt-label",
      label: "DGT",
      value: vehicle.dgt_label.name,
      Icon: BadgeCheck,
    });
  }

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

  if (vehicle.power > 0) {
    specs.push({
      key: "power",
      label: "Potencia",
      value: `${vehicle.power} CV`,
      Icon: Zap,
    });
  }

  if (vehicle.version_summary.fuel_name) {
    specs.push({
      key: "fuel",
      label: "Combustible",
      value: vehicle.version_summary.fuel_name,
      Icon: Fuel,
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
  if (publisherType === "dealership") return "Concesionaria";
  if (publisherType === "particular") return "Particular";
  return null;
};
