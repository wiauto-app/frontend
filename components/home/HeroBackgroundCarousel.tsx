"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import type { HomeHeroData } from "./types/home-page.types";
import { HeroBackdrop } from "../ui/heroBackdrop";

const AUTOPLAY_MS = 5000;

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
  const fromHero = images.filter((image) => image.image_url.trim().length > 0 && image.active);

  if (fromHero.length > 0) {
    return fromHero.map((image) => ({
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
  const slides = buildSlides(images, fallbackUrl, title);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const canAutoplay = slides.length > 1 && !prefersReducedMotion && !isPaused;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!canAutoplay) {
      return;
    }

    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, [canAutoplay, slides.length]);

  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const handleSelect = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-b-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-roledescription="carousel"
      aria-label="Imágenes del hero"
    >
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              isActive ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.image_url}
              alt={isActive ? slide.image_alt : ""}
              fetchPriority={index === 0 ? "high" : "auto"}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              fill
              quality={80}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 960px, 1300px"
              className="object-cover"
              aria-live={isActive ? "polite" : undefined}
            />
          </div>
        );
      })}

      <HeroBackdrop />


    </div>
  );
};
