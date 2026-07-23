"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ForgotPasswordSchema } from "@/validations/Schemas";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FRONTEND_URL } from "@/constants";
import { authService } from "@/services/authService";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof ForgotPasswordSchema>) {
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
      const genericMessage =
        "Error al enviar el correo electrónico. Por favor, intenta de nuevo.";
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

  return (
    <>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          {sent ? "Revisa tu email" : "Restablece tu contraseña"}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {sent
            ? "Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña."
            : "Introduce tu cuenta de email y te enviaremos un enlace con el que restablecer tu contraseña."}
        </p>
      </div>

      {!sent && (
        <form
          id="forgot-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div>
            <Label htmlFor="email" className="mb-1 block text-gray-700">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email *"
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
          {isLoading ? "Enviando..." : "Enviar enlace"}
        </Button>
      )}

      {sent && (
        <Button
          type="button"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          onClick={() => router.push("/iniciar-sesion")}
        >
          Volver a iniciar sesión
        </Button>
      )}

      <div className="text-center">
        <Button
          type="button"
          className="text-sm font-medium"
          onClick={() => router.push("/iniciar-sesion")}
        >
          Volver a inicio de sesión
        </Button>
      </div>
    </>
  );
}
