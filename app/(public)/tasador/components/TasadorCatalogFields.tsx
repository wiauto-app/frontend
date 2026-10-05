"use client";

import { useQuery } from "@tanstack/react-query";
import { useFormContext, useWatch } from "react-hook-form";

import { MakeSelector } from "@/components/dynamicSelectors/makeSelector";
import { ModelSelector } from "@/components/dynamicSelectors/modelSelector";
import { QuickYearSelector } from "@/components/dynamicSelectors/quickYearSelector";
import { VersionSelector } from "@/components/dynamicSelectors/versionSelector";
import { fuelTypesService } from "@/components/vehicles/services/fuelTypesService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StrapiTasadorFormulario } from "@/interfaces/strapi-components.interface";

import type { TasadorFormInput } from "../schemas/tasador.schema";
import { FieldError } from "./TasadorFieldError";

interface TasadorCatalogFieldsProps {
  content: StrapiTasadorFormulario;
}

const toSelectValue = (value: unknown): string | undefined =>
  Number(value) > 0 ? String(value) : undefined;

/** Marca → modelo → año → versión, más el combustible que define la versión. */
export const TasadorCatalogFields = ({ content }: TasadorCatalogFieldsProps) => {
  const form = useFormContext<TasadorFormInput>();
  const [makeId, modelId, yearId, versionId, fuelTypeId] = useWatch({
    control: form.control,
    name: [
      "catalog_make_id",
      "catalog_model_id",
      "catalog_year_id",
      "version_id",
      "fuel_type_id",
    ],
  });
  const errors = form.formState.errors;

  const { data: fuelType } = useQuery({
    queryKey: ["catalogFuelType", fuelTypeId],
    queryFn: () => fuelTypesService.findOne(Number(fuelTypeId)),
    enabled: Number(fuelTypeId) > 0,
    staleTime: Infinity,
  });

  const setId = (
    name: "catalog_make_id" | "catalog_model_id" | "catalog_year_id" | "version_id",
    value: string | undefined,
  ) => {
    form.setValue(name, value ? Number(value) : 0, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const resetFrom = (
    names: ("catalog_model_id" | "catalog_year_id" | "version_id")[],
  ) => {
    for (const name of names) {
      form.setValue(name, 0, { shouldDirty: true });
    }
    form.setValue("fuel_type_id", undefined, { shouldDirty: true });
  };

  return (
    <>
      <div>
        <MakeSelector
          label={`${content.marca?.label ?? "Marca"} *`}
          placeholder={content.marca?.placeholder ?? undefined}
          value={toSelectValue(makeId)}
          ariaInvalid={Boolean(errors.catalog_make_id)}
          onChange={(value) => {
            setId("catalog_make_id", value);
            resetFrom(["catalog_model_id", "catalog_year_id", "version_id"]);
          }}
        />
        <FieldError message={errors.catalog_make_id?.message} />
      </div>

      <div>
        <ModelSelector
          label={`${content.modelo?.label ?? "Modelo"} *`}
          placeholder={content.modelo?.placeholder ?? undefined}
          makeId={Number(makeId) > 0 ? Number(makeId) : undefined}
          value={toSelectValue(modelId)}
          ariaInvalid={Boolean(errors.catalog_model_id)}
          onChange={(value) => {
            setId("catalog_model_id", value);
            resetFrom(["catalog_year_id", "version_id"]);
          }}
        />
        <FieldError message={errors.catalog_model_id?.message} />
      </div>

      <div>
        <QuickYearSelector
          label={`${content.anio?.label ?? "Año"} *`}
          placeholder={content.anio?.placeholder ?? undefined}
          modelId={Number(modelId) > 0 ? Number(modelId) : undefined}
          value={toSelectValue(yearId)}
          ariaInvalid={Boolean(errors.catalog_year_id)}
          onChange={(value) => {
            setId("catalog_year_id", value);
            resetFrom(["version_id"]);
          }}
        />
        <FieldError message={errors.catalog_year_id?.message} />
      </div>

      <div>
        <VersionSelector
          label={`${content.version?.label ?? "Versión"} *`}
          placeholder={content.version?.placeholder ?? undefined}
          modelId={Number(modelId) > 0 ? Number(modelId) : undefined}
          yearId={Number(yearId) > 0 ? Number(yearId) : undefined}
          value={toSelectValue(versionId)}
          ariaInvalid={Boolean(errors.version_id)}
          onChange={(value, version) => {
            setId("version_id", value);
            form.setValue("fuel_type_id", version?.fuel_type_id, { shouldDirty: true });
          }}
        />
        <FieldError message={errors.version_id?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="tasador-fuel">{content.combustible?.label}</Label>
        <Input
          id="tasador-fuel"
          readOnly
          tabIndex={-1}
          className="bg-slate-50"
          value={fuelType?.name ?? ""}
          placeholder={content.combustible?.placeholder ?? undefined}
        />
      </div>
    </>
  );
};
