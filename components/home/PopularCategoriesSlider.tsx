"use client";

import { motion } from "motion/react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Category } from "@/interfaces/vehicle.interface";

import { MotionHoverCard } from "./motion";
import {
  getVariant,
  staggerContainerExpressive,
  staggerItemPop,
} from "./motion/motion-variants";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";
import { PopularCategoryCard } from "./PopularCategoryCard";

interface PopularCategoriesSliderProps {
  categories: Category[];
}

export const PopularCategoriesSlider = ({
  categories,
}: PopularCategoriesSliderProps) => {
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
            {categories.map((category) => (
              <CarouselItem
                key={category.id}
                className="basis-[78%] pl-3 sm:basis-1/2 sm:pl-4 md:basis-1/3 lg:basis-1/4"
              >
                <MotionHoverCard variants={itemVariants} className="h-full">
                  <PopularCategoryCard category={category} />
                </MotionHoverCard>
              </CarouselItem>
            ))}
          </CarouselContent>
        </motion.div>

        <CarouselPrevious
          aria-label="Ver categorías anteriores"
          className="hidden sm:block left-0 size-9 border-slate-200 bg-white shadow-sm hover:bg-slate-50"
        />
        <CarouselNext
          aria-label="Ver categorías siguientes"
          className="hidden sm:block right-0 size-9 border-slate-200 bg-white shadow-sm hover:bg-slate-50"
        />
      </div>
    </Carousel>
  );
};
