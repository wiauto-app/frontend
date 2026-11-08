"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Loader2, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ImageVisualizerItem {
  id: string;
  src: string;
  alt?: string;
}

export interface ImageVisualizerProps {
  images: ImageVisualizerItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIndex?: number;
  title?: string;
}

interface VisualizerSlideImageProps {
  src: string;
  alt: string;
}

const VisualizerSlideImage = ({ src, alt }: VisualizerSlideImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      {!isLoaded ? (
        <div
          aria-busy="true"
          className="absolute inset-0 z-10 flex items-center justify-center bg-white/5"
        >
          <Loader2
            aria-hidden
            className="size-10 animate-spin text-white/70"
          />
          <span className="sr-only">Cargando imagen</span>
        </div>
      ) : null}
      <Image
        unoptimized
        fill
        src={src}
        alt={alt}
        className={cn(
          "object-contain transition-opacity duration-200",
          isLoaded ? "opacity-100" : "opacity-0",
        )}
        sizes="100vw"
        priority
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export const ImageVisualizer = ({
  images,
  open,
  onOpenChange,
  initialIndex = 0,
  title,
}: ImageVisualizerProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = images.length;
  const hasMultiple = total > 1;
  const safeIndex =
    total === 0 ? 0 : Math.min(Math.max(currentIndex, 0), total - 1);

  const syncIndexFromApi = useCallback(() => {
    if (!api) {
      return;
    }
    setCurrentIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!open || !api || total === 0) {
      return;
    }

    const index = Math.min(Math.max(initialIndex, 0), total - 1);
    api.scrollTo(index, true);
    setCurrentIndex(index);
  }, [api, initialIndex, open, total]);

  useEffect(() => {
    if (!api) {
      return;
    }

    syncIndexFromApi();
    api.on("select", syncIndexFromApi);
    api.on("reInit", syncIndexFromApi);

    return () => {
      api.off("select", syncIndexFromApi);
      api.off("reInit", syncIndexFromApi);
    };
  }, [api, syncIndexFromApi]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "fixed inset-0 top-0 left-0 z-50 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-black p-0 text-white ring-0 sm:max-w-none",
          "data-open:zoom-in-100 data-closed:zoom-out-100",
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">
          {title ?? "Visualizador de imágenes"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Navega entre las imágenes con las flechas, el teclado o deslizando.
        </DialogDescription>

        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <p className="text-sm font-medium text-white/90">
            {total > 0 ? `${safeIndex + 1} / ${total}` : "0 / 0"}
            {title ? (
              <span className="ml-2 hidden text-white/60 sm:inline">
                {title}
              </span>
            ) : null}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={() => onOpenChange(false)}
            aria-label="Cerrar visualizador"
          >
            <XIcon className="size-5" />
          </Button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16 sm:pb-6">
          {total > 0 ? (
            <Carousel
              className="h-full w-full max-w-6xl"
              opts={{ loop: hasMultiple }}
              setApi={setApi}
            >
              <CarouselContent className="ml-0 h-full">
                {images.map((image, index) => (
                  <CarouselItem
                    key={image.id}
                    className="flex h-full basis-full items-center justify-center pl-0"
                  >
                    <VisualizerSlideImage
                      alt={
                        image.alt ??
                        title ??
                        `Imagen ${index + 1} de ${total}`
                      }
                      src={image.src}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {hasMultiple ? (
                <>
                  <CarouselPrevious
                    type="button"
                    variant="ghost"
                    size="icon-lg"
                    className="left-0 top-1/2 z-10 -translate-y-1/2 border-0 bg-transparent text-white shadow-none hover:bg-white/10 hover:text-white disabled:opacity-30 sm:-left-2"
                    aria-label="Imagen anterior"
                  />
                  <CarouselNext
                    type="button"
                    variant="ghost"
                    size="icon-lg"
                    className="right-0 top-1/2 z-10 -translate-y-1/2 border-0 bg-transparent text-white shadow-none hover:bg-white/10 hover:text-white disabled:opacity-30 sm:-right-2"
                    aria-label="Imagen siguiente"
                  />
                </>
              ) : null}
            </Carousel>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
