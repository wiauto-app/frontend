import type { Metadata } from "next";
import {
  AppDownloadBanner,
  HeroSection,
  PopularCategoriesGrid,
  RelatedNewsSection,
} from "@/components/home";
import { getHomeData } from "@/components/home/services/homeService";
import { Suspense } from "react";
import { VehiclesSuggestions } from "@/components/home/vehiclesSuggestions";
import { VehicleExtraServices } from "@/components/home/vehicleExtraServices";
import {
  EXTRA_SERVICES_DATA,
  EXTRA_SERVICES_DATA_2,
} from "@/components/home/constants/extraServices.constants";
import { ToolsAccess } from "@/components/home/toolsAccess";
import { Zones } from "@/components/home/zones";
import { ToolsShortcuts } from "@/components/home/toolsShortcuts";
import { TopDealerships } from "@/components/home/topDealerships";
import {
  VehicleDiscoverySection,
  VehicleDiscoverySectionSkeleton,
} from "@/components/discovery";
import { mapLowEmissionsLinkToQuickLink } from "@/components/discovery/mappers/map-low-emissions-link-to-quick-link";
import { SearchForm } from "@/components/home/searchForm";

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
  const lowEmissionsQuickLinks =
    home_data.low_emissions.links.length > 0
      ? home_data.low_emissions.links.map(mapLowEmissionsLinkToQuickLink)
      : undefined;

  return (
    <>
      <div className="container-custom flex flex-col gap-12">
        <HeroSection data={home_data.hero} />
        <SearchForm />

        <VehicleExtraServices data={EXTRA_SERVICES_DATA} />
        <AppDownloadBanner data={home_data.app_advertisement} />
        <Suspense fallback={<div>Loading...</div>}>
          <PopularCategoriesGrid />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <VehiclesSuggestions />
        </Suspense>
        <VehicleExtraServices
          data={EXTRA_SERVICES_DATA_2}
          className="bg-muted-foreground/10 rounded-xl lg:grid-cols-4"
        />
        <ToolsAccess data={home_data.herramientas} />
        <Zones />

        <RelatedNewsSection />
        <ToolsShortcuts />
        <TopDealerships />
        <Suspense fallback={<VehicleDiscoverySectionSkeleton />}>
          <VehicleDiscoverySection
            title={home_data.low_emissions.title}
            description={home_data.low_emissions.description}
            imageUrl={home_data.low_emissions.image_url}
            quickLinks={lowEmissionsQuickLinks}
          />
        </Suspense>
        {/* <ExtraFilters showProvinceBadges showMakeBadges /> */}
      </div>
    </>
  );
}
