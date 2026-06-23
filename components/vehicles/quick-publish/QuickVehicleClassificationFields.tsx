"use client";

import { useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { CategoriesSelector } from "@/components/dynamicSelectors/categoriesSelector";
import { ColorsSelector } from "@/components/dynamicSelectors/colorsSelector";
import { DgtLabelsSelector } from "@/components/dynamicSelectors/dgtLabelsSelector";
import { ControllerInput } from "@/components/ui/controllerInput";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";

export const QuickVehicleClassificationFields = () => {
  const form = useFormContext<QuickVehicleSchema>();

  return (
    <section className="flex flex-col gap-4">
      <VehicleFormStep
        number={4}
        label="Color, categoría y etiqueta DGT"
        description="Clasifica tu vehículo para que los compradores lo encuentren más fácilmente."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ControllerInput name="color_id" control={form.control} label="Color" optional>
          {({ field, fieldState }) => (
            <ColorsSelector
              value={field.value as string | undefined}
              onValueChange={field.onChange}
              ariaInvalid={fieldState.invalid}
              disabled={field.disabled}
            />
          )}
        </ControllerInput>
        <ControllerInput name="category_id" control={form.control} label="Categoría" optional>
          {({ field, fieldState }) => (
            <CategoriesSelector
              value={field.value as string | undefined}
              onValueChange={field.onChange}
              ariaInvalid={fieldState.invalid}
              disabled={field.disabled}
            />
          )}
        </ControllerInput>
        <ControllerInput name="dgt_label_id" control={form.control} label="Etiqueta DGT" optional>
          {({ field, fieldState }) => (
            <DgtLabelsSelector
              value={field.value as string | undefined}
              onValueChange={field.onChange}
              ariaInvalid={fieldState.invalid}
              disabled={field.disabled}
            />
          )}
        </ControllerInput>
      </div>
    </section>
  );
};
