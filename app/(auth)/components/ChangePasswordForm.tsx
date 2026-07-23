"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ResetPasswordSchema, ResetPasswordDto } from "@/validations/Schemas";
import { authService } from "@/services/authService";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface ChangePasswordFormProps {
  token: string;
}

export default function ChangePasswordForm({ token }: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordDto>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      token: token,
    },
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
      const genericMessage =
        "Error al cambiar la contraseña. Por favor, intenta de nuevo.";
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
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Cambia tu contraseña
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Introduce tu nueva contraseña para continuar.
        </p>
      </div>

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
                <FieldLabel htmlFor="new-password">Nueva contraseña</FieldLabel>
                <Input
                  {...field}
                  id="new-password"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="********"
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
          Limpiar
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
              Cargando...
            </span>
          ) : (
            "Guardar"
          )}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <a
          href="/registro"
          className="font-medium text-primary hover:underline"
        >
          Regístrate
        </a>
      </p>
    </>
  );
}
