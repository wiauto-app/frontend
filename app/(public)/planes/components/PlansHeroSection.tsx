import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import { cn } from "@/lib/utils";

import type { PlanesHero } from "../interfaces/planes.interface";
import { PlansLeadForm } from "./PlansLeadForm";

type PlansHeroSectionProps = {
  hero: PlanesHero;
};

export const PlansHeroSection = ({ hero }: PlansHeroSectionProps) => {
  const hero_image_url =
    getStrapiMediaUrl(hero.imagen?.formats?.large?.url) ??
    getStrapiMediaUrl(hero.imagen?.formats?.medium?.url) ??
    getStrapiMediaUrl(hero.imagen?.url);

  return (
    <section className="gradient-primary py-12 overflow-hidden rounded-b-xl">
      <div className="container mx-auto max-w-7xl px-10 relative">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:items-start z-10">
          <div className="flex flex-col gap-6 z-10 col-span-2 justify-center h-full lg:max-w-[600px]">
            <div className="flex flex-col gap-4 z-10">
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl z-10">
                {hero.titulo}
              </h1>
              <p className="text-base text-white md:text-lg z-10">
                {hero.descripcion}
              </p>
            </div>
            {hero.acciones && hero.acciones.length > 0 ? (
              <div className="flex flex-wrap gap-3 z-10">
                {hero.acciones.map((accion) => (
                  <Link
                    key={accion.id}
                    href={accion.url || "#"}
                    className={cn(
                      buttonVariants({
                        variant: accion.destacado ? "default" : "outline",
                        size: "lg",
                      }),
                      accion.destacado
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "border-blue-600 text-blue-600 hover:bg-blue-50",
                    )}
                  >
                    {accion.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <PlansLeadForm />
        </div>
        {hero_image_url ? (
          <Image
            src={hero_image_url}
            alt={hero.imagen?.alternativeText ?? hero.titulo ?? "WiAuto"}
            fill
            className="object-contain "
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : null}
      </div>
    </section>
  );
};
