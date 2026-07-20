import type { Metadata } from "next";

import { HeroFeatures } from "@/components/home/heroFeatures";
import type { HeroFeature } from "@/interfaces/hero-feature.interface";
import { Hero } from "@/components/ui/hero";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { HeroDescription } from "@/components/ui/heroDescription";
import { HeroTitle } from "@/components/ui/heroTitle";
import { getStrapiMediaUrl } from "@/lib/strapi-media";

import { Channels } from "./components/channels";
import { SupportFeatures } from "./components/supportFeatures";
import { SupportQuestions } from "./components/supportQuestions";
import { SupportCard } from "./components/supportCard";
import { resolveStrapiIconName } from "../simulador-financiamiento/utils/resolveStrapiIconName";
import type { SoporteIconFeature } from "./interfaces/soporte.interface";
import { getSoportePageData } from "./services/getSoportePageData";

const mapSoporteIconFeaturesToHeroFeatures = (
  items: SoporteIconFeature[] | null | undefined,
): HeroFeature[] => {
  if (!items?.length) {
    return [];
  }

  return items
    .filter((item) => item.label?.trim())
    .map((item) => {
      const label = item.label.trim();

      return {
        id: String(item.id),
        label,
        description: item.descripcion?.trim() ?? null,
        icon_url: getStrapiMediaUrl(item.icon?.url),
        icon_alt: item.icon?.alternativeText ?? label,
      };
    });
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getSoportePageData();

    return {
      title: content?.hero?.titulo
        ? `${content.hero.titulo} | WiAuto`
        : "Soporte | WiAuto",
      description:
        content?.hero?.descripcion ??
        "Centro de ayuda y canales de contacto de WiAuto.",
    };
  } catch {
    return {
      title: "Soporte | WiAuto",
      description: "Centro de ayuda y canales de contacto de WiAuto.",
    };
  }
}

export default async function Page() {
  let content = null;

  try {
    content = await getSoportePageData();
  } catch {
    content = null;
  }

  if (!content) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-20 text-center text-slate-600">
        No se pudo cargar la información de soporte. Inténtalo de nuevo más
        tarde.
      </div>
    );
  }

  const heroFeatures = mapSoporteIconFeaturesToHeroFeatures(
    content.hero?.caracteristicas,
  );

  return (
    <div className="container-custom space-y-10">
      <Hero
        image={content.hero?.imagen?.url}
        leftContent={
          <div className="space-y-5 px-14 text-white">
            <HeroTitle>{content.hero?.titulo}</HeroTitle>
            <HeroDescription>{content.hero?.descripcion}</HeroDescription>
            <HeroFeatures features={heroFeatures} />
          </div>
        }
        rightContent={
          <div className="flex justify-center items-center">
            <SupportCard
              Icon={resolveStrapiIconName(content.hero?.card?.iconName)}
              title={content.hero?.card?.titulo ?? ""}
              description={content.hero?.card?.descripcion ?? ""}
            />
          </div>
        }
        floatingContent={<HeroBackdrop />}
      />
      <Channels data={content.canales} />
      <SupportFeatures data={content.caracteristicas} />
      <SupportQuestions data={content.preguntas} />
    </div>
  );
}
