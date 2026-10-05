"use client";

import { motion } from "motion/react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { ProvinceZoneItem } from "@/lib/locations/buildProvinceZones";

import { MotionHoverCard } from "./motion";
import {
  getVariant,
  staggerContainerExpressive,
  staggerItemPop,
} from "./motion/motion-variants";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";
import { ProvinceZoneCard } from "./ProvinceZoneCard";

interface ProvincesZonesSliderProps {
  provinces: ProvinceZoneItem[];
}

export const ProvincesZonesSlider = ({
  provinces,
}: ProvincesZonesSliderProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerVariants = getVariant(
    staggerContainerExpressive,
    prefersReducedMotion,
  );
  const itemVariants = getVariant(staggerItemPop, prefersReducedMotion);

  return (
    <Carousel
      className="w-full"
      opts={{ align: "start", loop: false, dragFree: true }}
    >
      <div className="relative sm:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <CarouselContent className="-ml-3 sm:-ml-4">
            {provinces.map((province) => (
              <CarouselItem
                key={province.id}
                className="basis-[78%] pl-3 sm:basis-1/2 sm:pl-4 md:basis-1/3 lg:basis-1/4"
              >
                <MotionHoverCard variants={itemVariants} className="h-full">
                  <ProvinceZoneCard province={province} />
                </MotionHoverCard>
              </CarouselItem>
            ))}
          </CarouselContent>
        </motion.div>

        <CarouselPrevious
          aria-label="Ver provincias anteriores"
          className="hidden sm:block left-0 size-9 border-slate-200 bg-white shadow-sm hover:bg-slate-50"
        />
        <CarouselNext
          aria-label="Ver provincias siguientes"
          className="hidden sm:block right-0 size-9 border-slate-200 bg-white shadow-sm hover:bg-slate-50"
        />
      </div>
    </Carousel>
  );
};
