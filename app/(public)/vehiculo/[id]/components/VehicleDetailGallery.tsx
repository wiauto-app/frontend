"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Camera, Play } from "lucide-react";

import { getImageUrl } from "@/app/(public)/vehiculos/utils";
import {
  ImageVisualizer,
  type ImageVisualizerItem,
} from "@/components/ui/image-visualizer";
import type {
  VehicleImage,
  VehicleVideo,
} from "@/interfaces/vehicle.interface";
import { getVehicleImageTransitionName } from "@/components/view-transitions/vehicle-image-transition-name";
import { cn } from "@/lib/utils";
import {
  NO_VEHICLE_IMAGE_SRC,
  isNoVehicleImageFileKey,
} from "@/lib/vehicles/no-vehicle-image";
import { ViewTransition } from "react";

interface VehicleDetailGalleryProps {
  images: VehicleImage[];
  /** Solo se reproducen los que traen `url` (estado `ready`). */
  videos?: VehicleVideo[];
  title: string;
  vehicleId: string;
  /** Desactivar si esta galería convive montada con la tarjeta de origen. */
  shareImageTransition?: boolean;
}

const PLACEHOLDER_IMAGE: VehicleImage = {
  id: "placeholder",
  url: NO_VEHICLE_IMAGE_SRC,
  order: 0,
};

const vehicleImageObjectClass = (url: string) =>
  isNoVehicleImageFileKey(url) ? "object-contain" : "object-cover";

const ASIDE_LIMIT = 3;

const formatDuration = (seconds: number | null) => {
  if (seconds === null || !Number.isFinite(seconds)) return null;
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

type PlayableVideo = VehicleVideo & { url: string };

const MAIN_IMAGE_SIZES = `
  (max-width: 1023px) calc(100vw - 2rem),
  (max-width: 1279px) 520px,
  (max-width: 1535px) 680px,
  760px
`;

export const VehicleDetailGallery = ({
  images,
  videos,
  title,
  vehicleId,
  shareImageTransition = true,
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

  const playableVideos = useMemo<PlayableVideo[]>(
    () =>
      (videos ?? [])
        .filter((video): video is PlayableVideo => Boolean(video.url))
        .sort((a, b) => a.order - b.order),
    [videos],
  );
  const firstVideoIndex = galleryImages.length;

  const visualizerImages = useMemo<ImageVisualizerItem[]>(
    () => [
      ...galleryImages.map((image, index) => ({
        id: image.id,
        src: getImageUrl(image.url),
        alt: `${title} - imagen ${index + 1}`,
      })),
      ...playableVideos.map((video, index) => ({
        id: `video-${video.id}`,
        kind: "video" as const,
        src: getImageUrl(video.url),
        poster: video.thumbnail_url
          ? getImageUrl(video.thumbnail_url)
          : undefined,
        alt: `${title} - vídeo ${index + 1}`,
      })),
    ],
    [galleryImages, playableVideos, title],
  );

  const handleOpenViewer = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-2 overflow-hidden lg:flex-row lg:items-stretch">
        <button
          type="button"
          className="relative block aspect-[4/3] w-full min-h-[220px] min-w-0 flex-1 cursor-pointer overflow-hidden rounded-2xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 lg:aspect-auto lg:h-140 lg:min-h-0 lg:rounded-s-2xl lg:rounded-e-none"
          onClick={() => handleOpenViewer(0)}
          aria-label={`Ver imagen principal de ${title}`}
        >
          {shareImageTransition ? (
            <ViewTransition
              name={getVehicleImageTransitionName(vehicleId)}
              share="morph"
              default="none"
            >
              <span className="absolute inset-0 block">
                <Image
                  fill
                  src={getImageUrl(mainImage.url)}
                  alt={`${title} - imagen 1`}
                  className={vehicleImageObjectClass(mainImage.url)}
                  sizes={MAIN_IMAGE_SIZES}
                  fetchPriority="high"
                  quality={70}
                  priority
                />
              </span>
            </ViewTransition>
          ) : (
            <Image
              fill
              src={getImageUrl(mainImage.url)}
              alt={`${title} - imagen 1`}
              className={vehicleImageObjectClass(mainImage.url)}
              sizes={MAIN_IMAGE_SIZES}
              quality={70}
              priority
            />
          )}

          <span className="pointer-events-none absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Camera className="size-3.5" aria-hidden />
            {totalImages}
          </span>
        </button>

        {hasAside ? (
          <div className="w-full shrink-0 lg:h-140 lg:w-64">
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
                      "relative min-h-24 min-w-0 cursor-pointer overflow-hidden rounded-xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 lg:min-h-0 lg:rounded-none",
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
                      fill
                      src={getImageUrl(image.url)}
                      alt={`${title} - miniatura ${galleryIndex + 1}`}
                      className={vehicleImageObjectClass(image.url)}
                      sizes="
    (max-width: 1023px) calc((100vw - 3rem) / 3),
    256px
  "
                      quality={60}
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

      {playableVideos.length > 0 ? (
        <div
          className="mt-2 flex gap-2 overflow-x-auto"
          role="list"
          aria-label="Vídeos del vehículo"
        >
          {playableVideos.map((video, videoIndex) => {
            const duration = formatDuration(video.duration_s);
            return (
              <button
                key={video.id}
                type="button"
                role="listitem"
                className="relative aspect-video w-40 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                onClick={() => handleOpenViewer(firstVideoIndex + videoIndex)}
                aria-label={`Reproducir vídeo ${videoIndex + 1}${duration ? ` (${duration})` : ""}`}
              >
                {video.thumbnail_url ? (
                  <Image
                    fill
                    src={getImageUrl(video.thumbnail_url)}
                    alt=""
                    className="object-cover opacity-90"
                    sizes="160px"
                    quality={60}
                  />
                ) : null}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-10 items-center justify-center rounded-full bg-black/60 text-white">
                    <Play className="size-5 fill-current" aria-hidden />
                  </span>
                </span>
                {duration ? (
                  <span className="absolute right-1.5 bottom-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
                    {duration}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

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
