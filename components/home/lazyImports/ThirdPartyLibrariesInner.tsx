"use client";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

import { ConsentModeScript } from "@/components/consent/consentModeScript";
import { MetaPixel } from "@/components/metaPixel";
import {
  GOOGLE_ANALYTICS_ID,
  GOOGLE_TAG_MANAGER_ID,
} from "@/constants/external.constant";

/** Un solo chunk: el orden en el árbol garantiza consent antes que GA/GTM/Meta. */
export const ThirdPartyLibrariesInner = () => {
  return (
    <>
      <ConsentModeScript />
      <MetaPixel />
      {/* Quitar GoogleAnalytics cuando G-D44GZQL4B2 esté publicado en GTM-PH39KM9H. */}
      {GOOGLE_ANALYTICS_ID ? (
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
      ) : null}
      {GOOGLE_TAG_MANAGER_ID ? (
        <GoogleTagManager gtmId={GOOGLE_TAG_MANAGER_ID} />
      ) : null}
    </>
  );
};
