import { HeroFeatures } from "@/components/home/heroFeatures";
import { Hero } from "@/components/ui/hero";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { HeroDescription } from "@/components/ui/heroDescription";
import { HeroTitle } from "@/components/ui/heroTitle";
import { HeroActions } from "@/components/ui/heroActions";

import type { SegurosHero } from "../interfaces/seguros.interface";
import { SegurosHeroCard } from "./SegurosHeroCard";

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
          <SegurosHeroCard card={card} />
        </div>
      }
      floatingContent={<HeroBackdrop />}
    />
  );
};
