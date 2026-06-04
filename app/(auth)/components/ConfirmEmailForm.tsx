"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConfirmEmailForm() {
  return (
    <Card className="w-full sm:max-w-md shadow-2xl border-primary/10 bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Revisa tu correo</CardTitle>
        <CardDescription className="text-center">
          Te enviamos un enlace para verificar tu cuenta. Al hacer clic, iniciarás sesión
          automáticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center">
          Si no lo ves, revisa la carpeta de spam o solicita un nuevo enlace desde la pantalla
          de inicio de sesión.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <a
          href="/iniciar-sesion"
          className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Ir a iniciar sesión
        </a>
        <p className="text-xs text-center text-muted-foreground">
          ¿Ya verificaste?{" "}
          <a href="/iniciar-sesion" className="text-primary hover:underline font-medium">
            Inicia sesión
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
