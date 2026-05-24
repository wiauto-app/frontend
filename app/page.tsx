import {
  AppDownloadBanner,
  BlogArticlesSection,
  FeaturedVehiclesSection,
  Footer,
  HeroSection,
  NewsletterSection,
  CarTypesSection,
  PopularCategoriesGrid,
  ProcessSection,
  RelatedNewsSection,
  ValuePropositionSection,
} from "@/components/home";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PopularCategoriesGrid />
      <CarTypesSection />
      <FeaturedVehiclesSection />
      <AppDownloadBanner />
      <ValuePropositionSection />
      <BlogArticlesSection />
      <RelatedNewsSection />
      <ProcessSection />
      <NewsletterSection />
      <Footer />
    </>
  );
}
