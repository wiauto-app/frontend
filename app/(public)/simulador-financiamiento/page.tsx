import type { Metadata } from "next";

import { LandingHeader } from "@/components/ui/landingHeader";

import { SimuladorContent } from "./components/SimuladorContent";
import {
  SIMULADOR_CTA,
  SIMULADOR_SEO_DEFAULTS,
} from "./constants/simulador-panel-copy";
import type { SimuladorPageViewModel } from "./interfaces/simulador-page.interface";
import { getSimuladorPageData } from "./services/getSimuladorPageData";

const buildPanelOnlyContent = (): SimuladorPageViewModel => ({
  header: {
    titulo: "",
    descripcion: "",
  },
  beneficiosTitulo: "",
  beneficios: [],
  pasosTitulo: "",
  pasos: [],
  testimoniosTitulo: "",
  testimonios: [],
  ctaFinal: SIMULADOR_CTA,
  seoTitle: SIMULADOR_SEO_DEFAULTS.title,
  seoDescription: SIMULADOR_SEO_DEFAULTS.description,
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getSimuladorPageData();
    return {
      title: content?.seoTitle ?? SIMULADOR_SEO_DEFAULTS.title,
      description:
        content?.seoDescription ?? SIMULADOR_SEO_DEFAULTS.description,
    };
  } catch {
    return {
      title: SIMULADOR_SEO_DEFAULTS.title,
      description: SIMULADOR_SEO_DEFAULTS.description,
    };
  }
}

export default async function SimuladorPage() {
  const content = await getSimuladorPageData();

  const pageContent = content ?? buildPanelOnlyContent();

  return (
    <div>
      {pageContent.header.titulo ? (
        <LandingHeader
          title={pageContent.header.titulo}
          description={pageContent.header.descripcion}
        />
      ) : null}
      <SimuladorContent content={pageContent} />
    </div>
  );
}
