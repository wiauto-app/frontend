"use client";

import { motion } from "motion/react";

import { defaultStrapiIconPack } from "@/lib/strapi/defaultStrapiIconPack";
import {
  resolveStrapiIconName,
  type StrapiIconPack,
} from "@/lib/strapi/resolveStrapiIconName";
import type { StrapiIconFeature } from "@/interfaces/strapi-components.interface";
import { cn } from "@/lib/utils";

import { IconContainer } from "../ui/iconContainer";
import {
  getVariant,
  HERO_DELAYS,
  slideFromLeft,
  staggerContainerExpressive,
  withDelay,
} from "./motion/motion-variants";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";

interface HeroFeaturesMotionProps {
  features: StrapiIconFeature[];
  containerClassName?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
  iconPack?: StrapiIconPack;
}

export const HeroFeaturesMotion = ({
  features,
  containerClassName,
  className,
  orientation = "vertical",
  iconPack = defaultStrapiIconPack,
}: HeroFeaturesMotionProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (features.length === 0) {
    return null;
  }

  if (prefersReducedMotion) {
    return (
      <ul
        className={cn(
          "hidden lg:flex gap-3 sm:gap-x-6 sm:gap-y-3",
          orientation === "vertical" ? "flex-col" : "flex-row",
          containerClassName,
        )}
      >
        {features.map((feature) => (
          <li key={feature.id} className="flex items-center gap-1 lg:gap-2">
            <IconContainer
              Icon={resolveStrapiIconName(feature.iconName, iconPack)}
              justIcon
            />
            <div className="min-w-0">
              <p className={cn("text-sm text-white", className)}>
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
  }

  const containerVariants = withDelay(
    staggerContainerExpressive,
    HERO_DELAYS.features,
  );
  const itemVariants = getVariant(slideFromLeft, false);

  return (
    <motion.ul
      className={cn(
        "hidden lg:flex gap-3 sm:gap-x-6 sm:gap-y-3",
        orientation === "vertical" ? "flex-col" : "flex-row",
        containerClassName,
      )}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {features.map((feature) => (
        <motion.li
          key={feature.id}
          className="flex items-center gap-1 lg:gap-2"
          variants={itemVariants}
        >
          <IconContainer
            Icon={resolveStrapiIconName(feature.iconName, iconPack)}
            justIcon
          />
          <div className="min-w-0">
            <p className={cn("text-sm text-white", className)}>
              {feature.label}
            </p>
            {feature.descripcion ? (
              <p className={cn("mt-0.5 text-xs text-white/75", className)}>
                {feature.descripcion}
              </p>
            ) : null}
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
};
