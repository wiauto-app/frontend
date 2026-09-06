"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Camera } from "lucide-react";

import { getImageUrl } from "@/app/(public)/vehiculos/utils";
import {
  ImageVisualizer,
  type ImageVisualizerItem,
} from "@/components/ui/image-visualizer";
import type { VehicleImage } from "@/interfaces/vehicle.interface";
import { cn } from "@/lib/utils";

interface VehicleDetailGalleryProps {
  images: VehicleImage[];
  title: string;
}

const PLACEHOLDER_IMAGE: VehicleImage = {
  id: "placeholder",
  url: "/placeholder-car.webp",
  order: 0,
};

const ASIDE_LIMIT = 3;

export const VehicleDetailGallery = ({
  images,
  title,
}: VehicleDetailGalleryProps) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const galleryImages = useMemo(
    () => (images.length > 0 ? images : [PLACEHOLDER_IMAGE]),
    [images],
  );
  const totalImages = galleryImages.length;
  const mainImage = galleryImages[0];
  const asideImages = galleryImages.slice(1, 1 + ASIDE_LIMIT);
  const extraCount = Math.max(0, totalImages - (1 + ASIDE_LIMIT));
  const hasAside = asideImages.length > 0;

  const visualizerImages = useMemo<ImageVisualizerItem[]>(
    () =>
      galleryImages.map((image, index) => ({
        id: image.id,
        src: getImageUrl(image.url),
        alt: `${title} - imagen ${index + 1}`,
      })),
    [galleryImages, title],
  );

  const handleOpenViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-2 overflow-hidden lg:flex-row">
        <button
          type="button"
          className="relative h-140 min-w-0 flex-1 cursor-pointer overflow-hidden rounded-s-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          onClick={() => handleOpenViewer(0)}
          aria-label={`Ver imagen principal de ${title}`}
        >
          <Image
            unoptimized
            fill
            src={getImageUrl(mainImage.url)}
            alt={`${title} - imagen 1`}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
          <span className="pointer-events-none absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Camera className="size-3.5" aria-hidden />
            {totalImages}
          </span>
        </button>

        {hasAside ? (
          <div className="w-full lg:h-140 lg:w-64">
            <div
              className={cn(
                "grid h-full gap-2",
                "grid-cols-3 lg:grid-cols-1 lg:grid-rows-3",
              )}
              role="list"
              aria-label="Miniaturas de imágenes"
            >
              {asideImages.map((image, asideIndex) => {
                const galleryIndex = asideIndex + 1;
                const isLastAside = asideIndex === asideImages.length - 1;
                const showExtraOverlay = isLastAside && extraCount > 0;

                return (
                  <button
                    key={image.id}
                    type="button"
                    className={cn(
                      "relative min-h-24 min-w-0 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 lg:min-h-0",
                      asideIndex === 0 && "lg:rounded-tr-2xl",
                      isLastAside && "lg:rounded-br-2xl",
                    )}
                    onClick={() => handleOpenViewer(galleryIndex)}
                    aria-label={
                      showExtraOverlay
                        ? `Ver ${extraCount} imágenes más`
                        : `Ver imagen ${galleryIndex + 1}`
                    }
                  >
                    <Image
                      unoptimized
                      fill
                      src={getImageUrl(image.url)}
                      alt={`${title} - miniatura ${galleryIndex + 1}`}
                      className="object-cover"
                      sizes="256px"
                    />
                    {showExtraOverlay ? (
                      <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-black/55 text-white">
                        <span className="text-lg font-semibold leading-none">
                          +{extraCount}
                        </span>
                        <span className="text-xs font-medium">Ver más</span>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <ImageVisualizer
        images={visualizerImages}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        initialIndex={viewerIndex}
        title={title}
      />
    </>
  );
};
