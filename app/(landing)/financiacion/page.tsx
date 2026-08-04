import type { Metadata } from 'next';

import { FinanciacionHeroSection } from './components/FinanciacionHeroSection';
import { FinanciacionPasosSection } from './components/FinanciacionPasosSection';
import { FinanciacionSoporteSection } from './components/FinanciacionSoporteSection';
import { FinanciacionStatsSection } from './components/FinanciacionStatsSection';
import { FinanciacionVentajasSection } from './components/FinanciacionVentajasSection';
import { getFinanciacionPageData } from './services/getFinanciacionPageData';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const content = await getFinanciacionPageData();
    return {
      title: content?.hero?.titulo
        ? `${content.hero.titulo} | WiAuto`
        : 'Financiación | WiAuto',
      description:
        content?.hero?.descripcion ??
        'Financia tu próximo vehículo con WiAuto. Condiciones claras, cuotas a tu medida y acompañamiento en cada paso.',
    };
  } catch {
    return {
      title: 'Financiación | WiAuto',
      description:
        'Financia tu próximo vehículo con WiAuto. Condiciones claras, cuotas a tu medida y acompañamiento en cada paso.',
    };
  }
}

export default async function FinanciacionPage() {
  let content = null;

  try {
    content = await getFinanciacionPageData();
  } catch {
    content = null;
  }
  if (!content) {
    return (
      <div className='flex min-h-[50vh] items-center justify-center p-20 text-center text-slate-600'>
        No se pudo cargar la información de financiación. Inténtalo de nuevo más
        tarde.
      </div>
    );
  }

  return (
    <div className='container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-14 py-8'>
      {content.hero ? <FinanciacionHeroSection hero={content.hero} /> : null}

      {content.ventajas ? (
        <FinanciacionVentajasSection data={content.ventajas} />
      ) : null}
      {content.pasos ? <FinanciacionPasosSection data={content.pasos} /> : null}

      {content.soporte ? (
        <FinanciacionSoporteSection hero={content.soporte} />
      ) : null}
      {content.estadisticas && content.estadisticas.length > 0 ? (
        <FinanciacionStatsSection items={content.estadisticas} />
      ) : null}

    </div>
  );
}
