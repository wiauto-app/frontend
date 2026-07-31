export const PLAN_LEAD_CARS_QUANTITY_OPTIONS = [
  { value: "1-10", label: "1 – 10 vehículos" },
  { value: "11-20", label: "11 – 20 vehículos" },
  { value: "21-50", label: "21 – 50 vehículos" },
  { value: "51-100", label: "51 – 100 vehículos" },
  { value: "101+", label: "Más de 100 vehículos" },
] as const;

export type PlanLeadCarsQuantity =
  (typeof PLAN_LEAD_CARS_QUANTITY_OPTIONS)[number]["value"];

export const PLAN_LEAD_CARS_QUANTITY_VALUES = PLAN_LEAD_CARS_QUANTITY_OPTIONS.map(
  (option) => option.value,
) as [PlanLeadCarsQuantity, ...PlanLeadCarsQuantity[]];
