import Image from "next/image";
import type { ReactNode } from "react";

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
  rightContent?: ReactNode;
  className?: string;
}

const HERO_IMAGE_FADE =
  "mask-[linear-gradient(to_right,transparent_0%,black_38%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_38%)]";

/** Hero claro para landings: mitad texto (izquierda) y mitad imagen o contenido (derecha). */
export const LandingHeroSection = ({
  hero,
  iconPack,
  rightContent,
  className,
}: LandingHeroSectionProps) => {
  const showHeroImage = !rightContent && Boolean(hero.imagen?.url);
  const hasSecondColumn = Boolean(rightContent || showHeroImage);

  return (
    <section
      className={cn(
        "relative flex overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 via-white to-sky-50",
        hasSecondColumn ? "flex-row" : "flex-col",
        className,
      )}
    >
      <div className="flex flex-col justify-center gap-5 px-4 py-8 lg:px-5 lg:py-12">
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

      {rightContent ? (
        <div className="flex w-full items-center px-4 py-8 lg:px-10 lg:py-12">
          {rightContent}
        </div>
      ) : null}

      {showHeroImage && hero.imagen?.url ? (
        <div
          className={cn("relative min-h-56 w-full lg:min-h-0", HERO_IMAGE_FADE)}
        >
          <Image
            src={hero.imagen.url}
            alt={hero.imagen.alternativeText ?? hero.titulo}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-blue-50/90 via-transparent to-transparent"
          />
        </div>
      ) : null}
    </section>
  );
};
