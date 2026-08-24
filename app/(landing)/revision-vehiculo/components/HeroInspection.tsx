'use client';

import Image from 'next/image';
import { ArrowRight, CheckCircle2, ChevronDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HERO_BADGES } from '../constants';

export const HeroInspection = () => {
  const scrollToForm = () => {
    document.getElementById('solicitar-inspeccion')?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const scrollToPoints = () => {
    document.getElementById('puntos-revision')?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const featuresList = [
    { label: '200+ puntos revisados', icon: CheckCircle2 },
    { label: '45 fotos adjuntas', icon: CheckCircle2 },
    { label: 'Prueba de conducción', icon: CheckCircle2 },
    { label: 'Recomendaciones', icon: CheckCircle2 },
  ];

  return (
    <section className='relative overflow-hidden bg-white'>
      <div
        className='pointer-events-none absolute right-0 top-0 size-145 rounded-full bg-[#EBF3FF] opacity-80 blur-3xl'
        aria-hidden
      />

      <div className='container-custom relative z-10 mx-auto px-4 py-10 sm:px-6 lg:py-14'>
        <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
          <div className='flex flex-col gap-6'>
            <span className='inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-xs'>
              <FileText className='size-3.5' aria-hidden />
              Inspección profesional
            </span>

            <div className='space-y-4'>
              <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]'>
                Que un profesional revise el coche por ti
              </h1>
              <p className='max-w-lg text-sm sm:text-base leading-relaxed text-slate-500'>
                Solicita una inspección antes de comprar y recibe un informe
                detallado con el estado real del vehículo. Evita sorpresas y
                compra con total seguridad.
              </p>
            </div>

            <div className='flex flex-wrap items-center gap-3 pt-1'>
              <Button
                size='lg'
                onClick={scrollToForm}
                className='h-12 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all'
              >
                Solicitar revisión
                <ArrowRight className='ml-1 size-4' />
              </Button>

              <Button
                variant='outline'
                size='lg'
                onClick={scrollToPoints}
                className='h-12 rounded-xl border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50'
              >
                ¿Qué revisamos?
                <ChevronDown className='ml-1 size-4 text-slate-400' />
              </Button>
            </div>

            <ul className='flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-slate-100'>
              {HERO_BADGES.map((badge) => {
                const Icon = badge.icon;
                return (
                  <li key={badge.label} className='flex items-center gap-2'>
                    <div className='flex size-5 items-center justify-center rounded-full border border-primary/30 text-primary'>
                      <Icon className='size-3' aria-hidden />
                    </div>
                    <span className='text-xs font-medium text-slate-600'>
                      {badge.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className='relative flex justify-center lg:justify-end'>
            <div className='relative w-full max-w-125'>
              <div className='relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-slate-100 shadow-xl ring-1 ring-slate-100'>
                <Image
                  src='/mechanic-inspection.jpg'
                  alt='Mecánico inspeccionando vehículo'
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 500px'
                  priority
                />
              </div>

              <div className='absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-8 w-60 sm:w-67.5 rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl ring-1 ring-slate-100/90 z-20'>
                <p className='text-xs font-bold text-slate-900'>
                  Resumen de la inspección
                </p>

                <div className='mt-3 flex items-center justify-between'>
                  <span className='text-[11px] font-medium text-slate-500'>
                    Estado general
                  </span>
                  <span className='rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600'>
                    Bueno
                  </span>
                </div>

                <div className='mt-4 flex items-center gap-4'>
                  <div className='relative flex size-15 shrink-0 items-center justify-center'>
                    <svg className='size-full -rotate-90' viewBox='0 0 44 44'>
                      <circle
                        cx='22'
                        cy='22'
                        r='18'
                        className='stroke-slate-100 fill-none'
                        strokeWidth='3.5'
                      />
                      <circle
                        cx='22'
                        cy='22'
                        r='18'
                        className='stroke-primary fill-none transition-all duration-700 ease-out'
                        strokeWidth='3.5'
                        strokeDasharray={113.097}
                        strokeDashoffset={113.097 * (1 - 8.2 / 10)}
                        strokeLinecap='round'
                      />
                    </svg>
                    <div className='absolute text-center'>
                      <span className='text-sm font-black text-slate-900 leading-none'>
                        8,2
                      </span>
                      <span className='block text-[8px] font-semibold text-slate-400'>
                        /10
                      </span>
                    </div>
                  </div>

                  <ul className='space-y-1 text-[10px] text-slate-600'>
                    {featuresList.map((feature, index) => (
                      <li className='flex items-center gap-1.5' key={index}>
                        {feature.icon ? (
                          <feature.icon className='size-3 shrink-0 text-emerald-500 fill-emerald-500' />
                        ) : (
                          <CheckCircle2 className='size-3 shrink-0 text-emerald-500 fill-emerald-500' />
                        )}
                        <span>{feature.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-blue-50/70 py-2 text-[11px] font-bold text-primary hover:bg-blue-100/70 transition-colors cursor-pointer'>
                  <FileText className='size-3.5' />
                  Ver informe de ejemplo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
