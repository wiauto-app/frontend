import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";

export interface QuickVehicleIntroStep {
  id: number;
  name: string;
  fields: (keyof QuickVehicleSchema)[];
}

export const QUICK_VEHICLE_STEP_QUERY_PARAM = "step";

/** Marca el único botón que puede publicar (evita submit por Enter en inputs). */
export const QUICK_VEHICLE_SUBMIT_ATTR = "data-quick-vehicle-submit";

export const QUICK_VEHICLE_INTRO_STEPS: QuickVehicleIntroStep[] = [
  {
    id: 1,
    name: "Tipo",
    fields: ["vehicle_type_id"],
  },
  {
    id: 2,
    name: "Identificación",
    fields: [],
  },
  
  {
    id: 3,
    name: "Datos del vehículo",
    fields: [],
  },
  {
    id: 4,
    name: "Financiación y garantía",
    fields: [],
  },
];

export const parseQuickVehicleStep = (value: string | null): number | null => {
  if (value == null) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    return null;
  }

  if (parsed < 1 || parsed > QUICK_VEHICLE_INTRO_STEPS.length) {
    return null;
  }

  return parsed;
};
