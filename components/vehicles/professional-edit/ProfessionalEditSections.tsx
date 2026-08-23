"use client";

import type { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ControllerInput } from "@/components/ui/controllerInput";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MapInput } from "@/components/forms/mapInput";
import { PhoneInput } from "@/components/forms/phoneInput";
import { CategoriesSelector } from "@/components/dynamicSelectors/categoriesSelector";
import { ColorsSelector } from "@/components/dynamicSelectors/colorsSelector";
import { DgtLabelsSelector } from "@/components/dynamicSelectors/dgtLabelsSelector";
import { VehicleTypesSelector } from "@/components/dynamicSelectors/vehicleTypesSelector";
import { WarrantyTypesSelector } from "@/components/dynamicSelectors/warrantyTypesSelector";
import { ImagesForm } from "@/components/vehicles/forms/imagesForm";
import { VideosForm } from "@/components/vehicles/forms/videosForm";
import { VEHICLE_CONDITION_OPTIONS } from "@/components/vehicles/constants/vehicle-enums.constants";
import type { QuickVehicleSchema } from "@/components/vehicles/schemas/quick-vehicle.schema";
import { featuresService } from "@/components/vehicles/services/featuresService";
import { catalogServicesService } from "@/components/vehicles/services/catalogServicesService";
import { cuotasService } from "@/components/vehicles/services/cuotasService";
import { fuelTypesService } from "@/components/vehicles/services/fuelTypesService";
import { toggleCatalogIdInList } from "@/components/vehicles/utils/toggleCatalogIdInList";
import { cn } from "@/lib/utils";
import { QuickCatalogFields } from "@/components/vehicles/quick-publish/QuickCatalogFields";
import { QuickVehicleAiDescriptionCard } from "@/components/vehicles/quick-publish/QuickVehicleAiDescriptionCard";
import { QuickVehicleTechnicalFields } from "@/components/vehicles/quick-publish/QuickVehicleTechnicalFields";
import { VehiclePriceRecommendation } from "@/components/vehicles/quick-publish/VehiclePriceRecommendation";
import { GeneratedDescriptionConfig } from "@/components/vehicles/quick-publish/generatedDescription/generatedDescriptionConfig";
import {
  PROFESSIONAL_EDIT_SECTIONS,
  type ProfessionalEditSectionId,
} from "./professional-edit.constants";

interface ProfessionalEditSectionsProps {
  vehicleId: string;
  contactName: string;
  onImageUploadStatusChange?: (hasIncompleteUploads: boolean) => void;
}

interface SectionShellProps {
  id: ProfessionalEditSectionId;
  title: string;
  description: string;
  children: ReactNode;
}

const SectionShell = ({ id, title, description, children }: SectionShellProps) => (
  <Card id={id} className="bg-white shadow-sm ring-1 ring-gray-100">
    <CardHeader className="border-b border-gray-100 pb-4">
      <CardTitle className="text-base font-semibold text-gray-900">
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="pt-2">{children}</CardContent>
  </Card>
);

const toggleCuotaIdInList = (
  currentIds: string[],
  cuotaId: string,
  checked: boolean,
): string[] => {
  if (checked) {
    if (currentIds.includes(cuotaId)) {
      return currentIds;
    }
    return [...currentIds, cuotaId];
  }
  return currentIds.filter((id) => id !== cuotaId);
};

