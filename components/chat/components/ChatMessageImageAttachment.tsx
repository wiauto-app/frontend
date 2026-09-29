"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ChatMessageImageAttachmentProps {
  src: string;
  alt: string;
  caption?: string | null;
}

export const ChatMessageImageAttachment = ({
  src,
  alt,
  caption,
}: ChatMessageImageAttachmentProps) => {
  const [open, setOpen] = useState(false);
  const trimmedCaption = caption?.trim() || null;

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Ver imagen ampliada"
        className="block max-w-full cursor-zoom-in overflow-hidden rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={handleOpen}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-64 max-w-full rounded-md object-cover"
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/90 supports-backdrop-filter:backdrop-blur-none" />
          <DialogPrimitive.Popup
            className={cn(
              "fixed top-1/2 left-1/2 z-50 flex w-full max-w-[min(100vw-2rem,1200px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 border-0 bg-transparent p-4 shadow-none outline-none ring-0 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
            )}
          >
            <DialogTitle className="sr-only">Imagen ampliada</DialogTitle>
            <img
              src={src}
              alt={alt}
              className="max-h-[85vh] w-full object-contain"
            />
            {trimmedCaption ? (
              <DialogDescription className="max-w-full text-center text-sm text-white/80">
                {trimmedCaption}
              </DialogDescription>
            ) : null}
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-white/60 underline underline-offset-2 hover:text-white/80"
            >
              Abrir en nueva pestaña
            </a>
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-2 right-2 text-white hover:bg-white/10 hover:text-white"
                  aria-label="Cerrar visor de imagen"
                />
              }
            >
              <XIcon aria-hidden />
              <span className="sr-only">Cerrar</span>
            </DialogClose>
          </DialogPrimitive.Popup>
        </DialogPortal>
      </Dialog>
    </>
  );
};
