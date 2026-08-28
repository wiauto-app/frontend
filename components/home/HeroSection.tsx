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
    <>
      <Hero
        className="px-3 h-80 md:h-auto  lg:h-auto overflow-visible "
        contentClassName="lg:grid-cols-1"
        image="https://media.wiauto.es/wiauto-strapi/41_C5_DDB_7_9_D8_F_4_ACE_82_CC_BE_887_E4_CBFEC_e38f248f10.jpeg"
        imageClassName="object-center block md:hidden"
        // rightContent={
        //   <div className="flex md:hidden h-full items-end justify-center absolute sm:static -bottom-60 left-0 right-0 ">
        //     <HeroSearchForm />
        //   </div>
        // }
        leftContent={
          <div className="flex flex-col  w-full">
            <div className="flex flex-col  gap-2 lg:gap-5 2xl:px-14">
              <div>
                <HeroTitle
                  highlight
                  className=" text-start text-black text-2xl max-w-[55%] "
                >
                  {title}
                </HeroTitle>
              </div>

              {data.subtitle ? (
                <div>
                  <HeroDescription className=" block text-start  text-black  text-xs max-w-[65%] lg:max-w-full">
                    {data.subtitle}
                  </HeroDescription>
                </div>
              ) : null}

              <HeroFeatures
                className="text-xs text-black"
                features={features}
                orientation="horizontal"
                containerClassName="gap-2 flex flex-wrap max-w-[60%]"
              />
              <br className="hidden md:block" />
              <div className="hidden md:block">
                <HeroSearchForm />
              </div>
            </div>
          </div>
        }
        floatingContent={
          <>
            <div className="absolute z-10 hidden flex-col gap-1 rounded-s-lg bg-black/50 p-2 lg:top-0 lg:right-0 lg:flex">
              <StoreButtons className="flex flex-col gap-1" />
            </div>

            {/* <HeroBackdrop /> */}

            <div className=" hidden md:block absolute inset-0 z-0">
              <HeroBackgroundCarousel images={data.heroImages} />
            </div>
          </>
        }
      />
      <div className="block md:hidden">
        <HeroSearchForm />
      </div>
    </>
  );
}
