import Link from "next/link";
import { MailX } from "lucide-react";
import { AUTH_ROUTES } from "@/constants/auth.constants";
import { Metadata } from "next";

type RejectedInvitationPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export const metadata: Metadata = {
  title: "Invitación rechazada",
  description: "Has rechazado la invitación para unirte al equipo del concesionario.",
};

export default async function RejectedInvitationPage({
  searchParams,
}: RejectedInvitationPageProps) {
  const params = await searchParams;
  const email = params.email?.trim();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F7FB] p-4">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-50">
          <MailX className="size-7 text-red-600" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Invitación rechazada
        </h1>

        <p className="mb-2 text-gray-600">
          Has rechazado la invitación para unirte al equipo del concesionario.
        </p>

        {email && (
          <p className="mb-6 text-sm text-gray-500">
            Correo de la invitación:{" "}
            <span className="font-medium text-gray-700">{email}</span>
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-muted"
          >
            Ir al inicio
          </Link>
          <Link
            href={AUTH_ROUTES.LOGIN}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
