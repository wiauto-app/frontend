"use client";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { StrapiAppAdvertisment } from "@/interfaces/strapi-components.interface";

const AppDownloadBanner = dynamic(
  () => import("../AppDownloadBanner").then((mod) => mod.AppDownloadBanner),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-91 lg:h-56" />,
  },
);

export const LazyAppDownloadBanner = ({ data }: { data: StrapiAppAdvertisment }) => {
  return <AppDownloadBanner data={data} />;
};
