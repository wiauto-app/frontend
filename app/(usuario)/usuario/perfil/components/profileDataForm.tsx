import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PhoneInput, DEFAULT_PHONE_CODE } from "@/components/forms/phoneInput";
import { ImageInput } from "@/components/ui/imageInput";
import { Input } from "@/components/ui/input";
import type { MyProfileResponse } from "@/interfaces/profile.interface";
import { userService } from "@/services/userService";
import {
  mapProfileFormToPayload,
  updateProfileFormSchema,
  type UpdateProfileFormValues,
} from "../schemas/update-profile.schema";
import { ProfileProvinceSelector } from "./profileProvinceSelector";
import { ControllerInput } from "@/components/ui/controllerInput";

const EMPTY_PROFILE_FORM: UpdateProfileFormValues = {
  name: "",
  last_name: "",
  phone: { phone_code: DEFAULT_PHONE_CODE, phone: "" },
  avatar_url: null,
};

const mapProfileToFormValues = (
  profile: MyProfileResponse,
): UpdateProfileFormValues => ({
  name: profile.name ?? "",
  last_name: profile.last_name ?? "",
  phone: {
    phone_code: profile.phone_code?.trim() || DEFAULT_PHONE_CODE,
    phone: profile.phone ?? "",
  },
  avatar_url: profile.avatar_url ?? null,
  province_id: profile.province_id ?? undefined,
});

export const ProfileDataForm = () => {
  const { user, refreshUser } = useUser();
  const queryClient = useQueryClient();
  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: EMPTY_PROFILE_FORM,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["me-profile"],
    queryFn: async () => {
      const response = await userService.getMyProfile();
      if (!response.ok || !response.data) {
        throw new Error(response.message || "No se pudo cargar el perfil");
      }
      return response.data;
    },
    enabled: Boolean(user),
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    reset(mapProfileToFormValues(profile));
  }, [profile, reset]);

  const handleSaveProfile = async (data: UpdateProfileFormValues) => {
    const response = await userService.updateProfile(
      mapProfileFormToPayload(data),
    );

    if (!response.ok) {
      toast.error(
        response.message || "Ocurrió un error al actualizar el perfil",
      );
      return;
    }

    toast.success("Perfil actualizado correctamente");

    if (response.data) {
      reset(mapProfileToFormValues(response.data));
      queryClient.setQueryData(["me-profile"], response.data);
    } else {
      await queryClient.invalidateQueries({ queryKey: ["me-profile"] });
    }

    await refreshUser();
  };

  if (isLoadingProfile) {
    return (
      <Card size="sm">
        <CardContent className="flex min-h-32 items-center justify-center">
          <Loader2
            className="size-8 animate-spin text-muted-foreground"
            aria-label="Cargando perfil"
          />
        </CardContent>
      </Card>
    );
  }

  if (isProfileError) {
    return (
      <Card size="sm">
        <CardContent className="text-sm text-red-700">
          No se pudieron cargar los datos del perfil. Intenta recargar la
          página.
        </CardContent>
      </Card>
    );
  }

  const avatarOwnerId = profile?.id ?? user?.id ?? "me";

  return (
    <Card size="sm">
      <CardContent>
        <form
          onSubmit={handleSubmit(handleSaveProfile)}
          className="flex flex-col gap-5 xl:flex-row"
        >
          <Controller
            name="avatar_url"
            control={control}
            render={({ field }) => (
              <Field className="w-fit">
                <ImageInput
                  orientation="vertical"
                  value={field.value}
                  onChange={field.onChange}
                  bucketName="profile-images"
                  path={`avatars/${avatarOwnerId}`}
                  referenceId={
                    avatarOwnerId === "me" ? undefined : avatarOwnerId
                  }
                  description="PNG, JPG o WEBP. Se guardará como tu avatar."
                />
              </Field>
            )}
          />

          <div className="flex flex-col gap-3  w-full">
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="name">Nombre</FieldLabel>
              <Input
                id="name"
                placeholder="Andrea"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
              {errors.name ? <FieldError errors={[errors.name]} /> : null}
            </Field>

            <Field data-invalid={Boolean(errors.last_name)}>
              <FieldLabel htmlFor="last_name">Apellidos</FieldLabel>
              <Input
                id="last_name"
                placeholder="Gutiérrez"
                aria-invalid={Boolean(errors.last_name)}
                {...register("last_name")}
              />
              {errors.last_name ? (
                <FieldError errors={[errors.last_name]} />
              ) : null}
            </Field>

            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
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
            <ControllerInput
              label="Provincia"
              control={control}
              name="province_id"
            >
              {({ field }) => (
                <ProfileProvinceSelector
                  value={field.value as number}
                  onChange={field.onChange}
                />
              )}
            </ControllerInput>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
