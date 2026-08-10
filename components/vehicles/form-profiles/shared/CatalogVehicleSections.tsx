"use client";

import { useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Input } from "@/components/ui/input";
import { QuickCatalogFields } from "@/components/vehicles/quick-publish/QuickCatalogFields";
import { QuickVehicleClassificationFields } from "@/components/vehicles/quick-publish/QuickVehicleClassificationFields";
import { QuickVehiclePricingFields } from "@/components/vehicles/quick-publish/QuickVehiclePricingFields";
import { QuickVehicleTechnicalFields } from "@/components/vehicles/quick-publish/QuickVehicleTechnicalFields";
import type { VehicleFormSectionsProps } from "../types";
import type { VehicleFormValues } from "../shared/form-values";
import { SharedMediaSection } from "../shared/SharedMediaSection";
import {
  SharedContactSection,
  SharedDescriptionSection,
  SharedLocationSection,
} from "../shared/SharedLocationContact";
import { TypeAttributeTextField } from "../shared/TypeAttributeFields";

interface CatalogSectionsProps extends VehicleFormSectionsProps {
  showBodyStyle?: boolean;
}

export const CatalogVehicleSections = ({
  vehicleId,
  contactName,
  layout = "quick",
  showBodyStyle = false,
}: CatalogSectionsProps) => {
  const form = useFormContext<VehicleFormValues>();

  const identityBlock = (
    <div className="flex flex-col gap-4">
      <QuickCatalogFields />
      {showBodyStyle ? (
        <TypeAttributeTextField
          name="body_style"
          label="Carrocería"
          placeholder="Ej. furgón, combi, chasis cabina"
        />
      ) : null}
      {form.formState.errors.version_id ? (
        <p className="text-sm text-destructive">
          {form.formState.errors.version_id.message}
        </p>
      ) : null}
    </div>
  );

  if (layout === "professional") {
    return (
      <div className="flex flex-col gap-5">
        <Card className="bg-white shadow-sm ring-1 ring-gray-100">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">
              Marca y modelo
            </CardTitle>
            <CardDescription>
              Selecciona la versión del catálogo.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">{identityBlock}</CardContent>
        </Card>

        <Card className="bg-white shadow-sm ring-1 ring-gray-100">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">
              Datos de la unidad
            </CardTitle>
            <CardDescription>
              Estado, kilometraje y ficha técnica.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    min={0}
                    aria-invalid={fieldState.invalid}
                  />
                )}
              </ControllerInput>
              <ControllerInput
                name="price"
                control={form.control}
                label="Precio (€)"
              >
                {({ field, fieldState }) => (
                  <Input
                    {...field}
                    value={field.value == null ? "" : String(field.value)}
                    type="number"
                    min={0}
                    aria-invalid={fieldState.invalid}
                  />
                )}
              </ControllerInput>
            </div>
            <QuickVehicleTechnicalFields />
          </CardContent>
        </Card>

        <SharedLocationSection layout="professional" />
        <SharedDescriptionSection layout="professional" />
        <SharedMediaSection vehicleId={vehicleId} layout="professional" />
        <SharedContactSection
          contactName={contactName}
          layout="professional"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <SharedMediaSection vehicleId={vehicleId} />

      <VehicleFormStep number={2} label="¿Qué vehículo vendes?">
        {identityBlock}
      </VehicleFormStep>

      <QuickVehiclePricingFields />
      <QuickVehicleClassificationFields />

      <VehicleFormStep number={5} label="Ficha técnica">
        <QuickVehicleTechnicalFields />
      </VehicleFormStep>

      <SharedDescriptionSection />
      <SharedLocationSection />
      <SharedContactSection contactName={contactName} />
    </div>
  );
};
