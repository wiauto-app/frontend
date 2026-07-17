import Image from "next/image";

import { cn } from "@/lib/utils";

import { HeroBackgroundCarousel } from "./HeroBackgroundCarousel";
import { StoreButtons } from "./StoreButtons";
import type {
  HomeAppAdvertisementData,
  HomeHeroData,
  HomeHeroFeature,
} from "./types/home-page.types";
import { HeroSearchForm } from "./HeroSearchForm";

interface HeroSectionProps {
  data: HomeHeroData;
  app_advertisement: HomeAppAdvertisementData;
}

interface HeroFeatureIconProps {
  icon_url: string | null;
  icon_alt: string;
  className?: string;
  size?: number;
}

const HeroFeatureIcon = ({
  icon_url,
  icon_alt,
  className,
  size = 8,
}: HeroFeatureIconProps) => {
  if (icon_url) {
    return (
      <span
        className={cn(
          "inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 relative",
          className,
        )}
      >
        <Image
          src={icon_url}
          alt={icon_alt}
          unoptimized
          width={size}
          height={size}
          className="object-contain"
        />
      </span>
    );
  }

  return (
    <span
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
};

const HeroFeaturesList = ({ features }: { features: HomeHeroFeature[] }) => {
  if (features.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-3  sm:gap-x-6 sm:gap-y-3">
      {features.map((feature) => (
        <li key={feature.id} className="flex items-center gap-3">
          <HeroFeatureIcon
            size={20}
            className="bg-primary h-10 w-10 rounded-full"
            icon_url={feature.icon_url}
            icon_alt={feature.icon_alt ?? feature.label}
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">{feature.label}</p>
            {feature.description ? (
              <p className="mt-0.5 text-xs text-white/75">
                {feature.description}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
};

export function HeroSection({ data, app_advertisement }: HeroSectionProps) {
  return (
    <section className="relative h-[560px]  rounded-lg py-12 ">
      <div className="absolute top-5 right-0 bg-black/50 rounded-s-lg p-2 z-10 flex flex-col gap-1">
        {/* <p className="text-white text-sm font-bold">
          {data.download_app_label}
        </p> */}
        <StoreButtons
          className="flex flex-col gap-1"
          google_store_labels={app_advertisement.google_store_labels}
          apple_store_labels={app_advertisement.apple_store_labels}
        />
      </div>
      <HeroBackgroundCarousel
        images={data.hero_images}
        fallbackUrl={data.background_image_url}
        title={data.title}
      />

      <div className="relative mx-auto  container-custom grid grid-cols-1 lg:grid-cols-2 gap-10  h-full">
        <div className="flex flex-col ">
          <div className="text-white space-y-5 px-14">
            <h1 className="font-bold lg:text-4xl max-w-md">{data.title}</h1>
            {data.subtitle ? (
              <p className="text-base text-white/90  max-w-md">
                {data.subtitle}
              </p>
            ) : null}
            <HeroFeaturesList features={data.features} />
          </div>
        </div>
        <div className="flex flex-col justify-end items-end">
          <HeroSearchForm />
        </div>
      </div>
    </section>
  );
}
