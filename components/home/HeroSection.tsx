import { HeroBackgroundCarousel } from "./HeroBackgroundCarousel";
import { StoreButtons } from "./StoreButtons";
import type { HomeHeroData } from "./types/home-page.types";
import { HeroSearchForm } from "./HeroSearchForm";
import { Hero } from "../ui/hero";
import { HeroTitle } from "../ui/heroTitle";
import { HeroDescription } from "../ui/heroDescription";
import { HeroFeatures } from "./heroFeatures";
import { HeroBackdrop } from "../ui/heroBackdrop";

interface HeroSectionProps {
  data: HomeHeroData;
}

export function HeroSection({ data }: HeroSectionProps) {
  if (!data.background_image_url) {
    return null;
  }
  return (
    <Hero
      leftContent={
        <div className="flex flex-col ">
          <div className="text-white flex flex-col lg:gap-5 px-4 2xl:px-14">
            <HeroTitle>{data.title}</HeroTitle>
            {data.subtitle ? (
              <HeroDescription>{data.subtitle}</HeroDescription>
            ) : null}
            <HeroFeatures features={data.features} />
          </div>
        </div>
      }
      rightContent={
        <div className="flex  justify-center items-end h-full">
          <HeroSearchForm />
        </div>
      }
      floatingContent={
        <>
          <div className="absolute hidden lg:flex lg:top-0 lg:right-0 bg-black/50 rounded-s-lg p-2 z-10 flex-col gap-1">
            {/* <p className="text-white text-sm font-bold">
        {data.download_app_label}
      </p> */}
            <StoreButtons className="flex flex-col gap-1" />
          </div>
          <HeroBackdrop/>
          <HeroBackgroundCarousel
            images={data.hero_images}
            fallbackUrl={data.background_image_url}
            title={data.title}
          />
        </>
      }
    />
  );
}
