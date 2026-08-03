import React from 'react';
import type { StrapiFinanciacionAdvantages } from '@/interfaces/strapi-components.interface';
import { resolveStrapiIconName } from '@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName';
import { IconContainer } from '@/components/ui/iconContainer';
import {
  ShieldCheck,
  Percent,
  CalendarDays,
  FileText,
  Users,
} from 'lucide-react';

interface FinanciacionVentajasSectionProps {
  data: StrapiFinanciacionAdvantages;
}

const FALLBACK_VENTAJAS = [
  {
    label: 'Aprobación rápida',
    desc: 'Obtén respuesta en menos de 24 horas.',
    icon: ShieldCheck,
  },
  {
    label: 'Tasas competitivas',
    desc: 'Mejores condiciones del mercado.',
    icon: Percent,
  },
  {
    label: 'Planes flexibles',
    desc: 'Plazos y cuotas que se adaptan a ti.',
    icon: CalendarDays,
  },
  {
    label: 'Sin trámites complicados',
    desc: 'Proceso 100% digital, simple y seguro.',
    icon: FileText,
  },
  {
    label: 'Acompañamiento total',
    desc: 'Te guiamos en cada paso del proceso.',
    icon: Users,
  },
];

export const FinanciacionVentajasSection = ({
  data,
}: FinanciacionVentajasSectionProps) => {
  const title =
    data?.header?.titulo || 'Ventajas exclusivas para la comunidad de WiAuto';
  const rawFeatures =
    data?.caracteristicas?.filter((item) => item.label?.trim()) ?? [];
  const displayFeatures =
    rawFeatures.length > 0 ? rawFeatures : FALLBACK_VENTAJAS;

  return (
    <section className='py-6'>
      <div className='text-center max-w-3xl mx-auto mb-8'>
        <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
          {title}
        </h2>
        {data?.header?.descripcion && (
          <p className='mt-2 text-slate-600 text-xs sm:text-sm'>
            {data.header.descripcion}
          </p>
        )}
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
        {displayFeatures.map((item: any, idx: number) => {
          const StrapiIcon =
            (item.iconName ? resolveStrapiIconName(item.iconName) : null) ??
            item.icon ??
            ShieldCheck;
          const label = item.label;
          const desc = item.descripcion || item.desc;

          return (
            <div
              key={idx}
              className='bg-white border border-slate-100/90 rounded-2xl p-5 flex flex-col items-center text-center gap-3 shadow-xs hover:shadow-md transition-shadow'
            >
              <div className='size-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center'>
                {typeof StrapiIcon === 'function' ? (
                  <StrapiIcon className='size-5' />
                ) : (
                  <IconContainer Icon={StrapiIcon} justIcon />
                )}
              </div>
              <h3 className='text-sm font-bold text-slate-900'>{label}</h3>
              {desc && (
                <p className='text-[11px] text-slate-500 leading-relaxed'>
                  {desc}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
