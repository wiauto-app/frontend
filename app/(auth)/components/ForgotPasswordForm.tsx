"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ForgotPasswordSchema } from "@/validations/Schemas";
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
  })

  async function onSubmit(data: z.infer<typeof ForgotPasswordSchema>) {
    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(data.email);
      if (!response.ok) {
        throw new Error(response.data?.message || "Error al solicitar recuperación");
      }
      toast.success(response.data.message);
      setSent(true);
      form.reset();
    } catch (error: any) {
      console.error("Olvide contraseña error:", error);
      const genericMessage = "Error al enviar el correo electrónico. Por favor, intenta de nuevo.";
      if (error.message?.includes("No se encontró") || error.message?.includes("incorrectos")) {
        toast.error(genericMessage);
      } else {
        toast.error(error.message || genericMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 w-full">
      <div className="flex w-full max-w-8xl overflow-hidden rounded-2xl shadow-xl">
        <div className="hidden lg:flex lg:w-[37.4%] bg-blue-700 flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full" />
          <div className="relative z-10 text-center px-8">
            <div className="mb-8 text-start bg-blue-700 w-fit px-4 py-2 rounded-lg">
              <span className="text-white text-7xl font-bold tracking-tighter">W</span>
            </div>
            <h1 className="text-white text-3xl font-bold mb-4 leading-tight text-start">
              Encuentra o vende<br />
              tu próximo coche<br />
              hoy!
            </h1>
          </div>
        </div>

        <div className="w-full lg:flex-1 flex items-start justify-center pt-16 md:pt-24 p-8 bg-white">
          <div className="w-full max-w-xl space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                {sent ? "Revisa tu email" : "Restablece tu contraseña"}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {sent
                  ? "Si existe una cuenta con ese email, recibirás un enlace para restablecer tu contraseña."
                  : "Introduce tu cuenta de email y te enviaremos un enlace con el que restablecer tu contraseña."
                }
              </p>
            </div>

            {!sent && (
              <form id="forgot-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...form.register("email")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </form>
            )}

            {!sent && (
              <button
                type="submit"
                form="forgot-form"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar enlace"}
              </button>
            )}

            {sent && (
              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => router.push("/iniciar-sesion")}
              >
                Volver a iniciar sesión
              </button>
            )}

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => router.push("/iniciar-sesion")}
              >
                Volver a inicio de sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}