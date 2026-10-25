"use client";

import { useEffect, useState } from "react";

import {
  APP_DOWNLOAD_BANNER_COOKIE,
  isNativeWiautoApp,
  resolveAppStoreTarget,
  type AppStoreTarget,
} from "@/lib/app-stores";

import { AppDownloadBanner } from "./AppDownloadBanner";

const isBannerDismissed = (): boolean =>
  document.cookie
    .split("; ")
    .some((cookie) => cookie === `${APP_DOWNLOAD_BANNER_COOKIE}=1`);

/** Se resuelve en el cliente: leer cookies/headers en el layout haría dinámicas todas las rutas. */
export const AppDownloadBannerGate = () => {
  const [store, setStore] = useState<AppStoreTarget | null>(null);

  useEffect(() => {
    const userAgent = navigator.userAgent;

    if (isBannerDismissed() || isNativeWiautoApp(userAgent)) {
      return;
    }

    setStore(resolveAppStoreTarget(userAgent));
  }, []);

  if (!store) {
    return null;
  }

  return <AppDownloadBanner store={store} />;
};
