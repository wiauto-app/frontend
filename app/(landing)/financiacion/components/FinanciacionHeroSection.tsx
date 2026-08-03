import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import type { StrapiHero } from '@/interfaces/strapi-components.interface';

interface FinanciacionHeroSectionProps {
  hero: StrapiHero;
}

export const FinanciacionHeroSection = ({
  hero,
}: FinanciacionHeroSectionProps) => {
  const imageUrl =
    hero?.imagen?.url ||
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80';

  const acciones = hero?.acciones?.filter((a) => a.label?.trim()) ?? [];

  return (
    <section className='relative w-full rounded-3xl overflow-hidden py-10 px-6 sm:px-12 min-h-115 flex items-center shadow-xs border border-slate-100/60'>
      <div className='absolute inset-0 z-0'>
        <Image
          src={imageUrl}
          alt={hero?.titulo || 'Financiación de vehículo'}
          fill
          className='object-cover object-center'
          priority
        />
        <div className='absolute inset-0 bg-linear-to-r from-white/95 via-white/80 to-transparent' />
      </div>

      <div className='relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
        <div className='lg:col-span-7 flex flex-col gap-4 max-w-xl'>
          <span className='text-[10px] font-bold tracking-widest text-blue-600 uppercase bg-blue-50/90 border border-blue-100/80 w-fit px-3 py-1 rounded-full'>
            FINANCIACIÓN INTELIGENTE
          </span>

          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.12] tracking-tight'>
            Financia tu próximo vehículo con las{' '}
            <span className='text-blue-600'>mejores condiciones</span>
          </h1>

          <p className='text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg'>
            {hero?.descripcion ||
              'Gracias a nuestro convenio con CrediAuto, accede a planes de financiación flexibles, rápidos y diseñados para ti.'}
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1'>
            {[
              'Aprobación rápida',
              'Planes flexibles',
              'Tasas competitivas',
              'Acompañamiento personalizado',
            ].map((item, idx) => (
              <div key={idx} className='flex items-center gap-2'>
                <div className='size-4.5 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0'>
                  <Check className='size-3 stroke-3' />
                </div>
                <span className='text-xs font-semibold text-slate-800'>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className='flex flex-wrap items-center gap-3 pt-3'>
            {acciones.length > 0 ? (
              acciones.map((acc, index) => {
                const isFirst = index === 0;
                const isPrimary = acc.destacado ?? isFirst;

                return (
                  <Link
                    key={acc.id || index}
                    href={acc.url || (isFirst ? '#simulador' : '#aliado')}
                    className={
                      isPrimary
                        ? 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all text-xs sm:text-sm'
                        : 'bg-white/90 backdrop-blur-xs border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-6 py-3 rounded-xl transition-all text-xs sm:text-sm shadow-2xs'
                    }
                  >
                    {acc.label}
                    {isFirst && <ArrowRight className='size-4' />}
                  </Link>
                );
              })
            ) : (
              <>
                <Link
                  href='#simulador'
                  className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all text-xs sm:text-sm'
                >
                  Simula tu financiación
                  <ArrowRight className='size-4' />
                </Link>

                <Link
                  href='#aliado'
                  className='bg-white/90 backdrop-blur-xs border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium px-6 py-3 rounded-xl transition-all text-xs sm:text-sm shadow-2xs'
                >
                  Conoce a nuestro aliado
                </Link>
              </>
            )}
          </div>
        </div>

        <div className='lg:col-span-5 flex justify-center lg:justify-end'>
          <div className='bg-white/95 backdrop-blur-md border border-slate-100/90 p-6 rounded-2xl shadow-2xl max-w-[280px] w-full flex flex-col gap-3'>
            <div className='text-center border-b border-slate-100 pb-3'>
              <span className='text-[9px] font-bold text-slate-400 uppercase tracking-wider'>
                Nuestro aliado financiero
              </span>
              <h4 className='text-2xl font-black text-blue-600 tracking-tight mt-0.5'>
                {hero?.card?.titulo || 'CrediAuto'}
              </h4>
              <p className='text-[10px] text-slate-500 mt-1 leading-snug'>
                {hero?.card?.descripcion ||
                  'Soluciones financieras inteligentes para que sigas avanzando.'}
              </p>

              <div className='flex items-center justify-center gap-1.5 mt-2'>
                <span className='text-sm font-extrabold text-slate-800'>
                  4.8
                </span>
                <div className='flex text-amber-400 text-xs'>
                  {'★'.repeat(5)}
                </div>
                <span className='text-[9px] text-slate-400'>
                  (636 opiniones)
                </span>
              </div>
            </div>

            <div className='space-y-2 text-[11px] text-slate-700'>
              <div className='flex items-center gap-2'>
                <div className='size-4 rounded-full border border-blue-500 flex items-center justify-center text-blue-600 shrink-0'>
                  <Check className='size-2.5 stroke-3' />
                </div>
                <span>Más de 10 años de experiencia</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='size-4 rounded-full border border-blue-500 flex items-center justify-center text-blue-600 shrink-0'>
                  <Check className='size-2.5 stroke-3' />
                </div>
                <span>Miles de clientes satisfechos</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='size-4 rounded-full border border-blue-500 flex items-center justify-center text-blue-600 shrink-0'>
                  <Check className='size-2.5 stroke-3' />
                </div>
                <span>Respaldo y seguridad garantizada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
