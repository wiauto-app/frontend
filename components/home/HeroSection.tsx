import type { StrapiHomeHero } from "@/interfaces/strapi-components.interface";
import { getStrapiMediaUrl } from "@/lib/strapi-media";

import { Hero } from "../ui/hero";
import { HeroBackdrop } from "../ui/heroBackdrop";
import { HeroDescription } from "../ui/heroDescription";
import { HeroTitle } from "../ui/heroTitle";
import { HeroBackgroundCarousel } from "./HeroBackgroundCarousel";
import { HeroFeatures } from "./heroFeatures";
import { HeroSearchForm } from "./HeroSearchForm";
import { StoreButtons } from "./StoreButtons";

interface HeroSectionProps {
  data: StrapiHomeHero | null | undefined;
}

export function HeroSection({ data }: HeroSectionProps) {
  if (!data) {
    return null;
  }

  const title = data.title?.trim() || "";
  const features = data.caracteristicas ?? [];

  return (
    <Hero
      className="px-3"
      leftContent={
        <div className="flex flex-col">
          <div className="flex flex-col  text-white gap-2 lg:gap-5 2xl:px-14">
            <div>
              <HeroTitle
                highlight
                className="text-black text-start  max-w-[75%] lg:max-w-full" 
              >
                {title}
              </HeroTitle>
            </div>

            {data.subtitle ? (
              <div>
                <HeroDescription className="text-black block text-start  text-xs max-w-[65%] lg:max-w-full">
                  {data.subtitle}
                </HeroDescription>
              </div>
            ) : null}

            <div>
              <HeroFeatures
                className="text-black text-xs "
                features={features}
                orientation="horizontal"
                containerClassName="gap-2 flex flex-wrap"
              />
            </div>
          </div>
        </div>
      }
      rightContent={
        <div className="flex h-full items-end justify-center">
          <HeroSearchForm />
        </div>
      }
      floatingContent={
        <>
          <div className="absolute z-10 hidden flex-col gap-1 rounded-s-lg bg-black/50 p-2 lg:top-0 lg:right-0 lg:flex">
            <StoreButtons className="flex flex-col gap-1" />
          </div>

          {/* <HeroBackdrop /> */}

          <div className="absolute inset-0 z-0">
            <HeroBackgroundCarousel images={data.heroImages} />
          </div>
        </>
      }
    />
  );
}
