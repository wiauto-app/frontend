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

import type { HomeHeroData } from "./types/home-page.types";

const AUTOPLAY_MS = 100;

interface HeroBackgroundCarouselProps {
  images: HomeHeroData["hero_images"];
  fallbackUrl: string | null;
  title: string;
}

interface HeroSlide {
  id: string;
  image_url: string;
  image_alt: string;
}

const buildSlides = (
  images: HomeHeroData["hero_images"],
  fallbackUrl: string | null,
  title: string,
): HeroSlide[] => {
  const withUrl = images
    .filter((image) => image.image_url.trim().length > 0)
    .slice()
    .sort((a, b) => a.order - b.order);

  const activeImages = withUrl.filter((image) => image.active);
  const source = activeImages.length > 0 ? activeImages : withUrl;

  if (source.length > 0) {
    return source.map((image) => ({
      id: image.id,
      image_url: image.image_url,
      image_alt: image.image_alt || title,
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

  const autoplayPlugin = useMemo(() => {
    if (slides.length <= 1 || prefersReducedMotion) {
      return undefined;
    }

    return Autoplay({
      delay: AUTOPLAY_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    });
  }, [prefersReducedMotion, slides.length]);

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
      plugins={autoplayPlugin ? [autoplayPlugin] : undefined}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden rounded-b-lg [&_[data-slot=carousel-content]]:h-full [&_[data-slot=carousel-content]>div]:h-full"
      aria-label="Imágenes del hero"
    >
      <CarouselContent className="ml-0 h-full">
        {slides.map((slide, index) => (
          <CarouselItem key={slide.id} className="relative h-full basis-full pl-0">
            <Image
              src={slide.image_url}
              alt={slide.image_alt}
              fetchPriority={index === 0 ? "high" : "auto"}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              fill
              quality={80}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 960px, 1300px"
              className="object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <HeroBackdrop />
    </Carousel>
  );
};
