import { getPageData } from "./services/getPageData";
import { VenderVehiculoResponse } from "./interfaces/vender-vehiculo.interface";
import { HeroSection } from "./components/HeroSection";
import { VentajasSection } from "./components/VentajasSection";
import { ComparacionSection } from "./components/ComparacionSection";
import { MarketingSection } from "./components/MarketingSection";
import { ConsejosSection } from "./components/ConsejosSection";
import { PreguntasSection } from "./components/PreguntasSection";
import { NewsletterSection } from "./components/NewsletterSection";

export default async function Page() {
  const data = (await getPageData()) as VenderVehiculoResponse;

  if (!data) {
    return <div className="p-20 text-center">No se pudo cargar la información.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {data.titulo && (
        <HeroSection 
          titulo={data.titulo} 
          descripcion={data.descripcion} 
          profesional={data.profesional} 
          particular={data.particular} 
        />
      )}
      
      {data.ventajas && <VentajasSection data={data.ventajas} />}
      
      {data.comparacion && <ComparacionSection data={data.comparacion} />}
      
      {data.marketingCard && (
          <MarketingSection data={data.marketingCard} />
      )}
      
      {data.consejos && <ConsejosSection data={data.consejos} />}
      
      {data.preguntas && <PreguntasSection data={data.preguntas} />}

      <NewsletterSection />
    </div>
  );
}