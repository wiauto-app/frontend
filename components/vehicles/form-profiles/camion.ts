import type { VehicleFormProfile } from "../types";
import { camionSchema } from "../shared/non-catalog-schemas";
import { CamionSections } from "../shared/NonCatalogSections";

export const camionProfile: VehicleFormProfile = {
  slug: "camion",
  label: "Camión",
  catalogMode: "none",
  schema: camionSchema as VehicleFormProfile["schema"],
  Sections: CamionSections,
};
