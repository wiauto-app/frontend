"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { LoginDto, LoginSchema } from "@/validations/Schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "../authActions/authActions";
import { useUser } from "@/app/contexts/auth/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AppleLogin } from "./appleLogin";
import { GoogleLogin } from "./googleLogin";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const { refreshUser } = useUser();

  const form = useForm<LoginDto>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    setIsLoading(true);
    try {
      await loginAction(data);
      await refreshUser();
      toast.success("Sesión iniciada correctamente");
      router.push("/");
      router.refresh();
    } catch (error: Error | unknown) {
      console.error("Login error:", error);
      const genericMessage =
        "Email o contraseña incorrectos. Por favor, intenta de nuevo.";
      if (
        (error as Error).message?.includes("No se encontró") ||
        (error as Error).message?.includes("incorrectos")
      ) {
        toast.error(genericMessage);
      } else {
        toast.error((error as Error).message || genericMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 w-full">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-xl">
        <div className="hidden lg:flex lg:w-[37.4%] bg-blue-700 flex-col items-center justify-center relative overflow-hidden">
          {/* Patrón de fondo decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />

          {/* Círculos decorativos */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full" />

          {/* Contenido central izquierdo */}
          <div className="relative z-10 text-center px-8">
            {/* Letra W grande */}
            <div className="mb-8 text-start bg-blue-700 w-fit px-4 py-2 rounded-lg">
              <span className="text-white text-7xl font-bold tracking-tighter">
                W
              </span>
            </div>

            {/* Texto principal */}
            <h1 className="text-white text-3xl font-bold mb-4 leading-tight text-start">
              Encuentra o vende
              <br />
              tu próximo coche
              <br />
              hoy!
            </h1>
          </div>
        </div>

        {/* LADO DERECHO - Formulario blanco */}
        <div className="w-full lg:flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md space-y-8">
            {/* Título */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Inicia Sesión
              </h2>
            </div>

            {/* Botones sociales */}
            <div className="flex gap-3">
              <GoogleLogin disabled={isLoading} />
              <AppleLogin disabled={isLoading} />
            </div>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">o</span>
              </div>
            </div>

            {/* Formulario */}
            <form
              id="login-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Campo Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
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

              {/* Campo Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña *
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña *"
                  {...form.register("password")}
                  disabled={isLoading}
                />
                {form.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Checkbox No cerrar sesión */}
              <div className="flex items-center">
                <Checkbox
                  id="keep-logged-in"
                  checked={keepLoggedIn}
                  onCheckedChange={(checked) => setKeepLoggedIn(checked)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="keep-logged-in"
                  className="ml-2 block text-sm text-gray-700"
                >
                  No cerrar sesión
                </label>
              </div>
            </form>

            {/* Botón Iniciar Sesión */}
            <Button
              type="submit"
              form="login-form"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Iniciar Sesión"}
            </Button>

            {/* Links finales */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                ¿Aún no tienes una cuenta?{" "}
                <a
                  href="/registro"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Regístrate
                </a>
              </p>
              <Button
                type="button"
                variant="link"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => router.push("/olvide-contrasena")}
              >
                Olvido la contraseña?
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
