import { FinanciacionSimuladorCard } from "../../financiacion/components/FinanciacionSimuladorCard";
import type { SimuladorPageViewModel } from "../interfaces/simulador-page.interface";
import { SimulatorBenefitsSection } from "./SimulatorBenefitsSection";
import { SimulatorStepsSection } from "./SimulatorStepsSection";
import { SimulatorTestimonialsSection } from "./SimulatorTestimonialsSection";

interface SimuladorContentProps {
  content: SimuladorPageViewModel;
}

export const SimuladorContent = ({ content }: SimuladorContentProps) => {
  return (
    <div className="min-h-screen">
      <div className="container-custom py-8 sm:py-10">
        <FinanciacionSimuladorCard />

        <SimulatorBenefitsSection
          titulo={content.beneficiosTitulo}
          beneficios={content.beneficios}
        />

        <SimulatorStepsSection
          titulo={content.pasosTitulo}
          pasos={content.pasos}
        />

        {content.testimonios.length > 0 && (
          <SimulatorTestimonialsSection
            titulo={content.testimoniosTitulo}
            testimonios={content.testimonios}
          />
        )}
      </div>
    </div>
  );
};
