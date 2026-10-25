import Image from "next/image";

import type { StrapiAppAdvertisment } from "@/interfaces/strapi-components.interface";

import { AppPhoneMockup } from "./AppPhoneMockup";
import { SectionContainer } from "./SectionContainer";
import { StoreButtons } from "./StoreButtons";

interface AppDownloadBannerProps {
  data: StrapiAppAdvertisment;
}

export function AppDownloadBanner({ data }: AppDownloadBannerProps) {
  return (
    <SectionContainer className="flex h-auto items-end lg:mt-64">
      <div className="w-full">
        <div className="dots-background relative w-full rounded-[2rem] bg-primary sm:rounded-[2.5rem]">
          <div className="grid grid-cols-1 px-5 py-10 lg:grid-cols-2">
            <div className="flex justify-center">
              {data.appMockup?.url ? (
                <Image
                  src={data.appMockup.url}
                  alt={data.title}
                  width={450}
                  height={800}
                  sizes="500px"
                  className="absolute bottom-0 hidden object-contain lg:block "
                />
              ) : (
                <AppPhoneMockup />
              )}
            </div>

            <div className="z-10 space-y-4 text-center text-white lg:text-left">
              {data.phrase ? (
                <p className="text-[11px] font-semibold tracking-[0.18em] text-white uppercase sm:text-xs">
                  {data.phrase}
                </p>
              ) : null}
              <h2 className="w-full max-w-full text-center text-2xl font-bold text-white lg:max-w-sm lg:text-left lg:text-5xl">
                {data.title}
              </h2>
              {data.description ? (
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/95 sm:text-base lg:mx-0">
                  {data.description}
                </p>
              ) : null}
              <StoreButtons
                soon={true}
                className="justify-center lg:justify-start"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
