import Image from "next/image";

import type { HeroFeature } from "@/interfaces/hero-feature.interface";
import { cn } from "@/lib/utils";

interface HeroFeatureIconProps {
  icon_url: string | null;
  icon_alt: string;
  className?: string;
}

const HeroFeatureIcon = ({
  icon_url,
  icon_alt,
  className,
}: HeroFeatureIconProps) => {
  if (icon_url) {
    return (
      <span
        className={cn(
          "relative inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15",
          className,
        )}
      >
        <Image
          src={icon_url}
          alt={icon_alt}
          unoptimized
          fill
          sizes="40px"
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

export const HeroFeatures = ({ features }: { features: HeroFeature[] }) => {
  if (features.length === 0) {
    return null;
  }

  return (
    <ul className=" hidden lg:flex flex-col gap-3 sm:gap-x-6 sm:gap-y-3">
      {features.map((feature) => (
        <li key={feature.id} className="flex items-center gap-3">
          <HeroFeatureIcon
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
