'use client'

import { Controller, useForm, type Resolver } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { toast } from "sonner"

import { VehicleTransmissionTypeSelector } from "@/components/dynamicSelectors/vehicleTransmissionTypeSelector"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  VersionForm,
  type CatalogCascadeIds,
} from "@/components/vehicles/forms/versionForm"
import {
  buildTasacionPayload,
  createTasacionDefaultValues,
  tasacionSchema,
  type TasacionFormValues,
} from "../schemas/tasacion.schema"

const toCatalogId = (value?: string) => (value ? Number(value) : 0)

const syncCatalogIdsToForm = (
  ids: CatalogCascadeIds,
  setValue: ReturnType<typeof useForm<TasacionFormValues>>["setValue"],
) => {
  setValue("catalog_make_id", toCatalogId(ids.makeId))
  setValue("catalog_model_id", toCatalogId(ids.modelId))
  setValue("catalog_body_type_id", toCatalogId(ids.bodyTypeId))
  setValue("catalog_fuel_type_id", toCatalogId(ids.fuelTypeId))
  setValue("catalog_year_id", toCatalogId(ids.yearId))
}

export default function TasacionForm() {
  const form = useForm<TasacionFormValues>({
    resolver: standardSchemaResolver(tasacionSchema) as Resolver<TasacionFormValues>,
    defaultValues: createTasacionDefaultValues(),
  })

  const handleCatalogIdsChange = (ids: CatalogCascadeIds) => {
    syncCatalogIdsToForm(ids, form.setValue)
  }

  const handleSubmit = (values: TasacionFormValues) => {
    const payload = buildTasacionPayload(values)
    console.log(payload)
    toast.success("Datos listos para tasación")
  }

  return (
    <Card className="w-full border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.09)]">
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <CardContent className="px-6 py-6">
          <FieldGroup className="flex flex-col gap-4">
            <Controller
              name="version_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <VersionForm
                    ariaInvalid={fieldState.invalid}
                    versionId={
                      field.value > 0 ? String(field.value) : undefined
                    }
                    onVersionIdChange={(next) =>
                      field.onChange(next ? Number(next) : 0)
                    }
                    onCatalogIdsChange={handleCatalogIdsChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="transmission_type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sel-transmission">
                    Tipo de caja
                  </FieldLabel>
                  <VehicleTransmissionTypeSelector
                    value={field.value}
                    onValueChange={(next) =>
                      field.onChange(next ?? "manual")
                    }
                    disabled={field.disabled}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="mileage"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="input-km">
                    Kilómetros del vehículo
                  </FieldLabel>
                  <Input
                    ref={field.ref}
                    id="input-km"
                    type="number"
                    min={0}
                    placeholder="Ingresa"
                    value={field.value == null ? "" : String(field.value)}
                    onChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="postal_code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="input-cp">Código postal</FieldLabel>
                  <Input
                    ref={field.ref}
                    id="input-cp"
                    placeholder="Ingresa"
                    value={field.value}
                    onChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0">
          <Button type="submit" className="w-full bg-[#1746C8] hover:bg-blue-800">
            Obtener tasación
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
