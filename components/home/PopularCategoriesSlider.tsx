"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Category } from "@/interfaces/vehicle.interface";

import { PopularCategoryCard } from "./PopularCategoryCard";

interface PopularCategoriesSliderProps {
  categories: Category[];
}

export const PopularCategoriesSlider = ({
  categories,
}: PopularCategoriesSliderProps) => {

  return (
    <Carousel
      className="w-full"
      opts={{ align: "start", loop: false, dragFree: true }}
    >
      <div className="relative px-10 sm:px-12">
        <CarouselContent className="-ml-3 sm:-ml-4">
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="basis-[78%] pl-3 sm:basis-1/2 sm:pl-4 md:basis-1/3 lg:basis-1/4"
            >
              <PopularCategoryCard category={category} />
            </CarouselItem>
          ))}
        </CarouselContent>

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
