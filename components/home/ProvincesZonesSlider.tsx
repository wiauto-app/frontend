"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { ProvinceZoneItem } from "@/lib/locations/buildProvinceZones";

import { ProvinceZoneCard } from "./ProvinceZoneCard";

interface ProvincesZonesSliderProps {
  provinces: ProvinceZoneItem[];
}

export const ProvincesZonesSlider = ({
  provinces,
}: ProvincesZonesSliderProps) => {

  return (
    <Carousel
      className="w-full"
      opts={{ align: "start", loop: false, dragFree: true }}
    >
      <div className="relative px-10 sm:px-12">
        <CarouselContent className="-ml-3 sm:-ml-4">
          {provinces.map((province) => (
            <CarouselItem
              key={province.id}
              className="basis-[78%] pl-3 sm:basis-1/2 sm:pl-4 md:basis-1/3 lg:basis-1/4"
            >
              <ProvinceZoneCard province={province} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          aria-label="Ver provincias anteriores"
          className="left-0 size-9 border-slate-200 bg-white shadow-sm hover:bg-slate-50"
        />
        <CarouselNext
          aria-label="Ver provincias siguientes"
          className="right-0 size-9 border-slate-200 bg-white shadow-sm hover:bg-slate-50"
        />
      </div>
    </Carousel>
  );
};
