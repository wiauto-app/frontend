import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { StrapiHero } from "@/interfaces/strapi-components.interface";
import { cn } from "@/lib/utils";

interface FinanciacionSoporteSectionProps {
  hero: StrapiHero;
}

export const FinanciacionSoporteSection = ({
  hero,
}: FinanciacionSoporteSectionProps) => {
  const acciones = hero.acciones?.filter((accion) => accion.label?.trim()) ?? [];

  return (
    <section className="rounded-2xl bg-slate-50 px-6 py-12 text-center sm:px-10">
      {hero.titulo ? (
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {hero.titulo}
        </h2>
      ) : null}
      {hero.descripcion ? (
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          {hero.descripcion}
        </p>
      ) : null}
      {acciones.length > 0 ? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {acciones.map((accion) => (
            <Link
              key={accion.id}
              href={accion.url || "#"}
              className={cn(
                buttonVariants({
                  variant: accion.destacado ? "default" : "outline",
                  size: "lg",
                }),
              )}
              aria-label={accion.label}
            >
              {accion.label}
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
};
