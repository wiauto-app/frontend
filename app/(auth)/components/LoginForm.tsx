"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LoginDto, LoginSchema } from "@/validations/Schemas";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "../authActions/authActions";
import { useUser } from "@/app/contexts/auth/useUser";

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
  })

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
      const genericMessage = "Email o contraseña incorrectos. Por favor, intenta de nuevo.";
      if ((error as Error).message?.includes("No se encontró") || (error as Error).message?.includes("incorrectos")) {
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
      <div className="flex w-full max-w-8xl overflow-hidden rounded-2xl shadow-xl">
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
            <span className="text-white text-7xl font-bold tracking-tighter">W</span>
          </div>
          
          {/* Texto principal */}
          <h1 className="text-white text-3xl font-bold mb-4 leading-tight text-start">
            Encuentra o vende<br />
            tu próximo coche<br />
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
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Campo Email */}
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

            {/* Campo Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña *
              </label>
              <input
                id="password"
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

            {/* Checkbox No cerrar sesión */}
            <div className="flex items-center">
              <input
                id="keep-logged-in"
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="keep-logged-in" className="ml-2 block text-sm text-gray-700">
                No cerrar sesión
              </label>
            </div>
          </form>

          {/* Botón Iniciar Sesión */}
          <button
            type="submit"
            form="login-form"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>

          {/* Links finales */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              ¿Aún no tienes una cuenta?{" "}
              <a href="/registro" className="text-blue-600 hover:text-blue-700 font-medium">
                Regístrate
              </a>
            </p>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => router.push("/olvide-contrasena")}
            >
              Olvido la contraseña?
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}