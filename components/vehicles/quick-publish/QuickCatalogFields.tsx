"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { MakeSelector } from "@/components/dynamicSelectors/makeSelector";
import { ModelSelector } from "@/components/dynamicSelectors/modelSelector";
import { QuickYearSelector } from "@/components/dynamicSelectors/quickYearSelector";
import { VersionSelector } from "@/components/dynamicSelectors/versionSelector";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { catalogVersionsService } from "@/components/vehicles/services/catalogVersionsService";
import { fuelTypesService } from "@/components/vehicles/services/fuelTypesService";
import { BodyTypeSelector } from "@/components/dynamicSelectors/bodyTypeSelector";
import { FuelTypeSelector } from "@/components/dynamicSelectors/fuelTypeSelector";

type CatalogIds = {
  makeId?: string;
  modelId?: string;
  yearId?: string;
  bodyTypeId?: string;
  fuelTypeId?: string;
};

const clearElectricFields = (
  setValue: ReturnType<typeof useFormContext<QuickVehicleSchema>>["setValue"],
) => {
  setValue("autonomy", undefined, { shouldDirty: true });
  setValue("battery_capacity", undefined, { shouldDirty: true });
  setValue("time_to_charge", undefined, { shouldDirty: true });
};

export const QuickCatalogFields = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const versionId = form.watch("version_id");
  const catalogMakeId = form.watch("catalog_make_id");
  const catalogModelId = form.watch("catalog_model_id");
  const catalogYearId = form.watch("catalog_year_id");
  const catalogBodyTypeId = form.watch("catalog_body_type_id");
  const catalogFuelTypeId = form.watch("catalog_fuel_type_id");
  const [ids, setIds] = useState<CatalogIds>(() => ({
    makeId: catalogMakeId ? String(catalogMakeId) : undefined,
    modelId: catalogModelId ? String(catalogModelId) : undefined,
    yearId: catalogYearId ? String(catalogYearId) : undefined,
    bodyTypeId: catalogBodyTypeId ? String(catalogBodyTypeId) : undefined,
    fuelTypeId: catalogFuelTypeId ? String(catalogFuelTypeId) : undefined,
  }));


  // Sincroniza selectores cuando el formulario se rellena desde identificación (matrícula/VIN).
  useEffect(() => {
    setIds({
      makeId: catalogMakeId ? String(catalogMakeId) : undefined,
      modelId: catalogModelId ? String(catalogModelId) : undefined,
      yearId: catalogYearId ? String(catalogYearId) : undefined,
      bodyTypeId: catalogBodyTypeId ? String(catalogBodyTypeId) : undefined,
      fuelTypeId: catalogFuelTypeId ? String(catalogFuelTypeId) : undefined,
    });
  }, [catalogMakeId, catalogModelId, catalogYearId]);

  const syncFuelTypeFromVersion = async (numericVersionId: number) => {
    if (!numericVersionId) {
      form.setValue("catalog_fuel_type_id", undefined, { shouldDirty: true });
      form.setValue("catalog_fuel_can_charge", false, { shouldDirty: true });
      clearElectricFields(form.setValue);
      return;
    }

    try {
      const version = await catalogVersionsService.findOne(numericVersionId);
      form.setValue("catalog_fuel_type_id", version.fuel_type_id, {
        shouldDirty: true,
      });
      const fuelType = await fuelTypesService.findOne(version.fuel_type_id);
      form.setValue("catalog_fuel_can_charge", fuelType.can_charge, {
        shouldDirty: true,
      });
      if (!fuelType.can_charge) {
        clearElectricFields(form.setValue);
      }
    } catch {
      form.setValue("catalog_fuel_type_id", undefined, { shouldDirty: true });
      form.setValue("catalog_fuel_can_charge", false, { shouldDirty: true });
      clearElectricFields(form.setValue);
    }
  };

  const updateIds = (
    field: keyof CatalogIds,
    value: string | undefined,
    resetKeys: (keyof CatalogIds)[] = [],
  ) => {
    setIds((prev) => {
      const next = { ...prev, [field]: value };
      for (const key of resetKeys) {
        next[key] = undefined;
      }
      return next;
    });
    // form.setValue("version_id", 0, { shouldDirty: true });
    // form.setValue("catalog_fuel_type_id", undefined, { shouldDirty: true });
    // form.setValue("catalog_fuel_can_charge", false, { shouldDirty: true });
    clearElectricFields(form.setValue);
  };

  const handleVersionChange = (value: string | undefined) => {
    const numericVersionId = value ? Number(value) : 0;
    form.setValue("version_id", numericVersionId, {
      shouldDirty: true,
      shouldValidate: true,
    });
    void syncFuelTypeFromVersion(numericVersionId);
  };

  useEffect(() => {
    if (!versionId || versionId <= 0) return;
    if (form.getValues("catalog_fuel_type_id")) return;
    void syncFuelTypeFromVersion(versionId);
  }, [versionId, form]);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MakeSelector
        value={ids.makeId}
        onChange={(value) => {
          updateIds("makeId", value, ["modelId", "yearId"]);
          form.setValue("catalog_make_id", value ? Number(value) : undefined, {
            shouldDirty: true,
          });
        }}
      />
      <ModelSelector
        makeId={ids.makeId ? Number(ids.makeId) : undefined}
        value={ids.modelId}
        onChange={(value) => {
          updateIds("modelId", value, ["yearId"]);
          form.setValue("catalog_model_id", value ? Number(value) : undefined, {
            shouldDirty: true,
          });
        }}
      />
      <BodyTypeSelector
        modelId={ids.modelId ? Number(ids.modelId) : undefined}
        value={ids.bodyTypeId}
        onChange={(value) => {
          updateIds("bodyTypeId", value);
          form.setValue(
            "catalog_body_type_id",
            value ? Number(value) : undefined,
            { shouldDirty: true },
          );
        }}
      />
      <FuelTypeSelector
        modelId={ids.modelId ? Number(ids.modelId) : undefined}
        bodyTypeId={ids.bodyTypeId ? Number(ids.bodyTypeId) : undefined}
        value={ids.fuelTypeId}
        onChange={(value) => {
          updateIds("fuelTypeId", value);
          form.setValue(
            "catalog_fuel_type_id",
            value ? Number(value) : undefined,
            { shouldDirty: true },
          );
        }}
        disabled={!ids.bodyTypeId}
      />
      <QuickYearSelector
        modelId={ids.modelId ? Number(ids.modelId) : undefined}
        value={ids.yearId}
        onChange={(value) => {
          updateIds("yearId", value);
          form.setValue("catalog_year_id", value ? Number(value) : undefined, {
            shouldDirty: true,
          });
        }}
      />
      <VersionSelector
        makeId={ids.makeId ? Number(ids.makeId) : undefined}
        bodyTypeId={ids.bodyTypeId ? Number(ids.bodyTypeId) : undefined}
        fuelTypeId={ids.fuelTypeId ? Number(ids.fuelTypeId) : undefined}
        modelId={ids.modelId ? Number(ids.modelId) : undefined}
        yearId={ids.yearId ? Number(ids.yearId) : undefined}
        value={versionId ? String(versionId) : undefined}
        onChange={handleVersionChange}
        hideLabel={false}
      />
    </div>
  );
};