export const ProfessionalEditSections = ({
  vehicleId,
  contactName,
  onImageUploadStatusChange,
}: ProfessionalEditSectionsProps) => {
  const form = useFormContext<QuickVehicleSchema>();
  const phoneValue = form.watch("phone");
  const fuelTypeId = form.watch("catalog_fuel_type_id");

  const { data: features } = useQuery({
    queryKey: ["features"],
    queryFn: () => featuresService.findAll({ page: 1, limit: 100 }),
  });

  const { data: services } = useQuery({
    queryKey: ["catalog-services"],
    queryFn: () => catalogServicesService.findAll({ page: 1, limit: 100 }),
  });

  const { data: cuotasPage } = useQuery({
    queryKey: ["cuotas", "all-plans"],
    queryFn: () => cuotasService.findAll({ page: 1, limit: 100 }),
  });

  const { data: fuelType } = useQuery({
    queryKey: ["fuelType", fuelTypeId],
    queryFn: () => fuelTypesService.findOne(fuelTypeId!),
    enabled: Boolean(fuelTypeId && fuelTypeId > 0),
  });

  const cuotas = cuotasPage?.data ?? [];

  const getSection = (id: ProfessionalEditSectionId) =>
    PROFESSIONAL_EDIT_SECTIONS.find((section) => section.id === id)!;

  return (
    <div className="flex flex-col gap-5">
      <SectionShell {...getSection("marca-modelo")}>
        <div className="flex flex-col gap-4">
          <ControllerInput
            name="vehicle_type_id"
            control={form.control}
            label="Tipo de vehículo"
          >
            {({ field, fieldState }) => (
              <VehicleTypesSelector
                value={field.value as string | undefined}
                onValueChange={field.onChange}
                ariaInvalid={fieldState.invalid}
                disabled={field.disabled}
              />
            )}
          </ControllerInput>
          <QuickCatalogFields />
          {form.formState.errors.version_id ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.version_id.message}
            </p>
          ) : null}
        </div>
      </SectionShell>

      <SectionShell {...getSection("datos-unidad")}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          </div>

          <Field>
            <FieldLabel>Combustible</FieldLabel>
            <Input
              value={fuelType?.name ?? "Se obtiene de la versión seleccionada"}
              readOnly
              disabled
              aria-label="Combustible del vehículo"
            />
            <FieldDescription>
              El combustible se toma automáticamente de la versión del catálogo.
            </FieldDescription>
          </Field>

          <ControllerInput
            name="dgt_label_id"
            control={form.control}
            label="Etiqueta DGT"
            optional
          >
            {({ field, fieldState }) => (
              <DgtLabelsSelector
                value={field.value as string | undefined}
                onValueChange={field.onChange}
                ariaInvalid={fieldState.invalid}
                disabled={field.disabled}
              />
            )}
          </ControllerInput>

          <QuickVehicleTechnicalFields />
        </div>
      </SectionShell>

      <SectionShell {...getSection("ubicacion")}>
        <div className="flex flex-col gap-4">
          <Controller
            name="lat"
            control={form.control}
            render={({ field: latField, fieldState }) => {
              const lng = form.watch("lng");
              return (
                <MapInput
                  value={{ lat: latField.value, lng }}
                  onChange={({ lat, lng: nextLng }) => {
                    latField.onChange(lat);
                    form.setValue("lng", nextLng, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  ariaInvalid={
                    fieldState.invalid || Boolean(form.formState.errors.lng)
                  }
                />
              );
            }}
          />
          <ControllerInput
            name="category_id"
            control={form.control}
            label="Categoría / uso"
            optional
          >
            {({ field, fieldState }) => (
              <CategoriesSelector
                value={field.value as string | undefined}
                onValueChange={field.onChange}
                ariaInvalid={fieldState.invalid}
                disabled={field.disabled}
              />
            )}
          </ControllerInput>
        </div>
      </SectionShell>

      <SectionShell {...getSection("vehiculo-exterior")}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ControllerInput
            name="license_plate"
            control={form.control}
            label="Matrícula"
            optional
          >
            {({ field, fieldState }) => (
              <Input
                {...field}
                value={String(field.value ?? "")}
                aria-invalid={fieldState.invalid}
              />
            )}
          </ControllerInput>
          <ControllerInput
            name="vin_code"
            control={form.control}
            label="VIN / bastidor"
            optional
          >
            {({ field, fieldState }) => (
              <Input
                {...field}
                value={String(field.value ?? "")}
                aria-invalid={fieldState.invalid}
              />
            )}
          </ControllerInput>
          <ControllerInput
            name="color_id"
            control={form.control}
            label="Color"
            optional
          >
            {({ field, fieldState }) => (
              <ColorsSelector
                value={field.value as string | undefined}
                onValueChange={field.onChange}
                ariaInvalid={fieldState.invalid}
                disabled={field.disabled}
              />
            )}
          </ControllerInput>
        </div>
      </SectionShell>

      <SectionShell {...getSection("equipamiento")}>
        <div className="flex flex-col gap-6">
          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-900">Extras</h4>
            <Controller
              name="features_ids"
              control={form.control}
              render={({ field, fieldState }) => {
                const ids = field.value ?? [];
                return (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {features?.data.map((feature) => {
                      const checkboxId = `pro-feature-${feature.id}`;
                      return (
                        <Field
                          key={feature.id}
                          orientation="horizontal"
                          className="flex-row-reverse items-center gap-3"
                        >
                          <FieldLabel htmlFor={checkboxId}>
                            {feature.name}
                          </FieldLabel>
                          <Checkbox
                            id={checkboxId}
                            checked={ids.includes(feature.id)}
                            onCheckedChange={(checked) =>
                              field.onChange(
                                toggleCatalogIdInList(
                                  ids,
                                  feature.id,
                                  checked === true,
                                ),
                              )
                            }
                          />
                        </Field>
                      );
                    })}
                    {fieldState.error ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </div>
                );
              }}
            />
          </div>

          <div>
            <h4 className="mb-3 text-sm font-medium text-gray-900">Servicios</h4>
            <Controller
              name="services_ids"
              control={form.control}
              render={({ field, fieldState }) => {
                const ids = field.value ?? [];
                return (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {(services?.data ?? []).map((service) => {
                      const checkboxId = `pro-service-${service.id}`;
                      return (
                        <Field
                          key={service.id}
                          orientation="horizontal"
                          className="flex-row-reverse items-center gap-3"
                        >
                          <FieldLabel htmlFor={checkboxId}>
                            {service.name}
                          </FieldLabel>
                          <Checkbox
                            id={checkboxId}
                            checked={ids.includes(service.id)}
                            onCheckedChange={(checked) =>
                              field.onChange(
                                toggleCatalogIdInList(
                                  ids,
                                  service.id,
                                  checked === true,
                                ),
                              )
                            }
                          />
                        </Field>
                      );
                    })}
                    {fieldState.error ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </div>
                );
              }}
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell {...getSection("precio-garantia")}>
        <div className="flex flex-col gap-4">
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
          <VehiclePriceRecommendation />
          <ControllerInput
            name="warranty_type_id"
            control={form.control}
            label="Tipo de garantía"
            optional
          >
            {({ field, fieldState }) => (
              <WarrantyTypesSelector
                value={field.value as string | undefined}
                onValueChange={field.onChange}
                ariaInvalid={fieldState.invalid}
                disabled={field.disabled}
              />
            )}
          </ControllerInput>
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-900">
              Cuotas / financiación
            </h4>
            <p className="mb-3 text-sm text-muted-foreground">
              Marca uno o más planes disponibles para este anuncio.
            </p>
            <Controller
              name="cuota_ids"
              control={form.control}
              render={({ field, fieldState }) => {
                const ids = Array.isArray(field.value) ? field.value : [];
                return (
                  <>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {cuotas.map((cuota) => {
                        const checkboxId = `pro-cuota-${cuota.id}`;
                        const label = `${cuota.name} (${cuota.value})`;
                        return (
                          <Field
                            key={cuota.id}
                            orientation="horizontal"
                            className="flex-row-reverse items-center gap-3"
                            data-invalid={fieldState.invalid}
                          >
                            <FieldLabel htmlFor={checkboxId}>{label}</FieldLabel>
                            <Checkbox
                              id={checkboxId}
                              checked={ids.includes(cuota.id)}
                              onCheckedChange={(checked) => {
                                field.onChange(
                                  toggleCuotaIdInList(
                                    ids,
                                    cuota.id,
                                    checked === true,
                                  ),
                                );
                              }}
                              aria-invalid={fieldState.invalid}
                            />
                          </Field>
                        );
                      })}
                    </div>
                    {!cuotas.length ? (
                      <p className="text-sm text-muted-foreground">
                        No hay planes configurados.
                      </p>
                    ) : null}
                    {fieldState.error ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </>
                );
              }}
            />
          </div>
        </div>
      </SectionShell>

      <SectionShell {...getSection("texto-comercial")}>
        <div className="flex flex-col gap-4">
          <QuickVehicleAiDescriptionCard />
          <GeneratedDescriptionConfig />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="pro-description">Descripción</FieldLabel>
                <Textarea
                  {...field}
                  id="pro-description"
                  className="h-72 resize-none whitespace-pre-wrap"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </div>
      </SectionShell>

      <SectionShell {...getSection("video")}>
        <Controller
          name="videos"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <VideosForm
                value={field.value ?? []}
                onChange={field.onChange}
              />
              {fieldState.error ? (
                <p className="mt-2 text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />
      </SectionShell>

      <SectionShell {...getSection("fotografias")}>
        <Controller
          name="images"
          control={form.control}
          render={({ field, fieldState }) => (
            <div>
              <ImagesForm
                value={field.value}
                onChange={field.onChange}
                reference_id={vehicleId}
                onUploadStatusChange={onImageUploadStatusChange}
              />
              {fieldState.error ? (
                <p className="mt-2 text-sm text-destructive">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />
      </SectionShell>

      <SectionShell {...getSection("contacto")}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="pro-contact-name">Nombre</FieldLabel>
              <Input
                id="pro-contact-name"
                value={contactName}
                readOnly
                disabled
              />
            </Field>
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="pro-phone">Teléfono</FieldLabel>
                  <PhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    ariaInvalid={fieldState.invalid}
                  />
                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            <ControllerInput name="email" control={form.control} label="Email">
              {({ field, fieldState }) => (
                <Input
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  ref={field.ref}
                  value={String(field.value ?? "")}
                  type="email"
                  aria-invalid={fieldState.invalid}
                />
              )}
            </ControllerInput>
          </div>

          <Controller
            name="show_phone"
            control={form.control}
            render={({ field }) => (
              <Field>
                <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="space-y-1">
                    <FieldLabel htmlFor="pro-show-phone">
                      Mostrar teléfono en el anuncio
                    </FieldLabel>
                    <FieldDescription>
                      Si lo desactivas, se ocultará el contacto telefónico en el
                      anuncio público.
                    </FieldDescription>
                  </div>
                  <Switch
                    id="pro-show-phone"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Mostrar teléfono en el anuncio"
                  />
                </div>
              </Field>
            )}
          />

          <Controller
            name="has_whatsapp"
            control={form.control}
            render={({ field }) => (
              <Field>
                <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="space-y-1">
                    <FieldLabel htmlFor="pro-has-whatsapp">
                      Disponible por WhatsApp
                    </FieldLabel>
                    <FieldDescription>
                      Indica si el número de contacto puede recibir mensajes por
                      WhatsApp.
                    </FieldDescription>
                  </div>
                  <Switch
                    id="pro-has-whatsapp"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!phoneValue?.phone?.trim()}
                    aria-label="Disponible por WhatsApp"
                  />
                </div>
              </Field>
            )}
          />
        </div>
      </SectionShell>
    </div>
  );
};
