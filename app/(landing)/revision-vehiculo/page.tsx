import type { Metadata } from 'next';

import { LandingContainer } from '@/components/ui/landingContainer';

import { BuyBenefits } from './components/BuyBenefits';
import { HeroInspection } from './components/HeroInspection';
import { HowItWorks } from './components/HowItWorks';
import { InspectionCtaCard } from './components/InspectionCtaCard';
import { InspectionForm } from './components/InspectionForm';
import { InspectionPoints } from './components/InspectionPoints';

export const metadata: Metadata = {
  title: 'Revisión e Inspección de Vehículos | WiAuto',
  description:
    'Solicita una inspección profesional de más de 200 puntos antes de comprar un coche. Recibe un informe detallado con fotos y recomendaciones.',
};

export default function RevisionVehiculoPage() {
  return (
    <>
      <HeroInspection />
      <LandingContainer className='py-6 md:py-10 space-y-2'>
        <InspectionPoints />
        <BuyBenefits />
        <HowItWorks />
        <InspectionForm />
        <InspectionCtaCard />
      </LandingContainer>
    </>
  );
}
