import { getPageData } from "./services/getPageData";
import { HeroSection } from "./components/HeroSection";
import { VentajasSection } from "./components/VentajasSection";
import { MarketingSection } from "./components/MarketingSection";
import { ConsejosSection } from "./components/ConsejosSection";
import { PreguntasSection } from "./components/PreguntasSection";
import { Metadata } from "next";
import { LandingContainer } from "@/components/ui/landingContainer";

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await getPageData();

  return {
    title: data.titulo,
    description: data.descripcion,
  };
};

export default async function Page() {
  const data = await getPageData();
  if (!data) {
    return (
      <div className="p-20 text-center">No se pudo cargar la información.</div>
    );
  }

  return (
    <LandingContainer>
      {data.titulo && (
        <HeroSection
          titulo={data.titulo}
          descripcion={data.descripcion}
          profesional={data.profesional}
          particular={data.particular}
          imagen={data.imagen[0]}
        />
      )}

      {data.ventajas && <VentajasSection data={data.ventajas} />}


      {data.marketingCard && <MarketingSection data={data.marketingCard} />}

      {data.consejos && <ConsejosSection data={data.consejos} />}

      {data.preguntas && <PreguntasSection data={data.preguntas} />}

    </LandingContainer>
  );
}
