import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import type { StrapiHero } from "@/interfaces/strapi-components.interface";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { HeroTitle } from "@/components/ui/heroTitle";
import { HeroDescription } from "@/components/ui/heroDescription";
import { HeroFeatures } from "@/components/home/heroFeatures";
import { Hero } from "@/components/ui/hero";
import { HeroActions } from "@/components/ui/heroActions";
import { HeroCard } from "@/components/ui/heroCard";

interface FinanciacionHeroSectionProps {
  hero: StrapiHero;
}

export const FinanciacionHeroSection = ({
  hero,
}: FinanciacionHeroSectionProps) => {
  const imageUrl = hero?.imagen?.url;

  return (
    <Hero
      leftContent={
        <>
          <HeroTitle>{hero?.titulo || ""}</HeroTitle>
          <HeroDescription>{hero?.descripcion || ""}</HeroDescription>
          <HeroFeatures features={hero?.caracteristicas || []} />
          <HeroActions actions={hero?.acciones || []} />
        </>
      }
      floatingContent={<HeroBackdrop/>}
      rightContent={
        <div className="flex justify-center items-center h-full">
          <HeroCard card={hero?.card}></HeroCard>
        </div>
      }
      image={imageUrl}
    />
  );
};
