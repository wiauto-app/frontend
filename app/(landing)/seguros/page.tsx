import type { Metadata } from 'next';
import { SegurosHeroSection } from './components/SegurosHeroSection';
import { SegurosBenefitsSection } from './components/SegurosBenefitsSection';
import { SegurosSecuritySection } from './components/SegurosSecuritySection';
import { SegurosCoverageSection } from './components/SegurosCoverageSection';
import { SegurosCtaSection } from './components/SegurosCtaSection';
import { SegurosPartnersSection } from './components/SegurosPartnersSection';

export const metadata: Metadata = {
  title: 'Seguros | WiAuto',
  description:
    'Protege tu vehículo con Seguros Confianza. Coberturas integrales, atención 24/7 y trámites 100% online en alianza con WiAuto.',
};

export default function SegurosPage() {
  return (
    <div className='min-h-screen  max-w-6xl mx-auto  flex flex-col gap-6  p-8 md:p-4'>
      <SegurosHeroSection />
      <SegurosBenefitsSection />
      <SegurosSecuritySection />
      <SegurosCoverageSection />
      <SegurosCtaSection />
      <SegurosPartnersSection />
    </div>
  );
}
