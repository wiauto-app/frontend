import { Hero } from "@/components/ui/hero";
import { HeroTitle } from "@/components/ui/heroTitle";
import { HeroDescription } from "@/components/ui/heroDescription";
import { IconContainer } from "@/components/ui/iconContainer";
import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName } from "@/lib/strapi/resolveStrapiIconName";

import type { StrapiHero } from "@/interfaces/strapi-components.interface";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { HeroFeatures } from "@/components/home/heroFeatures";

interface AboutHeroSectionProps {
  hero: StrapiHero | null;
}

export const AboutHeroSection = ({ hero }: AboutHeroSectionProps) => {
  if (!hero) {
    return null;
  }

  const imageUrl = hero.imagen?.url;

  return (
    <Hero
      className="lg:h-auto bg-white"
      image={imageUrl}
      floatingContent={<HeroBackdrop></HeroBackdrop>}
      leftContent={
        <>
          <HeroTitle className="text-white lg:max-w-xl">
            {hero.titulo}
          </HeroTitle>
          {hero.descripcion ? (
            <HeroDescription className="text-white lg:max-w-lg">
              {hero.descripcion}
            </HeroDescription>
          ) : null}

          <HeroFeatures
            orientation="horizontal"
            features={hero.caracteristicas}
          />
        </>
      }
      rightContent={<div className="hidden lg:block" aria-hidden />}
    />
  );
};
