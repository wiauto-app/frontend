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

  addSpec(specs, "Matrícula", vehicle.license_plate);
  addSpec(specs, "VIN", vehicle.vin_code);

  return specs;
};
