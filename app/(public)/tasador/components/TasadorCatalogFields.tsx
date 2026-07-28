"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { MakeSelector } from "@/components/dynamicSelectors/makeSelector";
import { ModelSelector } from "@/components/dynamicSelectors/modelSelector";
import { QuickYearSelector } from "@/components/dynamicSelectors/quickYearSelector";
import { VersionSelector } from "@/components/dynamicSelectors/versionSelector";
import { catalogVersionsService } from "@/components/vehicles/services/catalogVersionsService";

import type { TasadorSchema } from "../schemas/tasador.schema";

interface CatalogIds {
  makeId?: string;
  modelId?: string;
  yearId?: string;
}

export const TasadorCatalogFields = () => {
  const form = useFormContext<TasadorSchema>();
  const versionId = form.watch("version_id");
  const makeId = form.watch("catalog_make_id");
  const modelId = form.watch("catalog_model_id");
  const yearId = form.watch("catalog_year_id");

  const [ids, setIds] = useState<CatalogIds>(() => ({
    makeId: makeId ? String(makeId) : undefined,
    modelId: modelId ? String(modelId) : undefined,
    yearId: yearId ? String(yearId) : undefined,
  }));

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
    form.setValue("version_id", 0, { shouldDirty: true });
    form.setValue("fuel_type_id", undefined, { shouldDirty: true });
    form.setValue("body_type_id", undefined, { shouldDirty: true });
  };

  const handleVersionChange = async (value: string | undefined) => {
    const numericVersionId = value ? Number(value) : 0;
    form.setValue("version_id", numericVersionId, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (!numericVersionId) {
      form.setValue("fuel_type_id", undefined, { shouldDirty: true });
      form.setValue("body_type_id", undefined, { shouldDirty: true });
      return;
    }

    try {
      const version = await catalogVersionsService.findOne(numericVersionId);
      form.setValue("fuel_type_id", version.fuel_type_id, { shouldDirty: true });
      form.setValue("body_type_id", version.body_type_id, { shouldDirty: true });
    } catch {
      form.setValue("fuel_type_id", undefined, { shouldDirty: true });
      form.setValue("body_type_id", undefined, { shouldDirty: true });
    }
  };

  useEffect(() => {
    setIds({
      makeId: makeId ? String(makeId) : undefined,
      modelId: modelId ? String(modelId) : undefined,
      yearId: yearId ? String(yearId) : undefined,
    });
  }, [makeId, modelId, yearId]);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MakeSelector
        value={ids.makeId}
        ariaInvalid={Boolean(form.formState.errors.catalog_make_id)}
        onChange={(value) => {
          updateIds("makeId", value, ["modelId", "yearId"]);
          form.setValue("catalog_make_id", value ? Number(value) : 0, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
      <ModelSelector
        makeId={ids.makeId ? Number(ids.makeId) : undefined}
        value={ids.modelId}
        ariaInvalid={Boolean(form.formState.errors.catalog_model_id)}
        onChange={(value) => {
          updateIds("modelId", value, ["yearId"]);
          form.setValue("catalog_model_id", value ? Number(value) : 0, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
      <QuickYearSelector
        modelId={ids.modelId ? Number(ids.modelId) : undefined}
        value={ids.yearId}
        ariaInvalid={Boolean(form.formState.errors.catalog_year_id)}
        onChange={(value) => {
          updateIds("yearId", value);
          form.setValue("catalog_year_id", value ? Number(value) : 0, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
      <VersionSelector
        modelId={ids.modelId ? Number(ids.modelId) : undefined}
        yearId={ids.yearId ? Number(ids.yearId) : undefined}
        value={versionId ? String(versionId) : undefined}
        ariaInvalid={Boolean(form.formState.errors.version_id)}
        onChange={(value) => {
          void handleVersionChange(value);
        }}
        hideLabel={false}
      />
    </div>
  );
};
