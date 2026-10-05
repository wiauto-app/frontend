import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import type { AppraisalDetail } from "@/services/appraisal/types/appraisal.types";

/**
 * Datos de una tasación → valores iniciales de la publicación rápida: catálogo,
 * kilometraje, transmisión, potencia y el precio recomendado por la IA.
 */
export const mapAppraisalToQuickFormValues = (
  appraisal: AppraisalDetail,
  current: QuickVehicleSchema,
): QuickVehicleSchema => {
  const { vehicle, estimate } = appraisal;

  return {
    ...current,
    catalog_make_id: vehicle.make_id,
    catalog_model_id: vehicle.model_id,
    catalog_year_id: vehicle.year_id,
    catalog_fuel_type_id: vehicle.fuel_type_id ?? undefined,
    version_id: vehicle.version_id ?? current.version_id,
    condition: "used",
    mileage: vehicle.mileage,
    transmission_type: vehicle.transmission_type,
    power: vehicle.power ?? current.power,
    price: estimate?.recommended_price ?? current.price,
  };
};
