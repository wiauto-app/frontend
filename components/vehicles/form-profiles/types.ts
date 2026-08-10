import type { ComponentType } from "react";
import type { ZodType } from "zod";
import type { VehicleFormSlug } from "./slugs";
import type { VehicleFormValues } from "./shared/form-values";

export type VehicleFormCatalogMode = "required" | "none" | "partial";

export interface VehicleFormSectionsProps {
  vehicleId?: string;
  contactName: string;
  /** Modo edición profesional: layout con cards en lugar de pasos. */
  layout?: "quick" | "professional";
}

export interface VehicleFormProfile {
  slug: VehicleFormSlug;
  label: string;
  catalogMode: VehicleFormCatalogMode;
  schema: ZodType<VehicleFormValues>;
  Sections: ComponentType<VehicleFormSectionsProps>;
}
