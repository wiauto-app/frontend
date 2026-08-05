"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { canManageTeam } from "@/app/usuario/equipo/utils/teamPermissions";
import { MapInput } from "@/components/forms/mapInput";
import { PhoneInput, DEFAULT_PHONE_CODE } from "@/components/forms/phoneInput";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { ImageInput } from "@/components/ui/imageInput";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getImageUrl } from "@/lib/utils";
import { dealershipService } from "@/services/dealerships/dealershipService";
import {
  dealershipProfileFormSchema,
  EMPTY_DEALERSHIP_PROFILE_FORM,
  mapDealershipDetailToFormValues,
  mapDealershipFormToCreatePayload,
  mapDealershipFormToUpdatePayload,
  type DealershipProfileFormValues,
} from "../schemas/dealership-profile.schema";
import { DealershipScheduleSection } from "./DealershipScheduleSection";

export const DealershipProfileTabContent = () => {
  const { user, isLoading: isUserLoading, refreshUser } = useUser();
  const queryClient = useQueryClient();
  const dealershipId = user?.dealership_membership?.dealership_id;
  const isCreateMode = !dealershipId;
  const canEditSchedule = canManageTeam(user?.dealership_membership?.role);
  const {
    data: dealership,
    isLoading: isDealershipLoading,
    isError: isDealershipError,
  } = useQuery({
    queryKey: ["dealership-profile", dealershipId],
    queryFn: async () => {
      const response = await dealershipService.findOne(dealershipId!);
      if (!response.ok || !response.data) {
        throw new Error(
          response.message || "No se pudo cargar la concesionaria",
        );
      }
      return response.data;
    },
    enabled: !isUserLoading && Boolean(dealershipId),
  });

  const form = useForm<DealershipProfileFormValues>({
    resolver: zodResolver(dealershipProfileFormSchema),
    defaultValues: EMPTY_DEALERSHIP_PROFILE_FORM,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const avatarUrl = useWatch({ control, name: "avatar_url" });
  const bannerUrl = useWatch({ control, name: "banner_url" });
  const lng = useWatch({ control, name: "lng" });

  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (dealership) {
      reset(mapDealershipDetailToFormValues(dealership));
      return;
    }

    if (isCreateMode) {
      reset({
        ...EMPTY_DEALERSHIP_PROFILE_FORM,
        email: user?.email ?? "",
        phone: {
          phone_code: user?.phone_code?.trim() || DEFAULT_PHONE_CODE,
          phone: user?.phone ?? "",
        },
      });
    }
  }, [dealership, isCreateMode, isUserLoading, reset, user]);


  const onSubmit = async (data: DealershipProfileFormValues) => {
    if (!user?.id) {
      toast.error("No se pudo identificar tu usuario");
      return;
    }

    if (isCreateMode) {
      const response = await dealershipService.createMyProfile(
        mapDealershipFormToCreatePayload(data),
      );

      if (!response.ok) {
        toast.error(
          response.message || "Ocurrió un error al crear la concesionaria",
        );
        return;
      }

      toast.success("Concesionaria creada");
      await refreshUser();
      await queryClient.invalidateQueries({ queryKey: ["dealership-profile"] });
      return;
    }

    const response = await dealershipService.update(
      dealershipId!,
      mapDealershipFormToUpdatePayload(data),
    );

    if (!response.ok) {
      toast.error(
        response.message || "Ocurrió un error al actualizar la concesionaria",
      );
      return;
    }

    toast.success("Concesionaria actualizada");
    await queryClient.invalidateQueries({ queryKey: ["dealership-profile"] });
  };

  if (isUserLoading) {
    return (
      <div className="p-6 text-center text-gray-500">Cargando perfil...</div>
    );
  }

  if (!isCreateMode && isDealershipLoading) {
    return (
      <div
        className="flex min-h-48 items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
        role="status"
        aria-label="Cargando concesionaria"
      >
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isCreateMode && isDealershipError) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
        No se pudieron cargar los datos de tu concesionaria. Intenta recargar la
        página.
      </div>
    );
  }

  const displayName =
    dealership?.name ||
    user?.dealership_membership?.dealership_name ||
    "Tu concesionaria";

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-blue-100 bg-blue-100/50">
        {bannerUrl ? (
          <div className="relative h-32 w-full bg-blue-200">
            <Image
              src={getImageUrl(bannerUrl)}
              alt={`Banner de ${displayName}`}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-32 w-full bg-blue-200" />
        )}

        <div className="flex flex-col items-center gap-4 p-6 md:flex-row md:items-end">
          <div className="relative -mt-12 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-blue-100 bg-blue-200 text-2xl font-bold text-blue-700 md:-mt-16">
            {avatarUrl ? (
              <Image
                src={getImageUrl(avatarUrl)}
                alt={displayName}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <Building2 className="size-8" aria-hidden />
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-sm font-medium text-gray-700">
              {isCreateMode
                ? "Completa los datos para registrar tu concesionaria"
                : "Actualiza la información pública de tu concesionaria"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Controller
              name="avatar_url"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Avatar de la concesionaria</FieldLabel>
                  <ImageInput
                    value={field.value}
                    onChange={(url) => field.onChange(url ?? "")}
                    bucketName="dealership-images"
                    path={`dealerships/${dealershipId ?? user?.id ?? "new"}/avatar`}
                    referenceId={dealershipId ?? user?.id}
                    description="PNG, JPG o WEBP. Se mostrará como avatar."
                  />
                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="banner_url"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Banner de la concesionaria</FieldLabel>
                  <ImageInput
                    value={field.value}
                    onChange={(url) => field.onChange(url ?? "")}
                    bucketName="dealership-images"
                    path={`dealerships/${dealershipId ?? user?.id ?? "new"}/banner`}
                    referenceId={dealershipId ?? user?.id}
                    description="PNG, JPG o WEBP. Se mostrará en la cabecera."
                  />
                  {fieldState.error ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <Field
              className="md:col-span-2"
              data-invalid={Boolean(errors.name)}
            >
              <FieldLabel htmlFor="dealership-name">Nombre</FieldLabel>
              <Input
                id="dealership-name"
                placeholder="Auto Norte Madrid"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
              {errors.name ? <FieldError errors={[errors.name]} /> : null}
            </Field>


            <Field
              className="md:col-span-2"
              data-invalid={Boolean(errors.description)}
            >
              <FieldLabel htmlFor="dealership-description">Descripción</FieldLabel>
              <Textarea
                id="dealership-description"
                rows={4}
                placeholder="Cuéntanos qué hace especial a tu concesionaria"
                aria-invalid={Boolean(errors.description)}
                {...register("description")}
              />
              {errors.description ? (
                <FieldError errors={[errors.description]} />
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.website_url)}>
              <FieldLabel htmlFor="dealership-website">Sitio web</FieldLabel>
              <Input
                id="dealership-website"
                type="url"
                placeholder="https://www.tuconcesionaria.com"
                aria-invalid={Boolean(errors.website_url)}
                {...register("website_url")}
              />
              {errors.website_url ? (
                <FieldError errors={[errors.website_url]} />
              ) : null}
            </Field>

            <Field data-invalid={Boolean(errors.email)}>
              <FieldLabel htmlFor="dealership-email">Correo de contacto</FieldLabel>
              <Input
                id="dealership-email"
                type="email"
                placeholder="contacto@tuconcesionaria.com"
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
              {errors.email ? <FieldError errors={[errors.email]} /> : null}
            </Field>

            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="dealership-phone">Teléfono</FieldLabel>
                  <PhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    ariaInvalid={fieldState.invalid}
                  />
                  {errors.phone?.phone_code ? (
                    <FieldError errors={[errors.phone.phone_code]} />
                  ) : null}
                  {errors.phone?.phone ? (
                    <FieldError errors={[errors.phone.phone]} />
                  ) : null}
                </Field>
              )}
            />

            <Controller
              name="show_phone"
              control={control}
              render={({ field }) => (
                <Field className="md:col-span-2">
                  <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="space-y-1">
                      <FieldLabel htmlFor="dealership-show-phone">
                        Mostrar teléfono en perfil público
                      </FieldLabel>
                      <FieldDescription>
                        Si lo desactivas, se ocultará el botón de llamar y el
                        contacto telefónico en tu perfil público.
                      </FieldDescription>
                    </div>
                    <Switch
                      id="dealership-show-phone"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="Mostrar teléfono en perfil público"
                    />
                  </div>
                </Field>
              )}
            />

            <Field
              className="md:col-span-2"
              data-invalid={Boolean(errors.address)}
            >
              <FieldLabel htmlFor="dealership-address">Dirección</FieldLabel>
              <Input
                id="dealership-address"
                placeholder="Calle Mayor 123, Madrid"
                aria-invalid={Boolean(errors.address)}
                {...register("address")}
              />
              {errors.address ? <FieldError errors={[errors.address]} /> : null}
            </Field>
          </div>

          <Field
            data-invalid={Boolean(errors.lat) || Boolean(errors.lng)}
          >
            <FieldLabel>Ubicación en el mapa</FieldLabel>
            <Controller
              name="lat"
              control={control}
              render={({ field: latField, fieldState }) => (
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
                      fieldState.invalid ||
                      Boolean(errors.lng)
                    }
                  />
              )}
            />
            {errors.lat ? <FieldError errors={[errors.lat]} /> : null}
            {errors.lng ? <FieldError errors={[errors.lng]} /> : null}
          </Field>

          <Button type="submit" disabled={isSubmitting} className="mt-4 w-full">
            {isSubmitting
              ? "Guardando..."
              : isCreateMode
                ? "Crear concesionaria"
                : "Guardar cambios"}
          </Button>
        </form>
      </div>

      {!isCreateMode && dealershipId ? (
        <DealershipScheduleSection
          dealershipId={dealershipId}
          schedules={dealership?.schedules}
          canEdit={canEditSchedule}
        />
      ) : null}
    </div>
  );
};
