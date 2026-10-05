"use client";

import { motion } from "motion/react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { DealershipListItem } from "@/services/dealerships/types/dealership.types";

import { MotionHoverCard } from "./motion";
import {
  getVariant,
  staggerContainerExpressive,
  staggerItemPop,
} from "./motion/motion-variants";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";
import { TopDealershipCard } from "./TopDealershipCard";

interface TopDealershipsSliderProps {
  dealerships: DealershipListItem[];
}

export const TopDealershipsSlider = ({
  dealerships,
}: TopDealershipsSliderProps) => {
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
      <div className="relative px-10 sm:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <CarouselContent className="-ml-3 sm:-ml-4">
            {dealerships.map((dealership) => (
              <CarouselItem
                key={dealership.id}
                className="basis-[78%] pl-3 sm:basis-1/2 sm:pl-4 md:basis-1/3 lg:basis-1/4"
              >
                <MotionHoverCard variants={itemVariants} className="h-full">
                  <TopDealershipCard dealership={dealership} />
                </MotionHoverCard>
              </CarouselItem>
            ))}
          </CarouselContent>
        </motion.div>

        <CarouselPrevious
          aria-label="Ver concesionarios anteriores"
          className="left-0 size-9 border-slate-200 bg-white shadow-sm hover:bg-slate-50"
        />
        <CarouselNext
          aria-label="Ver concesionarios siguientes"
          className="right-0 size-9 border-slate-200 bg-white shadow-sm hover:bg-slate-50"
        />
      </div>
    </Carousel>
  );
};
