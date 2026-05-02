"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { register } from "@/services/auth";
import { RegisterSchema } from "@/validations/Schemas";
import { authService } from "@/services/authService";

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

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",  
      password: "",
      name: "",
      last_name: "",
    },
  })

  useEffect(() => {
    if (authService.isLoggedIn()) {
      router.push("/");
    }
  }, [router]);

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    setIsLoading(true);
    try {
      const response = await register(data);
      authService.saveToken(response.token);
      toast.success("Cuenta creada correctamente. ¡Bienvenido!");
      router.push("/");
    } catch (error: any) {
      console.error("Register error:", error);
      toast.error(error.message || "Hubo un error al crear tu cuenta. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full sm:max-w-md shadow-2xl border-primary/10 bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Regístrate en Wiautos</CardTitle>
        <CardDescription className="text-center">
          Por favor, ingresa tus datos para crear tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-name">
                    Nombre
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Tu nombre"
                    autoComplete="name"
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
              name="last_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-last_name">
                    Apellido
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-last_name"
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Tu apellido"
                    autoComplete="last_name"
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
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-email"
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
                  <FieldLabel htmlFor="register-password">
                    Contraseña
                  </FieldLabel>
                  <Input
                    {...field}
                    id="register-password"
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
            form="register-form" 
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Cargando...
              </span>
            ) : "Registrarse"}
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          ¿Ya tienes una cuenta? <a href="/iniciar-sesion" className="text-primary hover:underline font-medium">Iniciar Sesión</a>
        </p>
      </CardFooter>
    </Card>
  )
}
