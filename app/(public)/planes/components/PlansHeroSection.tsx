
import type { PlanesHero } from "../interfaces/planes.interface";
import { PlansLeadForm } from "./PlansLeadForm";
import { Hero } from "@/components/ui/hero";
import { HeroTitle } from "@/components/ui/heroTitle";
import { HeroDescription } from "@/components/ui/heroDescription";
import { HeroActions } from "@/components/ui/heroActions";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";

type PlansHeroSectionProps = {
  hero: PlanesHero;
};

export const PlansHeroSection = ({ hero }: PlansHeroSectionProps) => {
  return (
    <Hero
      id="hero"
      className="lg:h-150 "
      image={hero.imagen?.url}
      leftContent={
        <>
          <HeroTitle>{hero.titulo}</HeroTitle>
          <HeroDescription>{hero.descripcion}</HeroDescription>
          <HeroActions actions={hero.acciones} />
        </>
      }
      rightContent={
        <div className=" flex justify-center w-full">
          <PlansLeadForm />
        </div>
      }
      floatingContent={
        <>
      
          <HeroBackdrop />
        </>
      }
    />
  );
};
