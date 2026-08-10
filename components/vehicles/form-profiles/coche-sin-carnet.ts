import type { VehicleFormProfile } from "../types";
import { cocheSinCarnetSchema } from "../shared/non-catalog-schemas";
import { CocheSinCarnetSections } from "../shared/NonCatalogSections";

export const cocheSinCarnetProfile: VehicleFormProfile = {
  slug: "coche-sin-carnet",
  label: "Coche sin carnet",
  catalogMode: "partial",
  schema: cocheSinCarnetSchema as VehicleFormProfile["schema"],
  Sections: CocheSinCarnetSections,
};
