import Image from "next/image";

import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";
import type { StrapiIconFeature } from "@/interfaces/strapi-components.interface";
import { cn } from "@/lib/utils";

import { IconContainer } from "../ui/iconContainer";

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
          alt={`magen de ${icon_alt}`}
          sizes="20px"
          width={20}
          height={20}
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

export const HeroFeatures = ({ features, className }: { features: StrapiIconFeature[], className?: string }) => {
  if (features.length === 0) {
    return null;
  }

  return (
    <ul className=" hidden lg:flex flex-col gap-3 sm:gap-x-6 sm:gap-y-3">
      {features.map((feature) => (
        <li key={feature.id} className="flex items-center gap-3">
          <IconContainer Icon={resolveStrapiIconName(feature.iconName)} justIcon />
          <div className="min-w-0">
            <p className={cn("text-sm font-medium text-white", className)}>{feature.label}</p>
            {feature.descripcion ? (
              <p className={cn("mt-0.5 text-xs text-white/75", className)}>
                {feature.descripcion}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
};
