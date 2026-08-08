"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useMemo } from "react";

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
  fallbackUrl: string | null;
  title: string;
}

interface HeroSlide {
  id: string;
  image_url: string;
  image_alt: string;
}

const buildSlides = (
  images: StrapiImage[] | null | undefined,
  fallbackUrl: string | null,
  title: string,
): HeroSlide[] => {
  const with_url = (images ?? [])
    .map((image) => {
      const image_url = getStrapiMediaUrl(image.image?.url);
      if (!image_url?.trim()) {
        return null;
      }

      return {
        id: String(image.id),
        image_url,
        image_alt: image.alt?.trim() || title,
        order: image.order,
        active: Boolean(image.active),
      };
    })
    .filter((image): image is NonNullable<typeof image> => image !== null)
    .sort((a, b) => a.order - b.order);

  const active_images = with_url.filter((image) => image.active);
  const source = active_images.length > 0 ? active_images : with_url;

  if (source.length > 0) {
    return source.map((image) => ({
      id: image.id,
      image_url: image.image_url,
      image_alt: image.image_alt,
    }));
  }

  if (fallbackUrl?.trim()) {
    return [
      {
        id: "fallback-background",
        image_url: fallbackUrl,
        image_alt: title,
      },
    ];
  }

  return [];
};

export const HeroBackgroundCarousel = ({
  images,
  fallbackUrl,
  title,
}: HeroBackgroundCarouselProps) => {
  const slides = useMemo(
    () => buildSlides(images, fallbackUrl, title),
    [images, fallbackUrl, title],
  );
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
              src={slide.image_url}
              alt={slide.image_alt}
              fetchPriority={index === 0 ? "high" : "auto"}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              fill
              quality={80}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 960px, 1400px"
              className="object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <HeroBackdrop />
    </Carousel>
  );
};
