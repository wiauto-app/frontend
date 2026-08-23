import type { StrapiHomeHero } from "@/interfaces/strapi-components.interface";

import { Hero } from "../ui/hero";
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
      className="px-3 h-80 sm:h-auto overflow-visible "
      image="https://media.wiauto.es/wiauto-strapi/41_C5_DDB_7_9_D8_F_4_ACE_82_CC_BE_887_E4_CBFEC_e38f248f10.jpeg"
      leftContent={
        <div className="flex flex-col">
          <div className="flex flex-col  text-white gap-2 lg:gap-5 2xl:px-14">
            <div>
              <HeroTitle
                highlight
                className="text-black text-start  text-2xl max-w-[75%] lg:max-w-full"
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
        <div className="flex h-full items-end justify-center absolute sm:static -bottom-60 left-0 right-0 ">
          <HeroSearchForm />
        </div>
      }
      floatingContent={
        <>
          <div className="absolute z-10 hidden flex-col gap-1 rounded-s-lg bg-black/50 p-2 lg:top-0 lg:right-0 lg:flex">
            <StoreButtons className="flex flex-col gap-1" />
          </div>

          {/* <HeroBackdrop /> */}

          <div className=" hidden lg:block absolute inset-0 z-0">
            <HeroBackgroundCarousel images={data.heroImages} />
          </div>
        </>
      }
    />
  );
}
