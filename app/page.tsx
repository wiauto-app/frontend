import type { Metadata } from "next";
import {
  AppDownloadBanner,
  BlogArticlesSection,
  FeaturedVehiclesSection,
  HeroSection,
  CarTypesSection,
  PopularCategoriesGrid,
  ProcessSection,
  RelatedNewsSection,
  ValuePropositionSection,
} from "@/components/home";
import { getHomeData } from "@/components/home/services/homeService";
import { Suspense } from "react";
import { VehiclesSuggestions } from "@/components/home/vehiclesSuggestions";
import { VehicleExtraServices } from "@/components/home/vehicleExtraServices";
import { EXTRA_SERVICES_DATA, EXTRA_SERVICES_DATA_2 } from "@/components/home/constants/extraServices.constants";

export const generateMetadata = async (): Promise<Metadata> => {
  const home_data = await getHomeData();

  return {
    title: home_data.seo.meta_title,
    description: home_data.seo.meta_description,
    keywords: home_data.seo.keywords ?? undefined,
    alternates: home_data.seo.canonical_url
      ? { canonical: home_data.seo.canonical_url }
      : undefined,
    robots: home_data.seo.no_index
      ? { index: false, follow: false }
      : undefined,
    openGraph: {
      title: home_data.seo.meta_title,
      description: home_data.seo.meta_description,
      images: home_data.seo.share_image_url
        ? [{ url: home_data.seo.share_image_url }]
        : undefined,
    },
  };
};

export default async function Home() {
  const home_data = await getHomeData();

  return (
    <>
      <div className="container-custom flex flex-col gap-10">
        <div className="bg-muted-foreground/10 rounded-xl">
          <HeroSection data={home_data.hero} />
          <VehicleExtraServices data={EXTRA_SERVICES_DATA} />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <PopularCategoriesGrid />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <VehiclesSuggestions />
        </Suspense>
        <VehicleExtraServices data={EXTRA_SERVICES_DATA_2} />

        {/* <CarTypesSection />
        <FeaturedVehiclesSection />
        <AppDownloadBanner data={home_data.app_advertisement} />
        <ValuePropositionSection data={home_data.features} />
        <BlogArticlesSection />
        <RelatedNewsSection />
        <ProcessSection data={home_data.process_section} /> */}
      </div>
    </>
  );
}
