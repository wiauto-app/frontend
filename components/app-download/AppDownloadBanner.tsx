"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  dismissAppDownloadBannerCookie,
  type AppStoreTarget,
} from "@/lib/app-stores";
import { LOGOS } from "@/lib/logos";
import { cn } from "@/lib/utils";

interface AppDownloadBannerProps {
  store: AppStoreTarget;
}

export const AppDownloadBanner = ({ store }: AppDownloadBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    document.cookie = dismissAppDownloadBannerCookie();
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="border-b border-white/10 bg-primary-dark text-white"
      role="region"
      aria-label="Descarga la aplicación móvil de WiAuto"
    >
      <div className="container-custom mx-auto flex h-11 items-center gap-2.5 px-4 sm:px-6 lg:px-8">
        <Image
          src={LOGOS.normal.white}
          alt="WiAuto"
          width={88}
          height={22}
          className="h-5 w-auto shrink-0 object-contain sm:h-[22px]"
        />
        <p className="min-w-0 flex-1 truncate text-[13px] leading-tight font-medium tracking-[-0.02em] sm:text-sm">
          Descarga la app
          <span className="hidden text-white/75 sm:inline">
            {" "}
            · Disponible en {store.storeName}
          </span>
        </p>
        <a
          href={store.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={store.ctaAriaLabel}
          className={cn(
            "inline-flex h-7 shrink-0 items-center rounded-md bg-white px-2.5 text-xs font-semibold text-primary-dark",
            "transition-opacity hover:opacity-90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-dark",
          )}
        >
          {store.ctaLabel}
        </a>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={handleDismiss}
          aria-label="Cerrar anuncio de la app"
          className="size-7 shrink-0 text-white hover:bg-white/10 hover:text-white"
        >
          <X />
        </Button>
      </div>
    </div>
  );
};
