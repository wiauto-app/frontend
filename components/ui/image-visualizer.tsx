"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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

export const ImageVisualizer = ({
  images,
  open,
  onOpenChange,
  initialIndex = 0,
  title,
}: ImageVisualizerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const total = images.length;
  const hasMultiple = total > 1;
  const safeIndex =
    total === 0 ? 0 : Math.min(Math.max(currentIndex, 0), total - 1);
  const currentImage = total > 0 ? images[safeIndex] : undefined;

  useEffect(() => {
    if (!open) {
      return;
    }

    setCurrentIndex(
      total === 0 ? 0 : Math.min(Math.max(initialIndex, 0), total - 1),
    );
  }, [open, initialIndex, total]);

  useEffect(() => {
    if (!open || !hasMultiple) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setCurrentIndex((index) => (index - 1 + total) % total);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setCurrentIndex((index) => (index + 1) % total);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, hasMultiple, total]);

  const handlePrevious = () => {
    if (!hasMultiple) {
      return;
    }
    setCurrentIndex((index) => (index - 1 + total) % total);
  };

  const handleNext = () => {
    if (!hasMultiple) {
      return;
    }
    setCurrentIndex((index) => (index + 1) % total);
  };

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
          Navega entre las imágenes con las flechas o el teclado.
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

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 sm:px-16">
          {currentImage ? (
            <div className="relative h-full w-full max-w-6xl">
              <Image
                unoptimized
                fill
                src={currentImage.src}
                alt={
                  currentImage.alt ??
                  title ??
                  `Imagen ${safeIndex + 1} de ${total}`
                }
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          ) : null}

          {hasMultiple ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white sm:left-4"
                onClick={handlePrevious}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="size-8" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-lg"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white sm:right-4"
                onClick={handleNext}
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="size-8" />
              </Button>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
