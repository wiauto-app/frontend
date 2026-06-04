"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AppleLogin } from "./appleLogin";
import { GoogleLogin } from "./googleLogin";
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
              <GoogleLogin disabled={isLoading} />
              <AppleLogin disabled={isLoading} />
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