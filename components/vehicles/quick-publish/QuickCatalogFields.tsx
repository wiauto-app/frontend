"use client";

import { useFormContext } from "react-hook-form";
import { MakeSelector } from "@/components/dynamicSelectors/makeSelector";
import { ModelSelector } from "@/components/dynamicSelectors/modelSelector";
import { QuickYearSelector } from "@/components/dynamicSelectors/quickYearSelector";
import { VersionSelector } from "@/components/dynamicSelectors/versionSelector";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Input } from "@/components/ui/input";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { fuelTypesService } from "@/components/vehicles/services/fuelTypesService";
import { CatalogVersionItem } from "../types/catalog.types";
import { QuickCatalogFuelBodyFields } from "./QuickCatalogFuelBodyFields";
import { requestPublishDatosCheck } from "./QuickVehiclePublishDataTracker";

const clearElectricFields = (
  setValue: ReturnType<typeof useFormContext<QuickVehicleSchema>>["setValue"],
) => {
  setValue("autonomy", undefined, { shouldDirty: true });
  setValue("battery_capacity", undefined, { shouldDirty: true });
  setValue("time_to_charge", undefined, { shouldDirty: true });
};

interface QuickCatalogFieldsProps {
  showFuelAndBodySelectors?: boolean;
}

export const QuickCatalogFields = ({
  showFuelAndBodySelectors = false,
}: QuickCatalogFieldsProps) => {
  const form = useFormContext<QuickVehicleSchema>();

  const versionId = form.watch("version_id");
  const catalogMakeId = form.watch("catalog_make_id");
  const catalogModelId = form.watch("catalog_model_id");
  const catalogYearId = form.watch("catalog_year_id");
  const syncFieldsFromVersion = async (version?: CatalogVersionItem) => {
    if (!version) {
      form.setValue("catalog_fuel_type_id", undefined, {
        shouldDirty: true,
      });

      form.setValue("catalog_body_type_id", undefined, {
        shouldDirty: true,
      });

      form.setValue("catalog_fuel_can_charge", false, {
        shouldDirty: true,
      });

      clearElectricFields(form.setValue);

      return;
    }

    form.setValue("catalog_fuel_type_id", version.fuel_type_id, {
      shouldDirty: true,
    });

    form.setValue("catalog_body_type_id", version.body_type_id, {
      shouldDirty: true,
    });

    try {
      const fuelType = await fuelTypesService.findOne(version.fuel_type_id);

      form.setValue("catalog_fuel_can_charge", fuelType.can_charge, {
        shouldDirty: true,
      });

      if (!fuelType.can_charge) {
        clearElectricFields(form.setValue);
      }
    } catch {
      form.setValue("catalog_fuel_can_charge", false, {
        shouldDirty: true,
      });

      clearElectricFields(form.setValue);
    }
  };

  const handleVersionChange = (
    value: string | undefined,
    version?: CatalogVersionItem,
  ) => {
  
    const numericVersionId = value ? Number(value) : 0;

    form.setValue("version_id", numericVersionId, {
      shouldDirty: true,
      shouldValidate: true,
    });

    void syncFieldsFromVersion(version).finally(() => {
      requestPublishDatosCheck();
    });
  };

  // useEffect(() => {
  //   if (!versionId || versionId <= 0) return;
  //   if (form.getValues("catalog_fuel_type_id")) return;

  //   void syncFieldsFromVersion(versionId);
  // }, [versionId, form]);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <MakeSelector
        value={catalogMakeId !== undefined ? String(catalogMakeId) : undefined}
        onChange={(value) => {
          form.setValue("catalog_make_id", value ? Number(value) : undefined, {
            shouldDirty: true,
          });

          form.setValue("catalog_model_id", undefined, {
            shouldDirty: true,
          });

          form.setValue("catalog_year_id", undefined, {
            shouldDirty: true,
          });

          form.setValue("version_id", 0, {
            shouldDirty: true,
            shouldValidate: true,
          });

          form.setValue("catalog_body_type_id", undefined, {
            shouldDirty: true,
          });

          form.setValue("catalog_fuel_type_id", undefined, {
            shouldDirty: true,
          });

          clearElectricFields(form.setValue);
          requestPublishDatosCheck();
        }}
      />

      <ModelSelector
        makeId={catalogMakeId !== undefined ? Number(catalogMakeId) : undefined}
        value={
          catalogModelId !== undefined ? String(catalogModelId) : undefined
        }
        onChange={(value) => {
          form.setValue("catalog_model_id", value ? Number(value) : undefined, {
            shouldDirty: true,
          });

          form.setValue("catalog_year_id", undefined, {
            shouldDirty: true,
          });

          form.setValue("version_id", 0, {
            shouldDirty: true,
            shouldValidate: true,
          });

          form.setValue("catalog_body_type_id", undefined, {
            shouldDirty: true,
          });

          form.setValue("catalog_fuel_type_id", undefined, {
            shouldDirty: true,
          });

          clearElectricFields(form.setValue);
          requestPublishDatosCheck();
        }}
      />

      <QuickYearSelector
        modelId={
          catalogModelId !== undefined ? Number(catalogModelId) : undefined
        }
        value={catalogYearId !== undefined ? String(catalogYearId) : undefined}
        onChange={(value) => {
          form.setValue("catalog_year_id", value ? Number(value) : undefined, {
            shouldDirty: true,
            shouldValidate: true,
          });
          form.setValue("version_id", 0, {
            shouldDirty: true,
            shouldValidate: true,
          });
          form.setValue("catalog_body_type_id", undefined, {
            shouldDirty: true,
          });
          form.setValue("catalog_fuel_type_id", undefined, {
            shouldDirty: true,
          });
          clearElectricFields(form.setValue);
          requestPublishDatosCheck();
        }}
      />

      <div className="col-span-1 grid grid-cols-1 gap-3 md:grid-cols-2 sm:col-span-2 lg:col-span-3">
        <VersionSelector
          makeId={
            catalogMakeId !== undefined ? Number(catalogMakeId) : undefined
          }
          modelId={
            catalogModelId !== undefined ? Number(catalogModelId) : undefined
          }
          yearId={
            catalogYearId !== undefined ? Number(catalogYearId) : undefined
          }
          value={versionId ? String(versionId) : undefined}
          onChange={handleVersionChange}
          hideLabel={false}
          disabled={!catalogYearId}
        />

        <ControllerInput
          name="mileage"
          control={form.control}
          label="Kilometraje"
        >
          {({ field, fieldState }) => (
            <Input
              {...field}
              value={field.value == null ? "" : String(field.value)}
              type="number"
              inputMode="numeric"
              min={0}
              max={9999999}
              placeholder="Ej. 85000"
              aria-invalid={fieldState.invalid}
              onBlur={() => {
                field.onBlur();
                requestPublishDatosCheck();
              }}
            />
          )}
        </ControllerInput>
      </div>

      {showFuelAndBodySelectors ? <QuickCatalogFuelBodyFields /> : null}
    </div>
  );
};
