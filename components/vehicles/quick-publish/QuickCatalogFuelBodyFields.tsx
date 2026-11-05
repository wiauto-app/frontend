"use client";

import { useFormContext } from "react-hook-form";
import { BodyTypeSelector } from "@/components/dynamicSelectors/bodyTypeSelector";
import { FuelTypeSelector } from "@/components/dynamicSelectors/fuelTypeSelector";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";

/** Selectores de combustible y carrocería (paso «Información extra» para profesionales). */
export const QuickCatalogFuelBodyFields = () => {
  const form = useFormContext<QuickVehicleSchema>();

  const versionId = form.watch("version_id");
  const catalogModelId = form.watch("catalog_model_id");
  const catalogBodyTypeId = form.watch("catalog_body_type_id");
  const catalogFuelTypeId = form.watch("catalog_fuel_type_id");

  const modelId =
    catalogModelId !== undefined ? Number(catalogModelId) : undefined;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <FuelTypeSelector
        modelId={modelId}
        versionId={versionId}
        value={
          catalogFuelTypeId !== undefined
            ? String(catalogFuelTypeId)
            : undefined
        }
        onChange={(value) => {
          form.setValue(
            "catalog_fuel_type_id",
            value ? Number(value) : undefined,
            {
              shouldDirty: true,
            },
          );
        }}
        disabled={!versionId}
      />

      <BodyTypeSelector
        modelId={modelId}
        versionId={versionId}
        value={
          catalogBodyTypeId !== undefined
            ? String(catalogBodyTypeId)
            : undefined
        }
        onChange={(value) => {
          form.setValue(
            "catalog_body_type_id",
            value ? Number(value) : undefined,
            {
              shouldDirty: true,
            },
          );
        }}
        disabled={!versionId}
      />
    </div>
  );
};
