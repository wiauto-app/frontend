"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import { usePrefersReducedMotion } from "@/components/home/motion/usePrefersReducedMotion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import type { StrapiImage } from "@/interfaces/strapi-components.interface";
import { getStrapiMediaUrl } from "@/lib/strapi-media";

const AUTOPLAY_MS = 5000;

interface HeroBackgroundCarouselProps {
  images: StrapiImage[] | null | undefined;
}

export const HeroBackgroundCarousel = ({
  images,
}: HeroBackgroundCarouselProps) => {
  const slides =
    images
      ?.map((image) => ({
        id: image.id,
        image_url: getStrapiMediaUrl(image.image?.url),
        image_alt: image.alt ?? "",
        active: image.active,
      }))
      .filter((slide) => slide.active) ?? [];
  const prefersReducedMotion = usePrefersReducedMotion();

  if (slides.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        loop: slides.length > 1,
        align: "start",
        duration: prefersReducedMotion ? 0 : 25,
      }}
      plugins={[
        Autoplay({
          delay: AUTOPLAY_MS,
          stopOnInteraction: false,
          stopOnMouseEnter: false,
        }),
      ]}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden rounded-b-lg [&_[data-slot=carousel-content]]:h-full [&_[data-slot=carousel-content]>div]:h-full"
      aria-label="Imágenes del hero"
    >

      <CarouselContent className="ml-0 h-full">
        {slides.map((slide, index) => (
          <CarouselItem
            key={slide.id}
            className="relative h-full basis-full pl-0"
          >
            <Image
              src={slide.image_url ?? ""}
              alt={slide.image_alt}
              fetchPriority={index === 0 ? "high" : "auto"}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              fill
              quality={50}
              sizes="(max-width: 639px) 90vw, (max-width: 767px) 619px, (max-width: 1023px) 727px, (max-width: 1279px) 835px, 961px"
              className="object-cover brightness-[0.65]"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
