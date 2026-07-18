import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { PlanesLinkAction } from "../interfaces/planes.interface";

type PlansFinalCtaSectionProps = {
  primaryCta?: PlanesLinkAction | null;
};

export const PlansFinalCtaSection = ({ primaryCta }: PlansFinalCtaSectionProps) => {
  const cta_href = primaryCta?.url?.trim() || "/contacto";
  const cta_label = primaryCta?.label?.trim() || "Contactar ahora";

  return (
    <section className="bg-blue-600 py-16 lg:py-20 rounded-xl">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Únete a miles de profesionales que ya confían en WiAuto
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-blue-100 md:text-lg">
          Publica, gestiona y vende con las herramientas que tu negocio automotriz necesita para
          crecer.
        </p>
        <div className="mt-8">
          <Link
            href={cta_href}
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-white text-blue-600 hover:bg-blue-50",
            )}
          >
            {cta_label}
          </Link>
        </div>
      </div>
    </section>
  );
};
