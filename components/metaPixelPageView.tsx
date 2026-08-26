"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

/** Dispara PageView en navegaciones del App Router (evita duplicar el del script inicial). */
export const MetaPixelPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const is_first_render = useRef(true);

  useEffect(() => {
    if (is_first_render.current) {
      is_first_render.current = false;
      return;
    }

    window.fbq?.("track", "PageView");
  }, [pathname, searchParams]);

  return null;
};
