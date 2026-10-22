"use client";

import { Suspense } from "react";

import { MetaPixelPageView } from "@/components/metaPixelPageView";
import { META_PIXEL_ID } from "@/constants";

/**
 * El SDK de Meta (`fbevents.js`, ~116 KiB) solo se descarga cuando
 * `applyConsent` recibe marketing = true (ver `lib/analytics/consent.ts`).
 */
export const MetaPixel = () => {
  if (!META_PIXEL_ID) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <MetaPixelPageView />
    </Suspense>
  );
};
