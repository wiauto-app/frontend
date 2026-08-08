"use client";

import { motion } from "motion/react";

import type { StrapiHomeHero } from "@/interfaces/strapi-components.interface";
import { getStrapiMediaUrl } from "@/lib/strapi-media";

import { Hero } from "../ui/hero";
import { HeroBackdrop } from "../ui/heroBackdrop";
import { HeroDescription } from "../ui/heroDescription";
import { HeroTitle } from "../ui/heroTitle";
import { HeroBackgroundCarousel } from "./HeroBackgroundCarousel";
import { HeroFeatures } from "./heroFeatures";
import { HeroSearchForm } from "./HeroSearchForm";
import {
  fadeIn,
  getVariant,
  HERO_DELAYS,
  staggerContainer,
  staggerItem,
} from "./motion";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";
import { StoreButtons } from "./StoreButtons";

interface HeroSectionProps {
  data: StrapiHomeHero | null | undefined;
}

export function HeroSection({ data }: HeroSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const container_variants = getVariant(staggerContainer, prefersReducedMotion);
  const item_variants = getVariant(staggerItem, prefersReducedMotion);
  const background_variants = getVariant(fadeIn, prefersReducedMotion);

  if (!data) {
    return null;
  }

  const background_image_url = getStrapiMediaUrl(data.backgroundImage?.url);
  if (!background_image_url) {
    return null;
  }

  const title = data.title?.trim() || "";
  const features = data.caracteristicas ?? [];

  return (
    <Hero
      leftContent={
        <motion.div
          className="flex flex-col"
          initial="hidden"
          animate="visible"
          variants={container_variants}
        >
          <div className="flex flex-col px-4 text-white lg:gap-5 2xl:px-14">
            <motion.div
              variants={item_variants}
              transition={{ delay: HERO_DELAYS.title }}
            >
              <HeroTitle>{title}</HeroTitle>
            </motion.div>
            {data.subtitle ? (
              <motion.div variants={item_variants}>
                <HeroDescription>{data.subtitle}</HeroDescription>
              </motion.div>
            ) : null}
            <motion.div variants={item_variants}>
              <HeroFeatures features={features} />
            </motion.div>
          </div>
        </motion.div>
      }
      rightContent={
        <motion.div
          className="flex h-full items-end justify-center"
          initial="hidden"
          animate="visible"
          variants={item_variants}
          transition={{ delay: HERO_DELAYS.search }}
        >
          <HeroSearchForm />
        </motion.div>
      }
      floatingContent={
        <>
          <motion.div
            className="absolute z-10 hidden flex-col gap-1 rounded-s-lg bg-black/50 p-2 lg:top-0 lg:right-0 lg:flex"
            initial="hidden"
            animate="visible"
            variants={item_variants}
            transition={{ delay: HERO_DELAYS.storeButtons }}
          >
            <StoreButtons className="flex flex-col gap-1" />
          </motion.div>
          <HeroBackdrop />
          <motion.div
            className="absolute inset-0 z-0"
            initial="hidden"
            animate="visible"
            variants={background_variants}
            transition={{ delay: HERO_DELAYS.background }}
          >
            <HeroBackgroundCarousel
              images={data.heroImages}
              fallbackUrl={background_image_url}
              title={title}
            />
          </motion.div>
        </>
      }
    />
  );
}
