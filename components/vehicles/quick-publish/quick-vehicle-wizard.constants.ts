import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";

export type QuickVehicleIntroStep = {
  id: number;
  name: string;
  fields: (keyof QuickVehicleSchema)[];
};

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
];
