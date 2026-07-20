import { HeroBackgroundCarousel } from "./HeroBackgroundCarousel";
import { StoreButtons } from "./StoreButtons";
import type { HomeHeroData } from "./types/home-page.types";
import { HeroSearchForm } from "./HeroSearchForm";
import { Hero } from "../ui/hero";
import { HeroTitle } from "../ui/heroTitle";
import { HeroDescription } from "../ui/heroDescription";
import { HeroFeatures } from "./heroFeatures";

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
          <div className="text-white space-y-5 px-14">
            <HeroTitle>{data.title}</HeroTitle>
            {data.subtitle ? (
              <HeroDescription>{data.subtitle}</HeroDescription>
            ) : null}
            <HeroFeatures features={data.features} />
          </div>
        </div>
      }
      rightContent={
        <div className="flex  justify-center items-end">
          <HeroSearchForm />
        </div>
      }
      floatingContent={
        <>
          <div className="absolute top-0 right-0 bg-black/50 rounded-s-lg p-2 z-10 flex flex-col gap-1">
            {/* <p className="text-white text-sm font-bold">
        {data.download_app_label}
      </p> */}
            <StoreButtons className="flex flex-col gap-1" />
          </div>
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
