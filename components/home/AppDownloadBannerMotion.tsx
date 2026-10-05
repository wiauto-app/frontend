"use client";

import Image from "next/image";
import { motion } from "motion/react";

import type { StrapiAppAdvertisment } from "@/interfaces/strapi-components.interface";

import { AppPhoneMockup } from "./AppPhoneMockup";
import { MotionSection, MotionStaggerItem } from "./motion";
import {
  getVariant,
  popIn,
  riseUp,
  slideFromRight,
  staggerContainerExpressive,
} from "./motion/motion-variants";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";
import { SectionContainer } from "./SectionContainer";
import { StoreButtons } from "./StoreButtons";

interface AppDownloadBannerMotionProps {
  data: StrapiAppAdvertisment;
}

export function AppDownloadBannerMotion({ data }: AppDownloadBannerMotionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const bannerVariants = getVariant(popIn, prefersReducedMotion);
  const mockupVariants = getVariant(riseUp, prefersReducedMotion);
  const textStagger = getVariant(staggerContainerExpressive, prefersReducedMotion);
  const textItem = getVariant(slideFromRight, prefersReducedMotion);

  return (
    <SectionContainer className="flex h-auto items-end lg:mt-44">
      <MotionSection variants={bannerVariants} amount={0.2}>
        <div className="dots-background relative w-full rounded-[2rem] bg-primary sm:rounded-[2.5rem]">
          <div className="grid grid-cols-1 px-5 py-10 lg:grid-cols-2">
            <motion.div
              className="flex justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={mockupVariants}
            >
              {data.appMockup?.url ? (
                <Image
                  src={data.appMockup.url}
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
            </motion.div>

            <motion.div
              className="z-10 space-y-4 text-center text-white lg:text-left"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={textStagger}
            >
              {data.phrase ? (
                <MotionStaggerItem variants={textItem}>
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-white uppercase sm:text-xs">
                    {data.phrase}
                  </p>
                </MotionStaggerItem>
              ) : null}
              <MotionStaggerItem variants={textItem}>
                <h2 className="w-full max-w-full text-center text-2xl font-bold text-white lg:max-w-sm lg:text-left lg:text-5xl">
                  {data.title}
                </h2>
              </MotionStaggerItem>
              {data.description ? (
                <MotionStaggerItem variants={textItem}>
                  <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/95 sm:text-base lg:mx-0">
                    {data.description}
                  </p>
                </MotionStaggerItem>
              ) : null}
              <MotionStaggerItem variants={textItem}>
                <StoreButtons
                  soon={true}
                  className="justify-center lg:justify-start"
                />
              </MotionStaggerItem>
            </motion.div>
          </div>
        </div>
      </MotionSection>
    </SectionContainer>
  );
}
