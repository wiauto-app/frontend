import { getConditionLabel } from "@/app/(public)/vehiculos/utils";
import { Vehicle } from "@/interfaces/vehicle.interface";
import type { VehicleDetailSpec } from "../types/vehicle-detail.types";

const TRANSMISSION_LABELS: Record<string, string> = {
  manual: "Manual",
  automatic: "Automático",
};

const hasRelevantValue = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return value > 0;
  return true;
};

const addSpec = (
  specs: VehicleDetailSpec[],
  label: string,
  value: string | number | null | undefined,
): void => {
  if (!hasRelevantValue(value)) return;
  specs.push({ label, value: String(value) });
};

export const buildVehicleTechnicalSpecs = (vehicle: Vehicle): VehicleDetailSpec[] => {
  const specs: VehicleDetailSpec[] = [];
  const { version } = vehicle;

  addSpec(specs, "Marca", version.make.name);
  addSpec(specs, "Modelo", version.model.name);
  addSpec(specs, "Versión", version.name);
  addSpec(specs, "Año", version.year.year);
  addSpec(specs, "Carrocería", version.body_type.name);
  addSpec(specs, "Puertas", version.body_type.doors);
  addSpec(specs, "Combustible", version.fuel_type.name);

  addSpec(specs, "Tipo de vehículo", vehicle.vehicle_type?.name);
  addSpec(specs, "Categoría", vehicle.category?.name);
  addSpec(specs, "Condición", getConditionLabel(vehicle.condition));

  if (vehicle.mileage >= 0) {
    addSpec(
      specs,
      "Kilometraje",
      `${vehicle.mileage.toLocaleString("es-ES")} km`,
    );
  }

  const transmissionLabel = TRANSMISSION_LABELS[vehicle.transmission_type];
  addSpec(specs, "Transmisión", transmissionLabel);
  addSpec(specs, "Tracción", vehicle.traction?.name);
  addSpec(specs, "Potencia", vehicle.power > 0 ? `${vehicle.power} CV` : null);
  addSpec(
    specs,
    "Cilindrada",
    vehicle.displacement > 0 ? `${vehicle.displacement} cc` : null,
  );
  addSpec(
    specs,
    "Autonomía",
    vehicle.autonomy > 0 ? `${vehicle.autonomy} km` : null,
  );
  addSpec(
    specs,
    "Capacidad batería",
    vehicle.battery_capacity > 0 ? `${vehicle.battery_capacity} kWh` : null,
  );
  addSpec(
    specs,
    "Tiempo de carga",
    vehicle.time_to_charge > 0 ? `${vehicle.time_to_charge} h` : null,
  );


  return specs;
};

/** Specs mostradas como badges bajo el precio en la ficha. */
export const VEHICLE_HIGHLIGHT_SPEC_LABELS = [
  "Año",
  "Kilometraje",
  "Combustible",
  "Transmisión",
  "Potencia",
] as const;

export type VehicleHighlightSpecLabel =
  (typeof VEHICLE_HIGHLIGHT_SPEC_LABELS)[number];

const isHighlightSpecLabel = (label: string): label is VehicleHighlightSpecLabel =>
  (VEHICLE_HIGHLIGHT_SPEC_LABELS as readonly string[]).includes(label);

export const buildVehicleHighlightSpecs = (
  vehicle: Vehicle,
): VehicleDetailSpec[] => {
  const by_label = new Map(
    buildVehicleTechnicalSpecs(vehicle).map((spec) => [spec.label, spec]),
  );

  return VEHICLE_HIGHLIGHT_SPEC_LABELS.flatMap((label) => {
    const spec = by_label.get(label);
    return spec ? [spec] : [];
  });
};

/** Garantía, DGT, color: antes en badges, ahora en la rejilla técnica. */
export const buildVehicleMetaSpecs = (vehicle: Vehicle): VehicleDetailSpec[] => {
  const specs: VehicleDetailSpec[] = [];
  const dgt_label =
    vehicle.dgt_label?.name ?? vehicle.dgt_label?.code ?? null;

  addSpec(specs, "Garantía", vehicle.warranty_type?.name);
  addSpec(
    specs,
    "Garantía por la marca",
    vehicle.by_brand_warranty ? "Sí" : "No",
  );
  addSpec(specs, "Distintivo DGT", dgt_label);
  addSpec(specs, "Color", vehicle.color?.name);

  return specs;
};

export const buildVehicleDetailTechnicalSpecs = (
  vehicle: Vehicle,
): VehicleDetailSpec[] => {
  const core = buildVehicleTechnicalSpecs(vehicle).filter(
    (spec) => !isHighlightSpecLabel(spec.label),
  );

  return [...core, ...buildVehicleMetaSpecs(vehicle)];
};
