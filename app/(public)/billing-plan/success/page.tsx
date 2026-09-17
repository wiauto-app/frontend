import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
} from "lucide-react";

import { BrandLogo } from "@/components/ui/brandLogo";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/constants/auth.constants";
import { getServerSessionOrNull } from "@/lib/ensure-session.server";

export const metadata: Metadata = {
  title: "Pago completado | WiAuto",
  description:
    "Tu suscripción profesional de WiAuto se ha activado correctamente.",
};

const NEXT_STEPS_AUTHED = [
  {
    icon: ShieldCheck,
    title: "Activación automática",
    description:
      "Stripe confirma el pago y tu plan queda listo en segundos.",
  },
  {
    icon: LayoutDashboard,
    title: "Revisa tu cuenta",
    description:
      "En Monetización verás límites, facturas y el estado del plan.",
  },
  {
    icon: Megaphone,
    title: "Sigue publicando",
    description:
      "Gestiona anuncios con las nuevas ventajas de tu suscripción.",
  },
] as const;

const NEXT_STEPS_GUEST = [
  {
    icon: ShieldCheck,
    title: "Pago confirmado",
    description:
      "Hemos recibido el pago. Tu plan queda vinculado a tu cuenta.",
  },
  {
    icon: LayoutDashboard,
    title: "Inicia sesión",
    description:
      "Entra con el mismo correo del checkout para ver el plan activo.",
  },
  {
    icon: Megaphone,
    title: "Empieza a publicar",
    description:
      "Cuando entres, tendrás los límites profesionales disponibles.",
  },
] as const;

export default async function BillingPlanSuccessPage() {
  const user = await getServerSessionOrNull();
  const nextSteps = user ? NEXT_STEPS_AUTHED : NEXT_STEPS_GUEST;

  return (
    <section
      aria-labelledby="billing-success-heading"
      className="relative isolate overflow-hidden h-screen bg-[#EEF3FA]"
    >
   
      <div className="relative mx-auto flex min-h-[min(78vh,820px)] w-full max-w-3xl flex-col justify-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="animate-[fade-up_0.65s_cubic-bezier(0.23,1,0.32,1)_both]">
          <BrandLogo className="mb-10 h-10 w-44" />

          <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/90 p-6 shadow-[0_24px_60px_-36px_rgba(1,87,235,0.45)] backdrop-blur-sm sm:p-10">
            <div className="flex flex-col items-start gap-5 sm:items-center sm:text-center">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-[#0061F2]/10 text-[#0061F2] ring-1 ring-[#0061F2]/15">
                <CheckCircle2 className="size-8" strokeWidth={1.75} aria-hidden />
              </span>

              <div className="space-y-3">
                <h1
                  id="billing-success-heading"
                  className="font-heading text-3xl font-extrabold tracking-tight text-[#02172f] sm:text-4xl"
                >
                  Pago completado
                </h1>
                <p className="mx-auto max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
                  {user
                    ? "Tu plan profesional ya se está activando. En unos momentos verás los nuevos límites en tu cuenta."
                    : "Tu pago se ha procesado correctamente. Inicia sesión para ver el plan activado."}
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 pt-1 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  className="h-11 rounded-lg bg-[#0061F2] px-5 text-white transition-transform duration-150 ease-out hover:bg-[#0052cc] active:scale-[0.97]"
                  render={
                    <Link
                      href={
                        user
                          ? "/usuario/monetizacion"
                          : `${AUTH_ROUTES.LOGIN}?redirect=${encodeURIComponent("/usuario/monetizacion")}`
                      }
                    />
                  }
                >
                  {user ? "Ir a monetización" : "Iniciar sesión"}
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-lg border-slate-300 bg-white px-5 text-[#02172f] transition-transform duration-150 ease-out hover:bg-slate-50 active:scale-[0.97]"
                  render={
                    <Link
                      href={user ? "/usuario/mis-anuncios" : "/vehiculos"}
                    />
                  }
                >
                  {user ? "Ver mis anuncios" : "Explorar vehículos"}
                </Button>
              </div>
            </div>

            <ol className="mt-10 grid gap-4 border-t border-slate-100 pt-8 sm:grid-cols-3 sm:gap-5">
              {nextSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.title}
                    className="flex gap-3 sm:flex-col sm:items-center sm:text-center"
                  >
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF3FA] text-[#0061F2]">
                      <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-[#02172f]">
                        {step.title}
                      </p>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Si el plan no aparece al instante, recarga en unos segundos. La
            activación llega por webhook de Stripe.
          </p>
        </div>
      </div>
    </section>
  );
}
