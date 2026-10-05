import type { Metadata } from "next";

import { IconFeatureList } from "@/components/landings/IconFeatureList";
import { LandingHeroSection } from "@/components/landings/LandingHeroSection";
import { StrapiStructuredData } from "@/components/strapi/StrapiStructuredData";
import { LandingContainer } from "@/components/ui/landingContainer";
import { buildStrapiMetadata } from "@/lib/seo/build-strapi-metadata";

import { TasadorValuationFlow } from "./components/TasadorValuationFlow";
import { getTasadorContent } from "./services/getTasadorContent";
import { tasadorIconPack } from "./utils/tasadorIconPack";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getTasadorContent();
  return buildStrapiMetadata({ seo: content.seo, path: "/tasador" });
}

export default async function TasadorPage() {
  const content = await getTasadorContent();

  return (
    <LandingContainer>
      <StrapiStructuredData seo={content.seo} />
      {content.hero ? (
        <LandingHeroSection hero={content.hero} iconPack={tasadorIconPack} />
      ) : null}

      <TasadorValuationFlow content={content} />

      {content.confianza?.length ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <IconFeatureList items={content.confianza} iconPack={tasadorIconPack} variant="strip" />
        </section>
      ) : null}
    </LandingContainer>
  );
}
