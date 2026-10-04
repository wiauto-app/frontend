"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { AuthPantallaProps } from "@/app/(auth)/types/strapi-autenticacion.types";
import { StrapiEncabezado } from "@/components/strapi/StrapiEncabezado";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FRONTEND_URL } from "@/constants";
import { authService } from "@/services/authService";
import {
  createForgotPasswordSchema,
  type ForgotPasswordDto,
} from "@/validations/Schemas";

export default function ForgotPasswordForm({
  content,
}: AuthPantallaProps<"olvide_contrasena">) {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const schema = useMemo(() => createForgotPasswordSchema(content), [content]);
  const form = useForm<ForgotPasswordDto>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordDto) {
    setIsLoading(true);
    try {
      const redirect_url = `${(FRONTEND_URL ?? "").replace(/\/$/, "")}/cambiar-contrasena`;
      const response = await authService.forgotPassword(data.email, redirect_url);
      if (!response.ok) {
        throw new Error(
          response.data?.message || "Error al solicitar recuperación",
        );
      }
      toast.success(response.data.message);
      setSent(true);
      form.reset();
    } catch (error: unknown) {
      console.error("Olvide contraseña error:", error);
      const genericMessage = content.mensajes?.error_generico;
      const message = error instanceof Error ? error.message : undefined;
      if (
        message?.includes("No se encontró") ||
        message?.includes("incorrectos")
      ) {
        toast.error(genericMessage);
      } else {
        toast.error(message || genericMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const backLink = content.enlace_volver ? (
    <Link href={content.enlace_volver.url} />
  ) : undefined;

  return (
    <>
      <StrapiEncabezado
        content={sent ? content.encabezado_enviado : content.encabezado}
      />

      {!sent && (
        <form
          id="forgot-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div>
            <Label htmlFor="email" className="mb-1 block text-gray-700">
              {content.email?.label} *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={content.email?.placeholder ?? undefined}
              {...form.register("email")}
              disabled={isLoading}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
        </form>
      )}

      {!sent && (
        <Button
          type="submit"
          form="forgot-form"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading
            ? content.boton?.label_cargando || content.boton?.label
            : content.boton?.label}
        </Button>
      )}

      {sent && backLink && (
        <Button
          type="button"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          nativeButton={false}
          render={backLink}
        >
          {content.enlace_volver?.label}
        </Button>
      )}

      {!sent && backLink && (
        <div className="text-center">
          <Button
            type="button"
            className="text-sm font-medium"
            nativeButton={false}
            render={backLink}
          >
            {content.enlace_volver?.label}
          </Button>
        </div>
      )}
    </>
  );
}
