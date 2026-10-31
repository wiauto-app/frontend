import type { Metadata } from "next";
import { Suspense } from "react";

import {
  HeroSection,
  PopularCategoriesGrid,
  PopularCategoriesGridSkeleton,
  RelatedNewsSection,
  RelatedNewsSectionSkeleton,
  TopDealershipsSkeleton,
  VehiclesSuggestionsSkeleton,
  ZonesSkeleton,
} from "@/components/home";
import { getHomeData } from "@/components/home/services/homeService";
import { MobileStoreButtonsMotion } from "@/components/home/MobileStoreButtonsMotion";
import { TopDealerships } from "@/components/home/topDealerships";
import { ExtraServicesCards } from "@/components/home/extraServicesCards";
import { VehiclesSuggestions } from "@/components/home/vehiclesSuggestions";
import { Zones } from "@/components/home/zones";
import {
  VehicleDiscoverySection,
  VehicleDiscoverySectionSkeleton,
} from "@/components/discovery";
import { mapLowEmissionsLinkToQuickLink } from "@/components/discovery/mappers/map-low-emissions-link-to-quick-link";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import { buildHomeSeo } from "@/lib/seo/build-home-seo";
import { JsonLdScript } from "@/lib/seo/json-ld-script";
import { MobileBrowseAllVehiclesCta } from "@/components/home/MobileBrowseAllVehiclesCta";
import { LandingContainer } from "@/components/ui/landingContainer";
import { LazyWiautoMatch } from "@/components/home/lazyImports/LazyWiautoMatch";
import { VehicleExtraServices } from "@/components/home/vehicleExtraServices";
import { LazyAppDownloadBanner } from "@/components/home/lazyImports/LazyAppDownloadBanner";
import { LazyPromotionPlans } from "@/components/home/lazyImports/LazyPromotionPlans";
import { NavbarLayout } from "@/components/layout/navbarLayout";

export const generateMetadata = async (): Promise<Metadata> => {
  const home_data = await getHomeData();
  return buildHomeSeo({ seo: home_data.homeSeo }).metadata;
};

export default async function Home() {
  const home_data = await getHomeData();
  const { jsonLdGraph } = buildHomeSeo({ seo: home_data.homeSeo });
  const low_emissions = home_data.bajas_emisiones;
  const low_emissions_links = low_emissions?.links ?? [];
  const low_emissions_quick_links =
    low_emissions_links.length > 0
      ? low_emissions_links.map(mapLowEmissionsLinkToQuickLink)
      : undefined;

  return (
    <NavbarLayout>
      <JsonLdScript data={jsonLdGraph} />
      <LandingContainer>
        <HeroSection data={home_data.homeHero} />
        {/* <div className="block sm:hidden h-50" /> */}
        <MobileStoreButtonsMotion
          className="mx-auto grid w-fit grid-cols-2 gap-1 lg:hidden"
        />
        <LazyWiautoMatch />

        <VehicleExtraServices />
        <LazyAppDownloadBanner data={home_data.homeAppAdvertisment} />
        <LazyPromotionPlans data={home_data.promocion_planes} />
        <MobileBrowseAllVehiclesCta />
        <Suspense fallback={<PopularCategoriesGridSkeleton />}>
          <PopularCategoriesGrid />
        </Suspense>
        <Suspense fallback={<VehiclesSuggestionsSkeleton />}>
          <VehiclesSuggestions />
        </Suspense>
        <ExtraServicesCards data={home_data.servicios_extra} />
        <Suspense fallback={<ZonesSkeleton />}>
          <Zones />
        </Suspense>

        <Suspense fallback={<RelatedNewsSectionSkeleton />}>
          <RelatedNewsSection />
        </Suspense>
        <Suspense fallback={<TopDealershipsSkeleton />}>
          <TopDealerships />
        </Suspense>
        <Suspense fallback={<VehicleDiscoverySectionSkeleton />}>
          <VehicleDiscoverySection
            title={low_emissions?.header?.titulo ?? undefined}
            description={low_emissions?.header?.descripcion ?? undefined}
            imageUrl={getStrapiMediaUrl(low_emissions?.imagen?.url)}
            quickLinks={low_emissions_quick_links}
          />
        </Suspense>
      </LandingContainer>
    </NavbarLayout>
  );
}
