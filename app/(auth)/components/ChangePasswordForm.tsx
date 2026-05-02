"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ResetPasswordSchema, ResetPasswordDto } from "@/validations/Schemas";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function ChangePasswordForm({token}: {token: string}) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ResetPasswordDto>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      token: token
    },
  })



  async function onSubmit(data: ResetPasswordDto) {
    setIsLoading(true);
    try {
      const response = await authService.changePassword(data);
      toast.success(response.message);
      form.reset();
    } catch (error: any) {
      console.error("Olvide contraseña error:", error);
      const genericMessage = "Error al cambiar la contraseña. Por favor, intenta de nuevo.";
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
    <Card className="w-full sm:max-w-md shadow-2xl border-primary/10 bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Olvide contraseña</CardTitle>
        <CardDescription className="text-center">
          Por favor, ingresa tu email para restablecer tu contraseña
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-password">
                    Nueva contraseña
                  </FieldLabel>
                  <Input
                    {...field}
                    id="new-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    autoComplete="new-password"
                    disabled={isLoading}
                    className="bg-background/50"
                  />
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
