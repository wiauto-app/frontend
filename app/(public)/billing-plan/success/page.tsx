import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerSessionOrNull } from "@/lib/ensure-session.server";

export const metadata: Metadata = {
  title: "Pago completado | WiAuto",
  description: "Tu suscripción profesional de WiAuto se ha activado correctamente.",
};

interface BillingPlanSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function BillingPlanSuccessPage({
  searchParams,
}: BillingPlanSuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id?.trim() ?? "";
  const user = await getServerSessionOrNull();

  return (
    <div className="container mx-auto flex max-w-2xl flex-col items-center px-4 py-12 md:py-20">
      <Card size="sm" className="w-full text-center">
        <CardHeader className="items-center gap-3">
          <CheckCircle2
            className="size-14 text-primary"
            aria-hidden
          />
          <CardTitle className="text-2xl md:text-3xl">
            ¡Pago completado!
          </CardTitle>
          <CardDescription className="max-w-md text-base">
            {user
              ? "Tu plan profesional ya se está activando. En unos momentos verás los nuevos límites en tu cuenta."
              : "Tu pago se ha procesado correctamente. Inicia sesión para ver tu plan activado."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {sessionId ? (
            <p className="text-xs text-muted-foreground">
              Referencia de sesión: {sessionId}
            </p>
          ) : null}

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button render={<Link href="/usuario/monetizacion" />}>
              Ir a monetización
            </Button>
            <Button
              variant="outline"
              render={<Link href="/usuario/mis-anuncios" />}
            >
              Ver mis anuncios
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Si el plan no aparece al instante, recarga la página en unos
            segundos. El webhook de Stripe activa la suscripción automáticamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
