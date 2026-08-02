import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import type { StrapiHero } from "@/interfaces/strapi-components.interface";
import { cn } from "@/lib/utils";
import { Hero } from "@/components/ui/hero";
import { HeroTitle } from "@/components/ui/heroTitle";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { HeroDescription } from "@/components/ui/heroDescription";
import { HeroFeatures } from "@/components/home/heroFeatures";
import { HeroActions } from "@/components/ui/heroActions";
import { HeroCard } from "@/components/ui/heroCard";

interface FinanciacionHeroSectionProps {
  hero: StrapiHero;
}

export const FinanciacionHeroSection = ({
  hero,
}: FinanciacionHeroSectionProps) => {
  const image_url = hero.imagen?.url;


  return (
    <Hero
      image={image_url}
      floatingContent={<HeroBackdrop/>}
      leftContent={
        <>
          <HeroTitle>{hero.titulo}</HeroTitle>
          <HeroDescription>{hero.descripcion}</HeroDescription>
          <HeroFeatures features={hero.caracteristicas ?? []} />
          <HeroActions actions={hero.acciones ?? []} />
        </>
      }
      rightContent={
        <div className="flex justify-center items-center h-full">
          <HeroCard card={hero.card ?? null} />
        </div>
      }
    />
  );
};
