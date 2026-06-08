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

export const generateMetadata = async (): Promise<Metadata> => {
  const home_data = await getHomeData();

  return {
    title: home_data.seo.meta_title,
    description: home_data.seo.meta_description,
    keywords: home_data.seo.keywords ?? undefined,
    alternates: home_data.seo.canonical_url
      ? { canonical: home_data.seo.canonical_url }
      : undefined,
    robots: home_data.seo.no_index ? { index: false, follow: false } : undefined,
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
      <HeroSection data={home_data.hero} />
      <PopularCategoriesGrid />
      <CarTypesSection />
      <FeaturedVehiclesSection />
      <AppDownloadBanner data={home_data.app_advertisement} />
      <ValuePropositionSection data={home_data.features} />
      <BlogArticlesSection />
      <RelatedNewsSection />
      <ProcessSection data={home_data.process_section} />
  
    </>
  );
}
