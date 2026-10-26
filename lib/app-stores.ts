export const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ??
  "https://play.google.com/store/apps/details?id=com.faux.wiauto";

export const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APPLE_APP_STORE_URL ??
  "https://apps.apple.com/es/search?term=WiAuto";

export type AppStoreKind = "app_store" | "play_store";

export interface AppStoreTarget {
  kind: AppStoreKind;
  href: string;
  storeName: string;
  ctaLabel: string;
  ctaAriaLabel: string;
}

const APP_STORE_TARGET: AppStoreTarget = {
  kind: "app_store",
  href: APP_STORE_URL,
  storeName: "App Store",
  ctaLabel: "Descargar",
  ctaAriaLabel: "Descargar WiAuto en la App Store",
};

const PLAY_STORE_TARGET: AppStoreTarget = {
  kind: "play_store",
  href: PLAY_STORE_URL,
  storeName: "Google Play",
  ctaLabel: "Descargar",
  ctaAriaLabel: "Descargar WiAuto en Google Play",
};

export const isNativeWiautoApp = (userAgent: string): boolean => {
  const ua = userAgent.toLowerCase();
  return ua.includes("wiauto/") || ua.includes("expo/");
};

export const resolveAppStoreTarget = (userAgent: string): AppStoreTarget => {
  const ua = userAgent.toLowerCase();
  const isAppleMobile = /iphone|ipad|ipod/.test(ua);
  const isMacDesktop = /macintosh|mac os x/.test(ua) && !isAppleMobile;

  if (isAppleMobile || isMacDesktop) {
    return APP_STORE_TARGET;
  }

  return PLAY_STORE_TARGET;
};
