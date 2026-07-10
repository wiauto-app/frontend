import type {
  HomeAppAdvertisementData,
  HomeHeroData,
  HomeHeroFeature,
} from "./types/home-page.types";
import { SearchForm } from "./searchForm";
import { AiSearchForm } from "./aiSearchForm";
import Image from "next/image";
import { StoreButtons } from "./StoreButtons";
import { cn } from "@/lib/utils";

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
    <section className="relative min-h-[560px]  rounded-lg mb-20 ">
      <div className="absolute top-10 right-0 bg-black/50 rounded-s-lg p-4 z-10 flex flex-col gap-2">
        <p className="text-white text-sm font-bold">
          {data.download_app_label}
        </p>
        <StoreButtons
          className="flex flex-col gap-2"
          google_store_labels={app_advertisement.google_store_labels}
          apple_store_labels={app_advertisement.apple_store_labels}
        />
      </div>
      <Image
        src={data.background_image_url ?? ""}
        alt={data.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        className="object-cover rounded-b-lg overflow-hidden"
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(10,25,60,0.88) 0%, rgba(10,25,60,0.72) 45%, rgba(10,25,60,0.45) 100%)",
        }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 right-0 h-32 w-48 bg-[#0a193c] sm:h-40 sm:w-64"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        aria-hidden
      />

      <div className="relative mx-auto flex container-custom flex-col gap-10 pt-10 pb-32">
        <div className="text-white space-y-5 px-14">
          <h1 className="font-bold lg:text-4xl max-w-md">{data.title}</h1>
          {data.subtitle ? (
            <p className="text-base text-white/90  max-w-md">{data.subtitle}</p>
          ) : null}
          <HeroFeaturesList features={data.features} />
        </div>
      </div>
      <div className="absolute -bottom-24 w-[90%] left-1/2 -translate-x-1/2">
        <SearchForm />
      </div>
    </section>
  );
}
