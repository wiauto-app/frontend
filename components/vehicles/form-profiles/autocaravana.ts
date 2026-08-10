import type { VehicleFormProfile } from "../types";
import { autocaravanaSchema } from "../shared/non-catalog-schemas";
import { AutocaravanaSections } from "../shared/NonCatalogSections";

export const autocaravanaProfile: VehicleFormProfile = {
  slug: "autocaravana",
  label: "Autocaravana",
  catalogMode: "none",
  schema: autocaravanaSchema as VehicleFormProfile["schema"],
  Sections: AutocaravanaSections,
};
