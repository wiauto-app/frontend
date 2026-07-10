"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "motion/react";
import type { Category } from "@/interfaces/vehicle.interface";

import { PopularCategoryCard } from "./PopularCategoryCard";
import { getVariant, staggerContainer, staggerItem } from "./motion";
import { usePrefersReducedMotion } from "./motion/usePrefersReducedMotion";

interface PopularCategoriesSliderProps {
  categories: Category[];
}

export const PopularCategoriesSlider = ({
  categories,
}: PopularCategoriesSliderProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerVariants = getVariant(staggerContainer, prefersReducedMotion);
  const itemVariants = getVariant(staggerItem, prefersReducedMotion);

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
            {categories.map((category) => (
              <CarouselItem
                key={category.id}
                className="basis-[78%] pl-3 sm:basis-1/2 sm:pl-4 md:basis-1/3 lg:basis-1/4"
              >
                <motion.div variants={itemVariants}>
                  <PopularCategoryCard category={category} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </motion.div>

        <CarouselPrevious
          aria-label="Ver categorías anteriores"
          className="left-0 size-9 border-slate-200 bg-white shadow-sm hover:bg-slate-50"
        />
        <CarouselNext
          aria-label="Ver categorías siguientes"
          className="right-0 size-9 border-slate-200 bg-white shadow-sm hover:bg-slate-50"
        />
      </div>
    </Carousel>
  );
};
