"use client";

import { HeroFeatures } from "@/components/home/heroFeatures";
import { STRAPI_ACTION_KEYS } from "@/components/strapi-actions/strapi-action-keys";
import { StrapiActionProvider } from "@/components/strapi-actions/strapi-action-context";
import { Hero } from "@/components/ui/hero";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { HeroCard } from "@/components/ui/heroCard";
import { HeroDescription } from "@/components/ui/heroDescription";
import { HeroTitle } from "@/components/ui/heroTitle";
import { HeroActions } from "@/components/ui/heroActions";

import type { SegurosHero } from "../interfaces/seguros.interface";

interface SegurosHeroSectionProps {
  hero: SegurosHero | null;
}

export const SegurosHeroSection = ({ hero }: SegurosHeroSectionProps) => {
  if (!hero) {
    return null;
  }

  const background_url = hero.imagen?.url;
  const card = hero.card;

  return (
    <StrapiActionProvider actionKey={STRAPI_ACTION_KEYS.SEGUROS_FORM}>
      <Hero
        className="lg:h-auto"
        image={background_url ?? undefined}
        leftContent={
          <>
            {hero.titulo ? <HeroTitle>{hero.titulo}</HeroTitle> : null}

            {hero.descripcion ? (
              <HeroDescription>{hero.descripcion}</HeroDescription>
            ) : null}

            <HeroFeatures features={hero.caracteristicas ?? []} />
            <HeroActions actions={hero.acciones ?? []} />
          </>
        }
        rightContent={
          <div className="flex w-full justify-center">
            {card ? <HeroCard card={card} /> : null}
          </div>
        }
        floatingContent={<HeroBackdrop />}
      />
    </StrapiActionProvider>
  );
};
