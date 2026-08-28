import type { Metadata } from 'next';

import { BuyBenefits } from './components/BuyBenefits';
import { HeroInspection } from './components/HeroInspection';
import { HowItWorks } from './components/HowItWorks';
import { InspectionCtaCard } from './components/InspectionCtaCard';
import { InspectionPoints } from './components/InspectionPoints';

export const metadata: Metadata = {
  title: 'Revisión e Inspección de Vehículos | WiAuto',
  description:
    'Solicita una inspección profesional de más de 200 puntos antes de comprar un coche. Recibe un informe detallado con fotos y recomendaciones.',
};

export default function RevisionVehiculoPage() {
  return (
    <div className='overflow-hidden bg-[#f5f7fa] text-[#0b1739]'>
      <HeroInspection />
      <main>
        <BuyBenefits />
        <InspectionPoints />
        <HowItWorks />
        <div className='container-custom py-16 sm:py-20'>
          <InspectionCtaCard />
        </div>
      </main>
    </div>
  );
}
