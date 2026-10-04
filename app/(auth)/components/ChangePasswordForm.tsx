"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { AuthPantallaProps } from "@/app/(auth)/types/strapi-autenticacion.types";
import { StrapiEncabezado } from "@/components/strapi/StrapiEncabezado";
import { StrapiTextoEnlace } from "@/components/strapi/StrapiTextoEnlace";
import { Button } from "@/components/ui/button";
import {
  createResetPasswordSchema,
  ResetPasswordDto,
} from "@/validations/Schemas";
import { authService } from "@/services/authService";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface ChangePasswordFormProps
  extends AuthPantallaProps<"cambiar_contrasena"> {
  token: string;
}

export default function ChangePasswordForm({
  token,
  content,
}: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const schema = useMemo(() => createResetPasswordSchema(content), [content]);
  const form = useForm<ResetPasswordDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      token: token,
    },
    mode: "onChange",
  });

  async function onSubmit(data: ResetPasswordDto) {
    setIsLoading(true);
    try {
      const response = await authService.changePassword(data);
      if (!response.ok) {
        throw new Error(
          response.data?.message || "Error al cambiar la contraseña",
        );
      }
      toast.success(response.data.message);
      form.reset();
    } catch (error: unknown) {
      console.error("Olvide contraseña error:", error);
      const genericMessage = content.mensajes?.error_generico;
      if (
        error instanceof Error &&
        (error.message?.includes("No se encontró") ||
          error.message?.includes("incorrectos"))
      ) {
        toast.error(genericMessage);
      } else {
        toast.error(error instanceof Error ? error.message : genericMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <StrapiEncabezado content={content.encabezado} />

      <form
        id="change-password-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="new-password">
                  {content.contrasena?.label}
                </FieldLabel>
                <Input
                  {...field}
                  id="new-password"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder={content.contrasena?.placeholder ?? undefined}
                  autoComplete="new-password"
                  disabled={isLoading}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <div className="flex w-full gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => form.reset()}
          disabled={isLoading}
        >
          {content.boton_limpiar}
        </Button>
        <Button
          type="submit"
          form="change-password-form"
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {content.boton?.label_cargando || content.boton?.label}
            </span>
          ) : (
            content.boton?.label
          )}
        </Button>
      </div>

      <StrapiTextoEnlace
        content={content.pie}
        className="text-xs text-muted-foreground"
        linkClassName="text-primary hover:text-primary hover:underline"
      />
    </>
  );
}
