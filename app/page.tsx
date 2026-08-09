import type { Metadata } from "next";
import { Suspense } from "react";

import {
  AppDownloadBanner,
  HeroSection,
  PopularCategoriesGrid,
  PopularCategoriesGridSkeleton,
  RelatedNewsSection,
  RelatedNewsSectionSkeleton,
  TopDealershipsSkeleton,
  VehiclesSuggestionsSkeleton,
  ZonesSkeleton,
} from "@/components/home";
import { PromotionPlans } from "@/components/home/promotionPlans";
import { SearchForm } from "@/components/home/searchForm";
import { getHomeData } from "@/components/home/services/homeService";
import { StoreButtons } from "@/components/home/StoreButtons";
import { TopDealerships } from "@/components/home/topDealerships";
import { VehicleExtraServices } from "@/components/home/vehicleExtraServices";
import { VehiclesSuggestions } from "@/components/home/vehiclesSuggestions";
import { Zones } from "@/components/home/zones";
import {
  VehicleDiscoverySection,
  VehicleDiscoverySectionSkeleton,
} from "@/components/discovery";
import { mapLowEmissionsLinkToQuickLink } from "@/components/discovery/mappers/map-low-emissions-link-to-quick-link";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import { LandingContainer } from "@/components/ui/landingContainer";

export const generateMetadata = async (): Promise<Metadata> => {
  const home_data = await getHomeData();
  const seo = home_data.homeSeo;
  const share_image_url = getStrapiMediaUrl(seo?.shareImage?.url);

  return {
    title: seo?.metaTitle ?? "",
    description: seo?.metaDescription ?? undefined,
    keywords: seo?.keywords ?? undefined,
    alternates: seo?.canonicalURL
      ? { canonical: seo.canonicalURL }
      : undefined,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: seo?.metaTitle ?? undefined,
      description: seo?.metaDescription ?? undefined,
      images: share_image_url ? [{ url: share_image_url }] : undefined,
    },
  };
};

export default async function Home() {
  const home_data = await getHomeData();
  const low_emissions = home_data.bajas_emisiones;
  const low_emissions_links = low_emissions?.links ?? [];
  const low_emissions_quick_links =
    low_emissions_links.length > 0
      ? low_emissions_links.map(mapLowEmissionsLinkToQuickLink)
      : undefined;

  return (
    <>
      <LandingContainer>
        <HeroSection data={home_data.homeHero} />

        <StoreButtons
          animateEntrance
          className="mx-auto grid w-fit grid-cols-2 gap-1 lg:hidden"
        />
        <SearchForm />

        <VehicleExtraServices />
        <AppDownloadBanner data={home_data.homeAppAdvertisment} />
        <PromotionPlans data={home_data.promocion_planes} />
        <Suspense fallback={<PopularCategoriesGridSkeleton />}>
          <PopularCategoriesGrid />
        </Suspense>
        <Suspense fallback={<VehiclesSuggestionsSkeleton />}>
          <VehiclesSuggestions />
        </Suspense>
        <VehicleExtraServices
          variant="secondary"
          className=" rounded-xl lg:grid-cols-4"
        />
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
    </>
  );
}
