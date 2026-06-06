"use client";

import Link from "next/link";
import { useState } from "react";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import type { VehicleImage } from "@/interfaces/vehicle.interface";
import { cn } from "@/lib/utils";
import { getImageUrl } from "../utils";

type VehicleImageCarouselProps = {
  images: VehicleImage[];
  alt: string;
  href: string;
};

const resolveCarouselImageUrl = (image: VehicleImage | undefined): string => {
  if (!image?.url) {
    return "/placeholder-car.jpg";
  }
  return getImageUrl(image.url);
};

export const VehicleImageCarousel = ({
  images,
  alt,
  href,
}: VehicleImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = images.length > 1;
  const safeIndex = images.length > 0 ? Math.min(activeIndex, images.length - 1) : 0;
  const activeImage = images[safeIndex];
  const imageUrl = resolveCarouselImageUrl(activeImage);

  const handlePrevious = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  const handleDotClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex(index);
  };

  return (
    <div className="relative w-full shrink-0 md:w-[320px] lg:w-[380px]">
      <Link
        href={href}
        className="group relative block aspect-[4/3] overflow-hidden bg-slate-100 md:aspect-auto md:h-full md:min-h-[220px]"
        aria-label={`Ver detalle de ${alt}`}
      >
        <img
          src={imageUrl}
          alt={alt}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {images.length > 0 && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-black/45 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Camera className="size-3.5" aria-hidden />
            {images.length}
          </span>
        )}

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </>
        )}
      </Link>

      {hasMultipleImages && (
        <div
          className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5"
          role="tablist"
          aria-label="Indicadores de imágenes"
        >
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              role="tab"
              aria-selected={index === safeIndex}
              aria-label={`Ir a la imagen ${index + 1}`}
              onClick={(event) => handleDotClick(event, index)}
              className={cn(
                "size-2 rounded-full transition-colors",
                index === safeIndex ? "bg-white" : "bg-white/50 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
