import Image from "next/image";
import type { HomeAppAdvertisementData } from "./types/home-page.types";
import { AppPhoneMockup } from "./AppPhoneMockup";
import { SectionContainer } from "./SectionContainer";
import { StoreButtons } from "./StoreButtons";
import { BRAND_BLUE } from "./data/home-data";

type AppDownloadBannerProps = {
  data: HomeAppAdvertisementData;
};

export function AppDownloadBanner({ data }: AppDownloadBannerProps) {
  return (
    <SectionContainer className="py-12 lg:py-16">
      <div
        className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]"
        style={{ backgroundColor: BRAND_BLUE }}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[length:280px_140px] bg-repeat opacity-100"
          style={{
            backgroundImage: "url('/home/tire-tread-pattern.svg')",
            maskImage: "linear-gradient(to left, black 30%, transparent 85%)",
            WebkitMaskImage: "linear-gradient(to left, black 30%, transparent 85%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 grid items-center gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-4 lg:px-12 lg:py-14 xl:px-16">
          <div className="flex justify-center lg:justify-start lg:pl-4">
            <div className="lg:-mb-2 lg:-mt-2">
              {data.app_mockup_url ? (
                <Image
                  src={data.app_mockup_url}
                  alt={data.title}
                  width={260}
                  height={520}
                  className="mx-auto h-auto w-[230px] object-contain sm:w-[260px]"
                />
              ) : (
                <AppPhoneMockup />
              )}
            </div>
          </div>

          <div className="text-center text-white lg:py-4 lg:pl-6 lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white sm:text-xs">
              {data.phrase}
            </p>
            <h2 className="mt-4 text-[1.75rem] font-bold leading-tight sm:text-3xl lg:text-[2.25rem]">
              {data.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/95 sm:text-base lg:mx-0">
              {data.description}
            </p>
            <StoreButtons
              className="mt-8 justify-center lg:justify-start"
              google_store_labels={data.google_store_labels}
              apple_store_labels={data.apple_store_labels}
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
