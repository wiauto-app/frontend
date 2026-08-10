import type { VehicleFormProfile } from "../types";
import { furgonetaVehicleSchema } from "../shared/catalog-schema";
import { CatalogVehicleSections } from "../shared/CatalogVehicleSections";
import type { VehicleFormSectionsProps } from "../types";

const FurgonetaSections = (props: VehicleFormSectionsProps) => (
  <CatalogVehicleSections {...props} showBodyStyle />
);

export const furgonetaProfile: VehicleFormProfile = {
  slug: "furgoneta",
  label: "Furgoneta",
  catalogMode: "required",
  schema: furgonetaVehicleSchema as VehicleFormProfile["schema"],
  Sections: FurgonetaSections,
};
