"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmEmailVerificationSchema, ConfirmEmailVerificationDto } from "@/validations/Schemas";
import { authService } from "@/services/authService";
import { confirmEmailVerification } from "@/services/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ConfirmEmailForm({token}: {token: string}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ConfirmEmailVerificationDto>({
    resolver: zodResolver(ConfirmEmailVerificationSchema),
    defaultValues: {
      token: token
    },
  })

  useEffect(() => {
    if (authService.isLoggedIn()) {
      router.push("/");
    }
  }, [router]);

  async function onSubmit(data: ConfirmEmailVerificationDto) {
    setIsLoading(true);
    try {
      const response = await confirmEmailVerification(data.token);
      toast.success(response.message || "Correo confirmado exitosamente");
      router.push("/iniciar-sesion");
    } catch (error: any) {
      console.error("Confirmar correo error:", error);
      const genericMessage = "Error al confirmar el correo. El enlace puede ser inválido o haber expirado.";
      toast.error(error.message || genericMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full sm:max-w-md shadow-2xl border-primary/10 bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Confirmar tu correo</CardTitle>
        <CardDescription className="text-center">
          Haz clic en el botón de abajo para verificar tu cuenta y poder iniciar sesión.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="confirm-email-form" onSubmit={form.handleSubmit(onSubmit)}>
          {/* No inputs needed, the token is passed directly */}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          type="submit" 
          form="confirm-email-form" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Verificando...
            </span>
          ) : "Confirmar mi correo"}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          ¿Ya confirmaste? <a href="/iniciar-sesion" className="text-primary hover:underline font-medium">Inicia sesión</a>
        </p>
      </CardFooter>
    </Card>
  )
}
