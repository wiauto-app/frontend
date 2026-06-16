"use client";

import { useContext, useEffect } from "react";
import { FormProvider, useForm, Controller, type Resolver } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "@/app/contexts/auth/authContext";
import { VehicleFormStep } from "@/app/(public)/components/vehicleFormStep";
import { ControllerInput } from "@/components/ui/controllerInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/forms/phoneInput";
import { MapInput } from "@/components/forms/mapInput";
import { ImagesForm } from "@/components/vehicles/forms/imagesForm";
import { cn } from "@/lib/utils";
import {
  createQuickVehicleDefaultValues,
  quickVehicleSchema,
  type QuickVehicleSchema,
} from "@/components/vehicles/schemas/quick-vehicle.schema";
import { VEHICLE_CONDITION_OPTIONS } from "@/components/vehicles/constants/vehicle-enums.constants";
import { vehiclesService } from "@/components/vehicles/services/vehiclesService";
import { serializeQuickVehiclePayload } from "@/components/vehicles/utils/serializeQuickVehiclePayload";
import { mapVehicleDetailToQuickFormValues } from "@/components/vehicles/utils/mapVehicleDetailToQuickFormValues";
import { QuickCatalogFields } from "./QuickCatalogFields";
import { QuickVehiclePreview } from "./QuickVehiclePreview";
import { QuickVehicleOptionalSections } from "./QuickVehicleOptionalSections";
import { QuickVehicleTechnicalFields } from "./QuickVehicleTechnicalFields";

type QuickVehicleFormProps = {
  vehicleId?: string;
  onSuccess?: () => void;
};

export const QuickVehicleForm = ({ vehicleId, onSuccess }: QuickVehicleFormProps) => {
  const authContext = useContext(AuthContext);
  const isEditMode = Boolean(vehicleId);

  const { data: vehicleDetail, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => vehiclesService.findOne(vehicleId ?? ""),
    enabled: isEditMode,
  });

  const form = useForm<QuickVehicleSchema>({
    resolver: standardSchemaResolver(quickVehicleSchema) as Resolver<QuickVehicleSchema>,
    defaultValues: createQuickVehicleDefaultValues,
  });

  useEffect(() => {
    if (vehicleDetail) {
      form.reset(mapVehicleDetailToQuickFormValues(vehicleDetail));
    }
  }, [vehicleDetail, form]);

  useEffect(() => {
    const user = authContext?.user;
    if (!user || isEditMode) return;

    if (user.email && !form.getValues("email")) {
      form.setValue("email", user.email);
    }
  }, [authContext?.user, form, isEditMode]);

  const handleSubmit = async (data: QuickVehicleSchema) => {
    const payload = serializeQuickVehiclePayload(data, { isUpdate: Boolean(vehicleId) });
    if (vehicleId) {
      const response = await vehiclesService.update(vehicleId, payload as never);
      if (response.ok) {
        toast.success("Vehículo actualizado correctamente");
        onSuccess?.();
      } else {
        toast.error(response.message || "Error al actualizar el vehículo");
      }
      return;
    }

    const response = await vehiclesService.create(payload as never);
    if (response.ok) {
      toast.success("Vehículo publicado correctamente");
      onSuccess?.();
    } else {
      toast.error(response.message || "Error al publicar el vehículo");
    }
  };

  if (isEditMode && isLoadingVehicle) {
    return (
      <div className="flex min-h-48 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        Cargando anuncio…
      </div>
    );
  }

  const contactName = authContext?.user
    ? [authContext.user.name, authContext.user.last_name].filter(Boolean).join(" ")
    : "";

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <div className="flex flex-col gap-6 lg:col-span-3">
          <section className="flex flex-col gap-4">
            <VehicleFormStep
              number={1}
              label="Fotos del vehículo"
              isRequired
              description="Añade al menos 3 fotos. Arrastra y suelta o selecciona desde tu dispositivo."
            />
            <Controller
              name="images"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <ImagesForm value={field.value} onChange={field.onChange} reference_id={vehicleId} />
                  {fieldState.error ? (
                    <p className="mt-2 text-sm text-destructive">{fieldState.error.message}</p>
                  ) : null}
                </div>
              )}
            />
          </section>

          <section className="flex flex-col gap-4">
            <VehicleFormStep number={2} label="¿Qué vehículo vendes?" isRequired />
            <QuickCatalogFields />
            {form.formState.errors.version_id ? (
              <p className="text-sm text-destructive">{form.formState.errors.version_id.message}</p>
            ) : null}
          </section>

          <section className="flex flex-col gap-4">
            <VehicleFormStep number={3} label="Estado, kilometraje y precio" isRequired />
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
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
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
          </section>

          <section className="flex flex-col gap-4">
            <VehicleFormStep
              number={4}
              label="Descripción del vehículo"
              isRequired
              description="Describe el estado, historial y puntos destacados del vehículo."
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="quick-description">Descripción</FieldLabel>
                  <Textarea {...field} id="quick-description" rows={5} aria-invalid={fieldState.invalid} />
                  {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
          </section>

          <section className="flex flex-col gap-4">
            <VehicleFormStep number={5} label="Información técnica" isRequired />
            <QuickVehicleTechnicalFields />
          </section>

          <section className="flex flex-col gap-4">
            <VehicleFormStep number={6} label="Ubicación" isRequired />
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
                      form.setValue("lng", nextLng, { shouldDirty: true, shouldValidate: true });
                    }}
                    ariaInvalid={fieldState.invalid || Boolean(form.formState.errors.lng)}
                  />
                );
              }}
            />
          </section>

          <section className="flex flex-col gap-4">
            <VehicleFormStep number={7} label="Tu contacto" isRequired />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="contact-name">Nombre</FieldLabel>
                <Input id="contact-name" value={contactName} readOnly disabled />
              </Field>
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                    <PhoneInput value={field.value} onChange={field.onChange} ariaInvalid={fieldState.invalid} />
                    {fieldState.error ? <FieldError errors={[fieldState.error]} /> : null}
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
          </section>

          <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {isEditMode ? "Actualizar anuncio" : "Publicar anuncio ahora"}
          </Button>
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-1">
          <QuickVehiclePreview />
          <QuickVehicleOptionalSections />
          <button
            type="button"
            className="text-left text-sm text-primary hover:underline"
            onClick={() => {
              document.getElementById("quick-optional-sections")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Completar después →
          </button>
        </aside>
      </form>
    </FormProvider>
  );
};
