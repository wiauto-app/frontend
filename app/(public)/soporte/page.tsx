import type { Metadata } from "next";

import { HeroFeatures } from "@/components/home/heroFeatures";
import { Hero } from "@/components/ui/hero";
import { HeroBackdrop } from "@/components/ui/heroBackdrop";
import { HeroDescription } from "@/components/ui/heroDescription";
import { HeroTitle } from "@/components/ui/heroTitle";

import { Channels } from "./components/channels";
import { SupportFeatures } from "./components/supportFeatures";
import { SupportQuestions } from "./components/supportQuestions";
import { resolveStrapiIconName } from "../simulador-financiamiento/utils/resolveStrapiIconName";
import { getSoportePageData } from "./services/getSoportePageData";
import { HeroCard } from "@/components/ui/heroCard";

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



  return (
    <div className="container-custom space-y-10">
      <Hero
        image={content.hero?.imagen?.url}
        leftContent={
          <div className="space-y-5 px-14 text-white">
            <HeroTitle>{content.hero?.titulo}</HeroTitle>
            <HeroDescription>{content.hero?.descripcion}</HeroDescription>
            <HeroFeatures features={content.caracteristicas ?? []} />
          </div>
        }
        rightContent={
          <div className="flex justify-center items-center">
            <HeroCard
              card={content.hero?.card }
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
