"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { isFocusedFlowPath } from "@/lib/focusedFlowRoutes";

import {
  isNativeWiautoApp,
  resolveAppStoreTarget,
  type AppStoreTarget,
} from "@/lib/app-stores";

import { AppDownloadBanner } from "./AppDownloadBanner";
import { useAppDownloadBannerStore } from "./stores/appDownloadBannerStore";

/** Se resuelve en el cliente: leer cookies/headers en el layout haría dinámicas todas las rutas. */
export const AppDownloadBannerGate = () => {
  const pathname = usePathname();
  const isDismissed = useAppDownloadBannerStore((state) => state.isDismissed);
  const [store, setStore] = useState<AppStoreTarget | null>(null);

  useEffect(() => {
    const userAgent = navigator.userAgent;

    if (isNativeWiautoApp(userAgent)) {
      return;
    }

    setStore(resolveAppStoreTarget(userAgent));
  }, []);

  if (!store || isDismissed || isFocusedFlowPath(pathname)) {
    return null;
  }

  return <AppDownloadBanner store={store} />;
};
