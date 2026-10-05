import type { StrapiAppAdvertisment } from "@/interfaces/strapi-components.interface";

import { AppDownloadBannerMotion } from "./AppDownloadBannerMotion";

interface AppDownloadBannerProps {
  data: StrapiAppAdvertisment;
}

export function AppDownloadBanner({ data }: AppDownloadBannerProps) {
  return <AppDownloadBannerMotion data={data} />;
}
