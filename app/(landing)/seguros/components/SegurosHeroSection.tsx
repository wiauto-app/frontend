import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { HeroFeatures } from "@/components/home/heroFeatures";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/hero";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { HeroDescription } from "@/components/ui/heroDescription";
import { HeroTitle } from "@/components/ui/heroTitle";
import { getStrapiMediaUrl } from "@/lib/strapi-media";

import { CONFIDENZA_WEBSITE } from "../constants";
import type { SegurosHero } from "../interfaces/seguros.interface";
import { HeroCard } from "@/components/ui/heroCard";
import { StrapiButton } from "@/components/ui/strapiButton";
import { HeroActions } from "@/components/ui/heroActions";

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
        <div className="flex justify-center items-center">
          <HeroCard card={card} />
        </div>
      }
      floatingContent={<HeroBackdrop />}
    />
  );
};
