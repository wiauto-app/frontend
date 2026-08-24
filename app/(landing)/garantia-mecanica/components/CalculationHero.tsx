'use client';

import { ArrowRight, ChevronRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HERO_TRUST_BADGES } from '../constants';
import { GuaranteePreviewCard } from './GuaranteePreviewCard';

export const CalculationHero = () => {
  return (
    <section className='relative overflow-hidden bg-white'>
      <div className='container-custom relative z-10 mx-auto px-4 py-10 sm:px-6 lg:py-2'>
        <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
          <div className='flex flex-col gap-6'>
            <span className='inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-primary shadow-xs'>
              <ShieldCheck className='size-3.5' aria-hidden />
              Garantía mecánica WiAuto
            </span>

            <div className='space-y-4'>
              <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]'>
                Conduce tranquilo. Nosotros cubrimos los imprevistos.
              </h1>
              <p className='max-w-lg text-sm sm:text-base leading-relaxed text-slate-500'>
                Protección frente a averías mecánicas, eléctricas y electrónicas
                seleccionadas. Sin letra pequeña. Sin sorpresas.
              </p>
            </div>

            {/* Trust Badges */}
            <ul className='flex flex-wrap items-center gap-x-6 gap-y-3 pt-2'>
              {HERO_TRUST_BADGES.map((badge) => {
                const Icon = badge.icon;
                return (
                  <li key={badge.label} className='flex items-center gap-2'>
                    <div className='flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/30 text-primary'>
                      <Icon className='size-3' aria-hidden />
                    </div>
                    <span className='text-xs font-medium text-slate-600'>
                      {badge.label}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Action CTA with hand-drawn arrow */}
            <div className='flex items-center gap-4 pt-2'>
              <Button
                size='lg'
                className='h-12 rounded-xl bg-primary px-7 text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all'
              >
                Calcular mi garantía
                <ChevronRight className='ml-1 size-4' />
              </Button>

              <div className='flex items-center gap-2 text-slate-400'>
                <svg
                  className='h-4 w-7 text-slate-400'
                  viewBox='0 0 32 20'
                  fill='none'
                  aria-hidden
                >
                  <path
                    d='M28 4 C 18 4, 8 10, 4 16'
                    stroke='currentColor'
                    strokeWidth='1.75'
                    strokeLinecap='round'
                    strokeDasharray='3 3'
                  />
                  <path
                    d='M4 16 L 3 10 M 4 16 L 10 17'
                    stroke='currentColor'
                    strokeWidth='1.75'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <span className='text-xs font-medium text-slate-500 whitespace-nowrap'>
                  Es rápido, fácil y seguro
                </span>
              </div>
            </div>
          </div>

          <div className='relative flex justify-center lg:justify-end'>
            {/* Centered blue circle with radial gradient */}
            <div
              className='pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[520px] sm:size-[580px] rounded-full bg-[radial-gradient(circle_at_center,#DBEAFE_0%,#EBF3FF_55%,transparent_75%)] opacity-80'
              aria-hidden
            />
            {/* Decorative dot matrix pattern */}
            <div
              className='pointer-events-none absolute -right-6 -top-6 hidden h-28 w-28 bg-[radial-gradient(#93c5fd_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-50 lg:block'
              aria-hidden
            />

            <div className='relative z-10 w-full flex justify-center lg:justify-end'>
              <GuaranteePreviewCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
