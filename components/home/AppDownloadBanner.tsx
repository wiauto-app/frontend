import Image from "next/image";
import type { HomeAppAdvertisementData } from "./types/home-page.types";
import { AppPhoneMockup } from "./AppPhoneMockup";
import { SectionContainer } from "./SectionContainer";
import { StoreButtons } from "./StoreButtons";
import { SectionHeading } from "./SectionHeading";

type AppDownloadBannerProps = {
  data: HomeAppAdvertisementData;
};

export function AppDownloadBanner({ data }: AppDownloadBannerProps) {
  const firstWord = data.title.split(" ")[0];
  const restOfWords = data.title.split(" ").slice(1).join(" ");
  return (
    <SectionContainer className=" h-auto lg:h-[550px] flex items-end">
      <div
        className="relative  rounded-[2rem] sm:rounded-[2.5rem] w-full bg-primary dots-background  "
      >
    
        <div className="grid grid-cols-1 lg:grid-cols-2 py-10 px-5">
          <div className="flex justify-center  ">
            {data.app_mockup_url ? (
              <Image
                src={data.app_mockup_url}
                alt={data.title}
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

          <div className="text-center text-white lg:text-left space-y-4 z-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white sm:text-xs">
              {data.phrase}
            </p>
            <SectionHeading
              className="text-2xl text-center lg:text-left lg:text-5xl max-w-full w-full lg:max-w-sm  text-white"
              highlightClassName="text-primary-soft font-bold"
              lead={firstWord}
              highlight={restOfWords}
            />
            {/* <h2 className=" text-[1.75rem] font-bold leading-tight sm:text-3xl lg:text-[2.25rem] ">
              {}
            </h2> */}

            <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/95 sm:text-base lg:mx-0">
              {data.description}
            </p>
            <StoreButtons className=" justify-center lg:justify-start" />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
