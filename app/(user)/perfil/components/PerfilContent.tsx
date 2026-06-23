"use client";

import { useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { accountService } from "@/services/accountService";
import { toast } from "sonner";
import {
  ShieldCheck,
  CheckCircle2,
  MessageCircle,
  Mail,
  BookOpen,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PhoneInput, DEFAULT_PHONE_CODE } from "@/components/forms/phoneInput";
import { ImageInput } from "@/components/ui/imageInput";
import { getImageUrl } from "@/lib/utils";
import {
  mapProfileFormToPayload,
  updateProfileFormSchema,
  type UpdateProfileFormValues,
} from "../schemas/update-profile.schema";
import { useUser } from "@/app/contexts/auth/useUser";
import { EmailSettingsSection } from "./EmailSettingsSection";
import { PasswordSettingsSection } from "./PasswordSettingsSection";
import { TwoFactorSettingsSection } from "./TwoFactorSettingsSection";
import { DealershipProfileTabContent } from "./DealershipProfileTabContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EMPTY_PROFILE_FORM: UpdateProfileFormValues = {
  name: "",
  last_name: "",
  phone: { phone_code: DEFAULT_PHONE_CODE, phone: "" },
  dni: "",
  avatar_url: null,
};

export const PerfilContent = () => {
  const { user, isLoading, refreshUser } = useUser();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const activeTab =
    searchParams.get("tab") === "dealership" ? "dealership" : "profile";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "dealership") {
      params.set("tab", "dealership");
    } else {
      params.delete("tab");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const {
    data: account,
    isLoading: isLoadingAccount,
    isError: isAccountError,
  } = useQuery({
    queryKey: ["account-settings"],
    queryFn: async () => {
      const response = await accountService.getAccountSettings();
      if (!response.ok || !response.data) {
        throw new Error("No se pudieron cargar los datos de la cuenta");
      }
      return response.data;
    },
    enabled: !isLoading && Boolean(user),
  });

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

  const avatarUrl = useWatch({ control, name: "avatar_url" });

  useEffect(() => {
    if (!user) {
      return;
    }

    reset({
      name: user.name ?? "",
      last_name: user.last_name ?? "",
      phone: {
        phone_code: user.phone_code?.trim() || DEFAULT_PHONE_CODE,
        phone: user.phone ?? "",
      },
      dni: user.dni ?? "",
      avatar_url: user.avatar_url ?? null,
    });
  }, [user, reset]);

  const handleAccountUpdated = async () => {
    await queryClient.invalidateQueries({ queryKey: ["account-settings"] });
    await refreshUser();
  };

  const onSubmit = async (data: UpdateProfileFormValues) => {
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
    await refreshUser();
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">Cargando perfil...</div>
    );
  }

  const fullName = user?.name
    ? `${user.name} ${user.last_name || ""}`.trim()
    : "Usuario";

  const isLocal = account?.provider === "local";

  return (
    <div className="space-y-6 pb-20">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Mi perfil</TabsTrigger>
          <TabsTrigger value="dealership">Perfil de concesionaria</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
      <div className="flex flex-col items-center gap-6 rounded-xl border border-blue-100 bg-blue-100/50 p-6 md:flex-row md:items-start">
        <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-200 text-2xl font-bold text-blue-700">
          {avatarUrl ? (
            <Image
              src={getImageUrl(avatarUrl)}
              alt={fullName}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            (user?.name?.charAt(0).toUpperCase() ?? "U")
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-center">
            <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                <CheckCircle2 className="size-3" /> Top vendedor
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                <ShieldCheck className="size-3" /> Verificado
              </span>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-700">
            {user?.email ?? "Sin email"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="avatar_url"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Foto de perfil</FieldLabel>
                <ImageInput
                  value={field.value}
                  onChange={field.onChange}
                  bucketName="profile-images"
                  path={`avatars/${user?.id ?? "me"}`}
                  referenceId={user?.id}
                  description="PNG, JPG o WEBP. Se guardará como tu avatar."
                />
              </Field>
            )}
          />

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <Field data-invalid={Boolean(errors.name)}>
              <FieldLabel htmlFor="name">Nombres</FieldLabel>
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

            <Field data-invalid={Boolean(errors.dni)}>
              <FieldLabel htmlFor="dni">DNI</FieldLabel>
              <Input
                id="dni"
                inputMode="numeric"
                placeholder="12345678A"
                aria-invalid={Boolean(errors.dni)}
                {...register("dni")}
              />
              {errors.dni ? <FieldError errors={[errors.dni]} /> : null}
            </Field>
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-4 w-full">
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </div>

      {isLoadingAccount && (
        <div
          className="flex min-h-32 items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
          role="status"
          aria-label="Cargando configuración de cuenta"
        >
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {isAccountError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
          No se pudieron cargar los datos de tu cuenta. Intenta recargar la
          página.
        </div>
      )}

      {account && (
        <>
          <EmailSettingsSection
            account={account}
            onUpdated={handleAccountUpdated}
          />
          {isLocal && <PasswordSettingsSection />}
          <TwoFactorSettingsSection
            account={account}
            onUpdated={handleAccountUpdated}
          />
        </>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-lg font-bold text-gray-900">
          Badges de verificación
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="size-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Identidad (DNI)
              </span>
            </div>
            <Button size="sm" type="button">
              Verificar
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-lg font-bold text-gray-900">Soporte</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex cursor-pointer flex-col items-start rounded-xl border border-blue-100 bg-blue-50/30 p-5 transition-colors hover:bg-blue-50">
            <div className="mb-3 rounded-lg bg-blue-100 p-2 text-blue-600">
              <MessageCircle className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">
              Chat con un asesor
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Respuesta {"<"} 5 min en horario laboral
            </p>
          </div>

          <div className="flex cursor-pointer flex-col items-start rounded-xl border border-blue-100 bg-blue-50/30 p-5 transition-colors hover:bg-blue-50">
            <div className="mb-3 rounded-lg bg-blue-100 p-2 text-blue-600">
              <Mail className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Envía un ticket</h3>
            <p className="mt-1 text-xs text-gray-500">ayuda@wiauto.es</p>
          </div>

          <div className="flex cursor-pointer flex-col items-start rounded-xl border border-blue-100 bg-blue-50/30 p-5 transition-colors hover:bg-blue-50">
            <div className="mb-3 rounded-lg bg-blue-100 p-2 text-blue-600">
              <BookOpen className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Centro de ayuda</h3>
            <p className="mt-1 text-xs text-gray-500">
              Guías, FAQ y tutoriales
            </p>
          </div>
        </div>
      </div>
        </TabsContent>

        <TabsContent value="dealership">
          <DealershipProfileTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
