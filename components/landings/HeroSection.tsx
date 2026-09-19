"use client";

import Link from "next/link";
import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import { resolveStrapiIconName, StrapiIconPack } from "@/lib/strapi/resolveStrapiIconName";

import { Hero } from "@/components/ui/hero";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { HeroDescription } from "@/components/ui/heroDescription";
import { HeroTitle } from "@/components/ui/heroTitle";

import { HeroCard } from "../ui/heroCard";
import { StrapiHero } from "@/interfaces/strapi-components.interface";
import { HeroActions } from "../ui/heroActions";
import { HeroFeatures } from "../home/heroFeatures";
import { collabsIconPack } from "@/app/(landing)/colaboraciones/components/collabsIconPack";

interface HeroSectionProps {
  hero?: StrapiHero;
  className?: string;
}

export const HeroSection = ({ hero, className }: HeroSectionProps) => {
  if (!hero) {
    return null;
  }

  const backgroundUrl = hero.imagen?.url;

  return (
    <Hero
      className={`lg:h-auto ${className ?? ""}`}
      image={backgroundUrl ?? undefined}
      leftContent={
        <>
          {hero.titulo ? <HeroTitle>{hero.titulo}</HeroTitle> : null}

          {hero.descripcion ? (
            <HeroDescription>{hero.descripcion}</HeroDescription>
          ) : null}
          <HeroFeatures features={hero.caracteristicas} iconPack={collabsIconPack} />
          <HeroActions actions={hero.acciones} />
        </>
      }
      floatingContent={<HeroBackdrop />}
      rightContent={<div className="w-full flex justify-center">{hero.card ? <HeroCard card={hero.card} /> : null}</div>}
    />
  );
};
