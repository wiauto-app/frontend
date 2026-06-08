"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { getImageUrl } from "@/app/(public)/vehiculos/utils";
import type { VehicleImage } from "@/interfaces/vehicle.interface";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type VehicleDetailGalleryProps = {
  images: VehicleImage[];
  title: string;
  condition_label: string;
};

const PLACEHOLDER_IMAGE: VehicleImage = {
  id: "placeholder",
  url: "/placeholder-car.jpg",
};

export const VehicleDetailGallery = ({
  images,
  title,
  condition_label,
}: VehicleDetailGalleryProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const gallery_images = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
  const has_multiple_images = gallery_images.length > 1;
  const total_images = gallery_images.length;
  const progress_width = ((selectedIndex + 1) / total_images) * 100;

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    handleSelect();
    api.on("select", handleSelect);
    api.on("reInit", handleSelect);

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api]);

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white">
      <Carousel
        className="w-full"
        opts={{ loop: has_multiple_images }}
        setApi={setApi}
      >
        <div className="relative aspect-4/3 bg-gray-100">
          <CarouselContent className="ml-0 h-full">
            {gallery_images.map((image, index) => (
              <CarouselItem key={image.id} className="basis-full pl-0">
                <div className="relative aspect-4/3 w-full">
                  <Image
                    unoptimized
                    fill
                    src={getImageUrl(image.url)}
                    alt={`${title} - imagen ${index + 1}`}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {condition_label ? (
            <div className="pointer-events-none absolute left-0 top-0 z-10 size-20 overflow-hidden">
              <span className="absolute left-[-30px] top-[18px] block w-36 -rotate-45 bg-blue-600 py-1 text-center text-[10px] font-bold uppercase tracking-wide text-white">
                {condition_label}
              </span>
            </div>
          ) : null}

          <span className="pointer-events-none absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Camera className="size-3.5" aria-hidden />
            {total_images}
          </span>
        </div>
      </Carousel>

      {has_multiple_images ? (
        <>
          <div
            className="h-1 w-full bg-gray-200"
            role="progressbar"
            aria-valuenow={selectedIndex + 1}
            aria-valuemin={1}
            aria-valuemax={total_images}
            aria-label={`Imagen ${selectedIndex + 1} de ${total_images}`}
          >
            <div
              className="h-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progress_width}%` }}
            />
          </div>

          <div
            className="flex gap-2 p-2"
            role="tablist"
            aria-label="Miniaturas de imágenes"
          >
            {gallery_images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Ver imagen ${index + 1}`}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "relative aspect-4/3 min-w-0 flex-1 overflow-hidden rounded-lg",
                  index === selectedIndex
                    ? "border-2 border-blue-600"
                    : "border-2 border-transparent",
                )}
              >
                <Image
                  unoptimized
                  fill
                  src={getImageUrl(image.url)}
                  alt={`${title} - miniatura ${index + 1}`}
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};
