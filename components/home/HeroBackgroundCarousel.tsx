"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import type { HomeHeroData } from "./types/home-page.types";

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
  console.log(images);
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
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
              aria-live={isActive ? "polite" : undefined}
            />
          </div>
        );
      })}

      {/* Oscuro a la izquierda → más claro a la derecha, para legibilidad del texto */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#0a193c]/82 via-[#0a193c]/10 to-[#0a193c]/0"
        aria-hidden
      />

      {slides.length > 1 ? (
        <div
          className="absolute right-4 bottom-28 z-10 flex items-center gap-2 sm:right-40 sm:bottom-5"
          role="tablist"
          aria-label="Seleccionar imagen del hero"
        >
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Imagen ${index + 1} de ${slides.length}`}
                tabIndex={0}
                onClick={() => handleSelect(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSelect(index);
                  }
                }}
                className={cn(
                  "h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
                  isActive
                    ? "w-6 bg-white"
                    : "w-2.5 bg-white/45 hover:bg-white/70",
                )}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
