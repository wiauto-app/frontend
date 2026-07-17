import type { SimuladorPageViewModel } from "../interfaces/simulador-page.interface";
import { SimulatorBenefitsSection } from "./SimulatorBenefitsSection";
import { SimulatorCtaSection } from "./SimulatorCtaSection";
import { SimulatorPanel } from "./SimulatorPanel";
import { SimulatorStepsSection } from "./SimulatorStepsSection";
import { SimulatorTestimonialsSection } from "./SimulatorTestimonialsSection";

interface SimuladorContentProps {
  content: SimuladorPageViewModel;
}

export const SimuladorContent = ({ content }: SimuladorContentProps) => {
  return (
    <div className="min-h-screen">
      <div className="container-custom py-8 sm:py-10">
        <SimulatorPanel
          copyUi={content.copyUi}
          confianzaTexto={content.copyUi.textoConfianza}
        />

        <SimulatorBenefitsSection
          titulo={content.beneficiosTitulo}
          beneficios={content.beneficios}
        />

        <SimulatorStepsSection titulo={content.pasosTitulo} pasos={content.pasos} />

        <SimulatorTestimonialsSection
          titulo={content.testimoniosTitulo}
          testimonios={content.testimonios}
        />

      </div>
    </div>
  );
};
