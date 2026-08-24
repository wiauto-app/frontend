import type { Metadata } from 'next';

import { LandingContainer } from '@/components/ui/landingContainer';

import { CalculationHero } from './components/CalculationHero';
import { CarPartsGrid } from './components/CarPartsGrid';
import { GuaranteeBenefits } from './components/GuaranteeBenefits';
import { GuaranteeCtaCard } from './components/GuaranteeCtaCard';

export const metadata: Metadata = {
  title: 'Garantía Mecánica | WiAuto',
  description:
    'Conduce tranquilo con la garantía mecánica WiAuto. Cobertura frente a averías mecánicas, eléctricas y electrónicas.',
};

export default function GarantiaMecanicaPage() {
  return (
    <>
      <CalculationHero />
      <LandingContainer className='py-6 md:py-10 space-y-2'>
        <CarPartsGrid />
        <GuaranteeBenefits />
        <GuaranteeCtaCard />
      </LandingContainer>
    </>
  );
}
