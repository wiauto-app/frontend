import Image from "next/image";

import type { StrapiHero } from "@/interfaces/strapi-components.interface";
import { HeroActions } from "@/components/ui/heroActions";
import { HeroTitle } from "@/components/ui/heroTitle";
import type { StrapiIconPack } from "@/lib/strapi/resolveStrapiIconName";
import { cn } from "@/lib/utils";

import { IconFeatureList } from "./IconFeatureList";

interface LandingHeroSectionProps {
  /** `shared.hero`: título (última palabra resaltada), descripción, features, acciones e imagen. */
  hero: StrapiHero;
  iconPack: StrapiIconPack;
  /** Contenido de la columna derecha; si no hay, se muestra `hero.imagen`. */
  rightContent?: React.ReactNode;
  className?: string;
}

/** Hero claro para landings: texto + features a la izquierda, imagen o contenido a la derecha. */
export const LandingHeroSection = ({
  hero,
  iconPack,
  rightContent,
  className,
}: LandingHeroSectionProps) => (
  <section
    className={cn(
      "relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 via-white to-sky-50 px-4 py-8 lg:px-10 lg:py-12",
      className,
    )}
  >
    <div className="grid items-center gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <HeroTitle
          highlight
          className="text-center text-3xl leading-tight text-slate-900 lg:max-w-xl lg:text-left lg:text-5xl"
          highlightClassName="block text-primary"
        >
          {hero.titulo}
        </HeroTitle>
        {hero.descripcion ? (
          <p className="text-center text-base text-slate-600 lg:max-w-lg lg:text-left lg:text-lg">
            {hero.descripcion}
          </p>
        ) : null}
        <IconFeatureList items={hero.caracteristicas} iconPack={iconPack} variant="grid" />
        {hero.acciones.length > 0 ? <HeroActions actions={hero.acciones} /> : null}
      </div>

      {rightContent ??
        (hero.imagen?.url ? (
          <div className="relative hidden aspect-[4/3] w-full lg:block">
            <Image
              src={hero.imagen.url}
              alt={hero.imagen.alternativeText ?? hero.titulo}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover rounded-2xl"
            />
          </div>
        ) : null)}
    </div>
  </section>
);
