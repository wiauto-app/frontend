"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

import { SignInDialog } from "@/components/auth/signInDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_FEATURES = [
  "Guarda tu historial de conversaciones",
  "Búsqueda con IA en lenguaje natural",
  "Mapa interactivo de resultados",
] as const;

interface AuthRequiredGateProps {
  children: React.ReactNode;
  returnTo?: string;
  title?: string;
  description?: string;
  features?: string[];
}

export const AuthRequiredGate = ({
  children,
  returnTo,
  title = "Inicia sesión para usar el asistente",
  description = "Accede a tu cuenta para chatear con WiAuto AI, guardar conversaciones y ver resultados en el mapa.",
  features = [...DEFAULT_FEATURES],
}: AuthRequiredGateProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cardRef.current?.focus();
  }, []);

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none select-none blur-sm brightness-95 scale-[1.01]"
      >
        {children}
      </div>

      <div
        aria-modal="true"
        className="absolute inset-0 z-10 flex items-center justify-center bg-linear-to-b from-background/70 via-background/50 to-background/80 p-4 sm:p-6"
        role="dialog"
        aria-labelledby="auth-required-title"
        aria-describedby="auth-required-description"
      >
        <div
          ref={cardRef}
          tabIndex={-1}
          className={cn(
            "w-full max-w-md rounded-2xl border border-white/30 bg-white/90 p-6 shadow-2xl backdrop-blur-md",
            "outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          )}
        >
          <div className="mb-5 flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-7" aria-hidden="true" />
            </div>
            <h2
              id="auth-required-title"
              className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
            >
              {title}
            </h2>
            <p
              id="auth-required-description"
              className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base"
            >
              {description}
            </p>
          </div>

          <ul className="mb-6 space-y-2.5">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm text-slate-700"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2.5">
            <SignInDialog
              returnTo={returnTo}
              trigger={
                <Button className="w-full" size="lg" type="button">
                  Iniciar sesión
                </Button>
              }
            />
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              render={<Link href="/registro" />}
            >
              Crear cuenta gratis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
