
import { resolveStrapiIconName } from "@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName";
import type { StrapiIconFeature } from "@/interfaces/strapi-components.interface";
import { cn } from "@/lib/utils";

import { IconContainer } from "../ui/iconContainer";

export const HeroFeatures = ({
  features,
  containerClassName,
  className,
  orientation = "vertical",
}: {
  features: StrapiIconFeature[];
  containerClassName?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
}) => {
  if (features.length === 0) {
    return null;
  }

  return (
    <ul
      className={cn(
        " hidden lg:flex gap-3 sm:gap-x-6 sm:gap-y-3",
        orientation === "vertical" ? "flex-col" : "flex-row",
        containerClassName,
      )}
    >
      {features.map((feature) => (
        <li key={feature.id} className="flex items-center gap-1 lg:gap-2">
          <IconContainer
            Icon={resolveStrapiIconName(feature.iconName)}
            justIcon
          />
          <div className="min-w-0">
            <p className={cn("text-sm  text-white", className)}>
              {feature.label}
            </p>
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
