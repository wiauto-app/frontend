import type { VehicleFormProfile } from "../types";
import { clasicoSchema } from "../shared/non-catalog-schemas";
import { ClasicoSections } from "../shared/NonCatalogSections";

export const clasicoProfile: VehicleFormProfile = {
  slug: "clasico-o-competicion",
  label: "Clásico o competición",
  catalogMode: "none",
  schema: clasicoSchema as VehicleFormProfile["schema"],
  Sections: ClasicoSections,
};
