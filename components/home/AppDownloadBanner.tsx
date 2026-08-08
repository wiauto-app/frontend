import Image from "next/image";

import type { StrapiAppAdvertisment } from "@/interfaces/strapi-components.interface";
import { getStrapiMediaUrl } from "@/lib/strapi-media";

import { AppPhoneMockup } from "./AppPhoneMockup";
import { MotionSection } from "./motion";
import { SectionContainer } from "./SectionContainer";
import { SectionHeading } from "./SectionHeading";
import { StoreButtons } from "./StoreButtons";

interface AppDownloadBannerProps {
  data: StrapiAppAdvertisment | null | undefined;
}

export function AppDownloadBanner({ data }: AppDownloadBannerProps) {
  if (!data?.title?.trim()) {
    return null;
  }

  const title = data.title.trim();
  const first_word = title.split(" ")[0] ?? "";
  const rest_of_words = title.split(" ").slice(1).join(" ");
  const app_mockup_url = getStrapiMediaUrl(data.appMockup?.url);

  return (
    <MotionSection>
      <SectionContainer className=" flex h-auto items-end lg:h-[550px]">
        <div className="dots-background relative w-full rounded-[2rem] bg-primary sm:rounded-[2.5rem] ">
          <div className="grid grid-cols-1 px-5 py-10 lg:grid-cols-2">
            <div className="flex justify-center  ">
              {app_mockup_url ? (
                <Image
                  src={app_mockup_url}
                  alt={title}
                  width={260}
                  height={520}
                  sizes="260px"
                  className="absolute bottom-16 hidden object-contain lg:block"
                  style={{ width: 260, height: "auto" }}
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
              <SectionHeading
                className="w-full max-w-full text-center text-2xl text-white lg:max-w-sm lg:text-left lg:text-5xl"
                highlightClassName="text-primary-soft font-bold"
                lead={first_word}
                highlight={rest_of_words}
              />
              {data.description ? (
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/95 sm:text-base lg:mx-0">
                  {data.description}
                </p>
              ) : null}
              <StoreButtons className=" justify-center lg:justify-start" />
            </div>
          </div>
        </div>
      </SectionContainer>
    </MotionSection>
  );
}
