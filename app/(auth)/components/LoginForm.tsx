"use client"

import { useState } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LoginDto, LoginSchema } from "@/validations/Schemas";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "../authActions/authActions";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  
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
      toast.success("Sesión iniciada correctamente");
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
    <Card className="w-full sm:max-w-md shadow-2xl border-primary/10 bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Inicia Sesión en Wiautos</CardTitle>
        <CardDescription className="text-center">
          Por favor, ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="tu@email.com"
                    autoComplete="email"
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-password">
                    Contraseña
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="bg-background/50"
                  />
                  <FieldDescription>
                    Ingresa tu contraseña de acceso
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
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
            form="login-form" 
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Cargando...
              </span>
            ) : "Entrar"}
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          ¿No tienes una cuenta? <a href="/registro" className="text-primary hover:underline font-medium">Regístrate</a>
        </p>
      </CardFooter>
    </Card>
  )
}
