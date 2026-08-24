import { PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PROTECTED_PARTS } from '../constants';

export const CarPartsGrid = () => {
  return (
    <section className='py-6 lg:py-2'>
      <div className='mx-auto max-w-2xl text-center mb-8 sm:mb-2'>
        <h2 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
          Tu coche protegido donde importa
        </h2>
      </div>

      <div className='grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6'>
        {PROTECTED_PARTS.map((part) => {
          const Icon = part.icon;

          return (
            <Card
              key={part.title}
              className='h-full rounded-2xl border-0 bg-white py-0 shadow-[0_2px_12px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition-all hover:shadow-md'
            >
              <CardContent className='flex h-full flex-col items-center p-4 text-center sm:p-5'>
                <div className='flex size-12 items-center justify-center rounded-2xl border border-blue-100/80 bg-blue-50/50 text-primary'>
                  <Icon className='size-6 stroke-[1.75]' />
                </div>

                <h3 className='mt-3 text-xs sm:text-sm font-bold text-slate-900'>
                  {part.title}
                </h3>

                <p className='mt-1.5 text-[11px] leading-relaxed text-slate-500'>
                  {part.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className='mt-6 text-center'>
        <button
          type='button'
          className='inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline'
        >
          <PlusCircle className='size-3.5' />
          Consulta el detalle completo de coberturas
        </button>
      </div>
    </section>
  );
};
