import { IconContainer } from '@/components/ui/iconContainer';

import { HOW_IT_WORKS_STEPS } from '../constants';

export const HowItsWork = () => {
  return (
    <section className='py-6 lg:py-10'>
      <div className='mx-auto max-w-2xl text-center mb-8 sm:mb-10'>
        <h2 className='text-2xl font-black tracking-tight text-slate-900 sm:text-3xl'>
          Cómo funciona
        </h2>
      </div>

      <div className='relative mx-auto max-w-5xl'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 relative'>
          <div className='relative flex items-center gap-4'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-sm font-bold text-primary shadow-xs'>
              1
            </div>

            <div className='flex size-14 shrink-0 items-center justify-center rounded-2xl border border-blue-100/80 bg-blue-50/40 text-primary'>
              <svg
                viewBox='0 0 24 24'
                className='size-6 stroke-primary'
                fill='none'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect x='2' y='6' width='20' height='12' rx='2' />
                <path d='M6 10v4' />
                <path d='M10 10v4' />
                <path d='M14 10v4' />
                <path d='M18 10v4' />
              </svg>
            </div>

            <div className='min-w-0 flex-1'>
              <h3 className='text-xs sm:text-sm font-bold text-slate-900'>
                Introduce la matrícula
              </h3>
              <p className='mt-1 text-[11px] leading-relaxed text-slate-500'>
                Escribe la matrícula o el VIN del vehículo que quieres
                consultar.
              </p>
            </div>

            <div className='hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 border-t-2 border-dotted border-slate-200' />
          </div>

          <div className='relative flex items-center gap-4'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-sm font-bold text-primary shadow-xs'>
              2
            </div>

            <div className='flex size-14 shrink-0 items-center justify-center rounded-2xl border border-blue-100/80 bg-blue-50/40 text-primary'>
              <svg
                viewBox='0 0 24 24'
                className='size-6 stroke-primary'
                fill='none'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='11' cy='11' r='7' />
                <path d='m21 21-4.35-4.35' />
              </svg>
            </div>

            <div className='min-w-0 flex-1'>
              <h3 className='text-xs sm:text-sm font-bold text-slate-900'>
                Localizamos información
              </h3>
              <p className='mt-1 text-[11px] leading-relaxed text-slate-500'>
                Accedemos a múltiples fuentes oficiales para recopilar los
                datos.
              </p>
            </div>

            <div className='hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 border-t-2 border-dotted border-slate-200' />
          </div>

          <div className='relative flex items-center gap-4'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-sm font-bold text-primary shadow-xs'>
              3
            </div>

            <div className='flex size-14 shrink-0 items-center justify-center rounded-2xl border border-blue-100/80 bg-blue-50/40 text-primary'>
              <svg
                viewBox='0 0 24 24'
                className='size-6 stroke-primary'
                fill='none'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                <polyline points='14 2 14 8 20 8' />
                <rect
                  x='8'
                  y='13'
                  width='8'
                  height='5'
                  rx='1'
                  className='fill-primary stroke-none'
                />
                <text
                  x='12'
                  y='16.8'
                  textAnchor='middle'
                  fontSize='3.8'
                  fill='white'
                  fontWeight='bold'
                >
                  PDF
                </text>
              </svg>
            </div>

            <div className='min-w-0 flex-1'>
              <h3 className='text-xs sm:text-sm font-bold text-slate-900'>
                Recibe tu informe
              </h3>
              <p className='mt-1 text-[11px] leading-relaxed text-slate-500'>
                Obtén tu informe completo al instante y toma decisiones con
                confianza.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
