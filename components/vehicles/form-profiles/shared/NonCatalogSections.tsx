"use client";

import { Controller, useFormContext } from "react-hook-form";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { VEHICLE_CONDITION_OPTIONS } from "@/components/vehicles/constants/vehicle-enums.constants";
import type { VehicleFormSectionsProps } from "../types";
import type { VehicleFormValues } from "../shared/form-values";
import { SharedMediaSection } from "../shared/SharedMediaSection";
import {
  SharedContactSection,
  SharedDescriptionSection,
  SharedLocationSection,
} from "../shared/SharedLocationContact";
import {
  FreeTextIdentityFields,
  TypeAttributeSelectField,
  TypeAttributeTextField,
} from "../shared/TypeAttributeFields";

const AUTOCARAVANA_SUBTYPES = [
  { value: "perfilada", label: "Perfilada" },
  { value: "capuchina", label: "Capuchina" },
  { value: "integral", label: "Integral" },
  { value: "camper", label: "Camper" },
  { value: "otra", label: "Otra" },
];

const CLASICO_SUBTYPES = [
  { value: "clasico", label: "Clásico" },
  { value: "competicion", label: "Competición" },
  { value: "ambos", label: "Clásico y competición" },
];

const CAMION_SUBTYPES = [
  { value: "rigido", label: "Rígido" },
  { value: "articulado", label: "Articulado" },
  { value: "ligero", label: "Ligero" },
  { value: "otro", label: "Otro" },
];

interface NonCatalogShellProps extends VehicleFormSectionsProps {
  identityLabel: string;
  identityDescription?: string;
  children: React.ReactNode;
  showConditionMileage?: boolean;
}

const NonCatalogShell = ({
  vehicleId,
  contactName,
  layout = "quick",
  identityLabel,
  identityDescription,
  children,
  showConditionMileage = true,
}: NonCatalogShellProps) => {
  const form = useFormContext<VehicleFormValues>();

  const pricingBlock = showConditionMileage ? (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Controller
        name="condition"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Estado</FieldLabel>
            <div className="flex gap-2">
              {VEHICLE_CONDITION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => field.onChange(option.value)}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    field.value === option.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background hover:bg-muted",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {fieldState.error ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />
      <ControllerInput name="mileage" control={form.control} label="Kilometraje">
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
      <ControllerInput name="price" control={form.control} label="Precio (€)">
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
  ) : (
    <ControllerInput name="price" control={form.control} label="Precio (€)">
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
  );

  if (layout === "professional") {
    return (
      <div className="flex flex-col gap-5">
        <Card className="bg-white shadow-sm ring-1 ring-gray-100">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">
              {identityLabel}
            </CardTitle>
            {identityDescription ? (
              <CardDescription>{identityDescription}</CardDescription>
            ) : null}
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-2">{children}</CardContent>
        </Card>
        <Card className="bg-white shadow-sm ring-1 ring-gray-100">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">
              Precio y estado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">{pricingBlock}</CardContent>
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
      <VehicleFormStep number={2} label={identityLabel}>
        <div className="flex flex-col gap-4">{children}</div>
      </VehicleFormStep>
      <VehicleFormStep number={3} label="Estado, kilometraje y precio">
        {pricingBlock}
      </VehicleFormStep>
      <SharedDescriptionSection stepNumber={4} />
      <SharedLocationSection stepNumber={5} />
      <SharedContactSection contactName={contactName} stepNumber={6} />
    </div>
  );
};

export const AutocaravanaSections = (props: VehicleFormSectionsProps) => (
  <NonCatalogShell
    {...props}
    identityLabel="Datos de la autocaravana"
    identityDescription="Título y subtipo del anuncio."
  >
    <FreeTextIdentityFields showTitle />
    <TypeAttributeSelectField
      name="subtype"
      label="Subtipo"
      options={AUTOCARAVANA_SUBTYPES}
    />
  </NonCatalogShell>
);

export const ClasicoSections = (props: VehicleFormSectionsProps) => (
  <NonCatalogShell
    {...props}
    identityLabel="Datos del clásico o competición"
  >
    <FreeTextIdentityFields showTitle />
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TypeAttributeSelectField
        name="subtype"
        label="Subtipo"
        options={CLASICO_SUBTYPES}
      />
      <TypeAttributeTextField name="year" label="Año" type="number" />
    </div>
  </NonCatalogShell>
);

export const CamionSections = (props: VehicleFormSectionsProps) => (
  <NonCatalogShell {...props} identityLabel="Datos del camión">
    <FreeTextIdentityFields showMakeModel />
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TypeAttributeSelectField
        name="subtype"
        label="Subtipo"
        options={CAMION_SUBTYPES}
      />
      <TypeAttributeTextField
        name="body_style"
        label="Carrocería"
        placeholder="Ej. caja, lonas, frigorífico"
      />
      <TypeAttributeTextField
        name="payload_kg"
        label="Carga útil (kg)"
        type="number"
      />
      <TypeAttributeTextField name="gvw_kg" label="PMA (kg)" type="number" />
    </div>
  </NonCatalogShell>
);

export const CocheSinCarnetSections = (props: VehicleFormSectionsProps) => (
  <NonCatalogShell
    {...props}
    identityLabel="Datos del coche sin carnet"
    showConditionMileage={false}
  >
    <FreeTextIdentityFields showMakeModel />
  </NonCatalogShell>
);

export const AutobusSections = (props: VehicleFormSectionsProps) => (
  <NonCatalogShell {...props} identityLabel="Datos del autobús">
    <FreeTextIdentityFields showMakeModel />
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TypeAttributeTextField name="power" label="Potencia (CV)" type="number" />
      <TypeAttributeTextField name="seats" label="Plazas" type="number" />
      <TypeAttributeTextField
        name="first_registration_date"
        label="Primera matriculación"
        type="date"
      />
      <TypeAttributeTextField
        name="registration_date"
        label="Matriculación actual (opcional)"
        type="date"
      />
    </div>
  </NonCatalogShell>
);
