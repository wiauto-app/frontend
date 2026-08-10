import type { VehicleFormProfile } from "../types";
import { catalogVehicleSchema } from "../shared/catalog-schema";
import { CatalogVehicleSections } from "../shared/CatalogVehicleSections";

export const cocheProfile: VehicleFormProfile = {
  slug: "coche",
  label: "Coche",
  catalogMode: "required",
  schema: catalogVehicleSchema as VehicleFormProfile["schema"],
  Sections: CatalogVehicleSections,
};
