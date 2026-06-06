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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from "@/services/authService";

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
      await authService.register(data);
      toast.success("Revisa tu correo para verificar la cuenta e iniciar sesión.");
      router.push("/confirmar-correo");
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
              <Button
                type="button"
                onClick={() => setAccountType("particular")}
                className={`flex-1 text-center  ${
                  accountType === "particular"
                    ? " border-b-2 border-blue-600 "
                    : "text-black hover:text-white bg-white"
                }`}
              >
                Particular
              </Button>
              <Button
                type="button"
                onClick={() => setAccountType("empresa")}
                className={`flex-1 text-center ${
                  accountType === "empresa"
                    ? "border-b-2 border-blue-600"
                    : "text-black hover:text-white bg-white"
                }`}
              >
                Empresa
              </Button>
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
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="register-name" className="block text-gray-700 mb-1">
                    Nombre *
                  </Label>
                  <Input
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
                  <Label htmlFor="register-last_name" className="block text-gray-700 mb-1">
                    Apellido *
                  </Label>
                  <Input
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
                <Label htmlFor="register-email" className="block text-gray-700 mb-1">
                  Email *
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Email *"
                  {...form.register("email")}
                  disabled={isLoading}
                />
                {form.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="register-password" className="block text-gray-700 mb-1">
                  Contraseña *
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Contraseña *"
                  {...form.register("password")}
                  disabled={isLoading}
                />
                {form.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="accept-terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="accept-terms" className="text-gray-600">
                  Acepto las condiciones de uso y la información básica de protección de datos.
                </Label>
              </div>
              
              <div className="flex items-start gap-2">
                <Checkbox
                  id="accept-newsletter"
                  checked={acceptNewsletter}
                  onCheckedChange={(checked) => setAcceptNewsletter(checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="accept-newsletter" className="text-gray-600">
                  Suscríbete y recibe todas las novedades de nuestro blog
                </Label>
              </div>
            </form>

            <Button
              type="submit"
              form="register-form"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>

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