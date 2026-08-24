import { ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { INSPECTION_POINTS } from '../constants';

export const InspectionPoints = () => {
  return (
    <section id='puntos-revision' className='py-6 lg:py-2'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]'>
        <Card className='rounded-3xl border-0 bg-white shadow-[0_4px_25px_rgba(15,23,42,0.05)] ring-1 ring-slate-100 p-6 sm:p-8'>
          <h2 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
            Una revisión de más de 200 puntos
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-8'>
            <div className='space-y-6'>
              {INSPECTION_POINTS.left.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className='flex items-center gap-3.5 group'
                  >
                    <div className='flex size-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100/80 bg-blue-50/50 text-primary transition-colors group-hover:bg-primary group-hover:text-white'>
                      <Icon className='size-5' />
                    </div>
                    <div>
                      <h3 className='text-sm font-bold text-slate-900'>
                        {item.title}
                      </h3>
                      <p className='text-xs text-slate-500 mt-0.5'>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className='relative mx-auto flex items-center justify-center py-4'>
              <div className='relative h-[320px] w-[150px] sm:h-[360px] sm:w-[170px]'>
                <svg
                  viewBox='0 0 160 340'
                  className='h-full w-full drop-shadow-md'
                  fill='none'
                >
                  <rect
                    x='18'
                    y='10'
                    width='124'
                    height='320'
                    rx='36'
                    fill='#F1F5F9'
                  />

                  <path
                    d='M32 40 C32 15, 128 15, 128 40 L136 100 C140 120, 140 220, 136 260 L128 310 C128 328, 32 328, 32 310 L24 260 C20 220, 20 120, 24 100 Z'
                    fill='#FFFFFF'
                    stroke='#CBD5E1'
                    strokeWidth='2.5'
                  />

                  <path
                    d='M38 75 Q80 65 122 75 L116 115 Q80 110 44 115 Z'
                    fill='#E2E8F0'
                    stroke='#94A3B8'
                    strokeWidth='1.5'
                  />

                  <rect
                    x='42'
                    y='125'
                    width='76'
                    height='85'
                    rx='10'
                    fill='#F8FAFC'
                    stroke='#E2E8F0'
                    strokeWidth='1.5'
                  />

                  <path
                    d='M42 220 Q80 225 118 220 L122 250 Q80 255 38 250 Z'
                    fill='#E2E8F0'
                    stroke='#94A3B8'
                    strokeWidth='1.5'
                  />

                  <path
                    d='M20 90 Q12 90 14 105 Q22 105 24 95 Z'
                    fill='#FFFFFF'
                    stroke='#94A3B8'
                    strokeWidth='1.5'
                  />
                  <path
                    d='M140 90 Q148 90 146 105 Q138 105 136 95 Z'
                    fill='#FFFFFF'
                    stroke='#94A3B8'
                    strokeWidth='1.5'
                  />

                  <path
                    d='M34 32 Q46 28 52 38 Z'
                    fill='#93C5FD'
                    stroke='#60A5FA'
                    strokeWidth='1'
                  />
                  <path
                    d='M126 32 Q114 28 108 38 Z'
                    fill='#93C5FD'
                    stroke='#60A5FA'
                    strokeWidth='1'
                  />

                  <path
                    d='M34 318 Q46 322 50 312 Z'
                    fill='#FCA5A5'
                    stroke='#F87171'
                    strokeWidth='1'
                  />
                  <path
                    d='M126 318 Q114 322 110 312 Z'
                    fill='#FCA5A5'
                    stroke='#F87171'
                    strokeWidth='1'
                  />

                  <rect
                    x='12'
                    y='55'
                    width='10'
                    height='35'
                    rx='3'
                    fill='#1E293B'
                  />
                  <rect
                    x='138'
                    y='55'
                    width='10'
                    height='35'
                    rx='3'
                    fill='#1E293B'
                  />
                  <rect
                    x='12'
                    y='240'
                    width='10'
                    height='35'
                    rx='3'
                    fill='#1E293B'
                  />
                  <rect
                    x='138'
                    y='240'
                    width='10'
                    height='35'
                    rx='3'
                    fill='#1E293B'
                  />
                </svg>

                <div className='absolute left-[38%] top-[20%] flex size-4 items-center justify-center'>
                  <span className='absolute size-4 animate-ping rounded-full bg-primary/40' />
                  <span className='size-2.5 rounded-full bg-primary ring-2 ring-white' />
                </div>
                <div className='absolute left-[18%] top-[38%] flex size-4 items-center justify-center'>
                  <span className='size-2.5 rounded-full bg-primary ring-2 ring-white' />
                </div>
                <div className='absolute left-[18%] top-[76%] flex size-4 items-center justify-center'>
                  <span className='size-2.5 rounded-full bg-primary ring-2 ring-white' />
                </div>
                <div className='absolute right-[18%] top-[20%] flex size-4 items-center justify-center'>
                  <span className='size-2.5 rounded-full bg-primary ring-2 ring-white' />
                </div>
                <div className='absolute right-[18%] top-[76%] flex size-4 items-center justify-center'>
                  <span className='size-2.5 rounded-full bg-primary ring-2 ring-white' />
                </div>
                <div className='absolute left-[50%] top-[48%] -translate-x-1/2 flex size-4 items-center justify-center'>
                  <span className='size-2.5 rounded-full bg-primary ring-2 ring-white' />
                </div>
              </div>
            </div>

            <div className='space-y-6'>
              {INSPECTION_POINTS.right.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className='flex items-center gap-3.5 group'
                  >
                    <div className='flex size-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100/80 bg-blue-50/50 text-primary transition-colors group-hover:bg-primary group-hover:text-white'>
                      <Icon className='size-5' />
                    </div>
                    <div>
                      <h3 className='text-sm font-bold text-slate-900'>
                        {item.title}
                      </h3>
                      <p className='text-xs text-slate-500 mt-0.5'>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <div className='flex flex-col justify-center items-center rounded-3xl h-fit my-auto border border-blue-100/70 bg-linear-to-b from-[#F3F8FF] to-white p-7 text-center shadow-xs'>
          <div className='flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-white text-primary shadow-xs'>
            <ShieldCheck className='size-7 stroke-[1.75]' />
          </div>

          <h3 className='mt-5 text-base font-bold text-slate-900'>
            Revisión independiente y objetiva
          </h3>

          <p className='mt-3 text-xs leading-relaxed text-slate-500'>
            Nuestros técnicos no tienen vinculación con vendedores o
            concesionarios.
          </p>
        </div>
      </div>
    </section>
  );
};
