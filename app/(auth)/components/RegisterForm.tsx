"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { RegisterDto, RegisterSchema } from "@/validations/Schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<"particular" | "empresa">("particular");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptNewsletter, setAcceptNewsletter] = useState(false);

  const form = useForm<RegisterDto>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      last_name: "",
    },
  })

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    if (!acceptTerms) {
      toast.error("Debes aceptar las condiciones de uso");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Registro con tipo:", accountType, data);
      toast.success("Cuenta creada correctamente. ¡Bienvenido!");
    } catch (error: Error | unknown) {
      console.error("Register error:", error);
      toast.error((error as Error).message || "Hubo un error al crear tu cuenta. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full overflow-hidden rounded-2xl shadow-xl">
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

        <div className="w-full lg:flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-xl space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Regístrate</h2>
            </div>

            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => setAccountType("particular")}
                className={`flex-1 pb-3 text-center font-medium transition-colors ${
                  accountType === "particular"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Particular
              </button>
              <button
                type="button"
                onClick={() => setAccountType("empresa")}
                className={`flex-1 pb-3 text-center font-medium transition-colors ${
                  accountType === "empresa"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Empresa
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar con Google
              </button>

              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/>
                </svg>
                Continuar con Apple ID
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">o</span>
              </div>
            </div>

            <form id="register-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    placeholder="Nombre"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...form.register("name")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.name && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    id="register-last_name"
                    type="text"
                    placeholder="Apellido"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    {...form.register("last_name")}
                    disabled={isLoading}
                  />
                  {form.formState.errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="register-email"
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

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña *
                </label>
                <input
                  id="register-password"
                  type="password"
                  placeholder="Contraseña *"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  {...form.register("password")}
                  disabled={isLoading}
                />
                {form.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-start gap-2">
                <input
                  id="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="accept-terms" className="text-sm text-gray-600">
                  Acepto las condiciones de uso y la información básica de protección de datos.
                </label>
              </div>

              <div className="flex items-start gap-2">
                <input
                  id="accept-newsletter"
                  type="checkbox"
                  checked={acceptNewsletter}
                  onChange={(e) => setAcceptNewsletter(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="accept-newsletter" className="text-sm text-gray-600">
                  Suscríbete y recibe todas las novedades de nuestro blog
                </label>
              </div>
            </form>

            <button
              type="submit"
              form="register-form"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <a href="/iniciar-sesion" className="text-blue-600 hover:text-blue-700 font-medium">
                  Iniciar sesión
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}