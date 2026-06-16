"use client";

import { MakeSelector } from "@/components/dynamicSelectors/makeSelector";
import { ModelSelector } from "@/components/dynamicSelectors/modelSelector";
import { QuickYearSelector } from "@/components/dynamicSelectors/quickYearSelector";
import { VersionSelector } from "@/components/dynamicSelectors/versionSelector";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";

type CatalogIds = {
  makeId?: string;
  modelId?: string;
  yearId?: string;
};

export const QuickCatalogFields = () => {
  const form = useFormContext<QuickVehicleSchema>();
  const versionId = form.watch("version_id");

  const [ids, setIds] = useState<CatalogIds>(() => ({
    makeId: form.getValues("catalog_make_id")
      ? String(form.getValues("catalog_make_id"))
      : undefined,
    modelId: form.getValues("catalog_model_id")
      ? String(form.getValues("catalog_model_id"))
      : undefined,
    yearId: form.getValues("catalog_year_id")
      ? String(form.getValues("catalog_year_id"))
      : undefined,
  }));

  const initialSignature = useMemo(
    () =>
      [
        form.getValues("catalog_make_id") ?? "",
        form.getValues("catalog_model_id") ?? "",
        form.getValues("catalog_year_id") ?? "",
      ].join(":"),
    [],
  );

  useEffect(() => {
    const makeId = form.getValues("catalog_make_id");
    if (!makeId) return;
    setIds({
      makeId: String(makeId),
      modelId: form.getValues("catalog_model_id")
        ? String(form.getValues("catalog_model_id"))
        : undefined,
      yearId: form.getValues("catalog_year_id")
        ? String(form.getValues("catalog_year_id"))
        : undefined,
    });
  }, [initialSignature, form]);

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
  };

  const handleVersionChange = (value: string | undefined) => {
    form.setValue(
      "version_id",
      value ? Number(value) : 0,
      { shouldDirty: true, shouldValidate: true },
    );
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MakeSelector
        value={ids.makeId}
        onChange={(value) => {
          updateIds("makeId", value, ["modelId", "yearId"]);
          form.setValue(
            "catalog_make_id",
            value ? Number(value) : undefined,
            { shouldDirty: true },
          );
        }}
      />
      <ModelSelector
        makeId={ids.makeId ? Number(ids.makeId) : undefined}
        value={ids.modelId}
        onChange={(value) => {
          updateIds("modelId", value, ["yearId"]);
          form.setValue(
            "catalog_model_id",
            value ? Number(value) : undefined,
            { shouldDirty: true },
          );
        }}
      />
      <QuickYearSelector
        modelId={ids.modelId ? Number(ids.modelId) : undefined}
        value={ids.yearId}
        onChange={(value) => {
          updateIds("yearId", value);
          form.setValue(
            "catalog_year_id",
            value ? Number(value) : undefined,
            { shouldDirty: true },
          );
        }}
      />
      <VersionSelector
        modelId={ids.modelId ? Number(ids.modelId) : undefined}
        yearId={ids.yearId ? Number(ids.yearId) : undefined}
        value={versionId ? String(versionId) : undefined}
        onChange={handleVersionChange}
        hideLabel={false}
      />
    </div>
  );
};
