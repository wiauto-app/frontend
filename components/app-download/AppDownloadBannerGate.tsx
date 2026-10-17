import { cookies, headers } from "next/headers";

import {
  APP_DOWNLOAD_BANNER_COOKIE,
  isNativeWiautoApp,
  resolveAppStoreTarget,
} from "@/lib/app-stores";

import { AppDownloadBanner } from "./AppDownloadBanner";

export const AppDownloadBannerGate = async () => {
  const cookieStore = await cookies();
  const isDismissed =
    cookieStore.get(APP_DOWNLOAD_BANNER_COOKIE)?.value === "1";

  if (isDismissed) {
    return null;
  }

  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent") ?? "";

  if (isNativeWiautoApp(userAgent)) {
    return null;
  }

  return <AppDownloadBanner store={resolveAppStoreTarget(userAgent)} />;
};
