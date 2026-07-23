import Link from "next/link";
import { Metadata } from "next";

import ChangePasswordForm from "@/app/(auth)/components/ChangePasswordForm";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Cambiar contraseña",
  description: "Cambia tu contraseña en Wiauto",
};

interface CambiarContrasenaPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function Page({ searchParams }: CambiarContrasenaPageProps) {
  const { token } = await searchParams;
  const reset_token = token?.trim() ?? "";

  if (!reset_token) {
    return (
      <>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Enlace inválido</h2>
          <p className="mt-2 text-sm text-gray-500">
            El enlace de recuperación no es válido o ya expiró. Solicita uno
            nuevo.
          </p>
        </div>
        <Button
          type="button"
          className="w-full"
          nativeButton={false}
          render={<Link href="/olvide-contrasena" />}
        >
          Solicitar nuevo enlace
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          nativeButton={false}
          render={<Link href="/iniciar-sesion" />}
        >
          Volver a iniciar sesión
        </Button>
      </>
    );
  }

  return <ChangePasswordForm token={reset_token} />;
}
