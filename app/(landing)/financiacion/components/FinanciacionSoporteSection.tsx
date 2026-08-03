'use client';

import React from 'react';
import type { StrapiHero } from '@/interfaces/strapi-components.interface';
import { resolveStrapiIconName } from '@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName';
import { IconContainer } from '@/components/ui/iconContainer';
import { ShieldCheck, Users, MapPin, Award } from 'lucide-react';
import Image from 'next/image';

interface FinanciacionSoporteSectionProps {
  hero: StrapiHero;
}

const FALLBACK_METRICAS = [
  {
    label: '+10 años',
    desc: 'De experiencia en el sector financiero',
    icon: ShieldCheck,
  },
  { label: '+25.000', desc: 'Clientes financiados con éxito', icon: Users },
  {
    label: 'Presencia nacional',
    desc: 'Cobertura en todo el país',
    icon: MapPin,
  },
  {
    label: 'Alianza con WiAuto',
    desc: 'Convenio exclusivo para nuestros clientes',
    icon: Award,
  },
];

export const FinanciacionSoporteSection = ({
  hero,
}: FinanciacionSoporteSectionProps) => {
  const caracteristicasStrapi = hero?.caracteristicas ?? [];
  const imageUrl =
    hero?.imagen?.url ||
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80';

  return (
    <section id='aliado' className='py-2'>
      <div className='bg-[#f4f7fc]/90 border border-slate-100/80 rounded-[20px] pr-4 pl-0 py-0 sm:pr-8 shadow-xs relative overflow-hidden flex flex-col lg:flex-row items-center gap-4 lg:gap-8'>
        <div className='relative w-full h-48 sm:h-56 lg:w-60 lg:h-auto xl:w-67.5 shrink-0 bg-slate-200'>
          <Image
            src={imageUrl}
            alt={hero?.titulo || 'Respaldo que te da tranquilidad'}
            className='w-full h-full object-cover object-top'
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80';
            }}
            width={500}
            height={500}
          />
        </div>
        <div className='flex-1 flex flex-col justify-center gap-3 py-4 pl-3 lg:pl-0'>
          <div>
            <span className='text-[9px] font-bold uppercase tracking-widest text-blue-600'>
              NUESTRO ALIADO
            </span>
            <h2 className='text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mt-0.5'>
              {hero?.titulo || 'Respaldo que te da tranquilidad'}
            </h2>
            <p className='text-[11px] sm:text-xs text-slate-600 mt-1 max-w-xl leading-relaxed'>
              {hero?.descripcion ||
                'Trabajamos con un aliado sólido que comparte nuestro compromiso de brindarte la mejor experiencia.'}
            </p>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1'>
            {(caracteristicasStrapi.length > 0
              ? caracteristicasStrapi
              : FALLBACK_METRICAS
            ).map((item: any, idx: number) => {
              const Icon =
                (item.iconName ? resolveStrapiIconName(item.iconName) : null) ??
                item.icon ??
                ShieldCheck;
              const label = item.label;
              const desc = item.descripcion || item.desc;

              return (
                <div key={idx} className='flex flex-col items-start gap-0.5'>
                  <div className='size-7 rounded-full bg-blue-100/70 text-blue-600 flex items-center justify-center mb-0.5'>
                    {typeof Icon === 'function' ? (
                      <Icon className='size-3.5' />
                    ) : (
                      <IconContainer Icon={Icon} justIcon />
                    )}
                  </div>
                  <span className='text-xs font-extrabold text-blue-600 leading-none'>
                    {label}
                  </span>
                  {desc && (
                    <span className='text-[9px] text-slate-500 leading-tight max-w-30'>
                      {desc}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className='w-full lg:w-55 xl:w-62.5 py-4 my-auto shrink-0 pr-3 lg:pr-0 self-stretch flex items-center'>
          <div className='bg-white border border-slate-100/80 rounded-xl p-5 shadow-xs flex flex-col items-center justify-center text-center w-full h-full min-h-35'>
            <h3 className='text-2xl font-black text-blue-600 tracking-tight mb-1'>
              {hero?.card?.titulo || 'CrediAuto'}
            </h3>
            <p className='text-[10px] text-slate-500 max-w-37.5 leading-snug'>
              {hero?.card?.descripcion ||
                'Un aliado comprometido con tu movilidad.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
