
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

  const background_image_url = getStrapiMediaUrl(
    data.backgroundImage?.url,
  );

  if (!background_image_url) {
    return null;
  }

  const title = data.title?.trim() || "";
  const features = data.caracteristicas ?? [];

  return (
    <Hero
      leftContent={
        <div className="flex flex-col">
          <div className="flex flex-col px-4 text-white lg:gap-5 2xl:px-14">
            <div>
              <HeroTitle>{title}</HeroTitle>
            </div>

            {data.subtitle ? (
              <div>
                <HeroDescription>{data.subtitle}</HeroDescription>
              </div>
            ) : null}

            <div>
              <HeroFeatures features={features} />
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

          <HeroBackdrop />

          <div className="absolute inset-0 z-0">
            <HeroBackgroundCarousel
              images={data.heroImages}
              fallbackUrl={background_image_url}
              title={title}
            />
          </div>
        </>
      }
    />
  );
}