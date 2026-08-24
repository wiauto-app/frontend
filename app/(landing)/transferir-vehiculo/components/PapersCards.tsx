import { Card, CardContent } from '@/components/ui/card';
import { PAPERS } from '../constants';

export const PapersCards = () => {
  return (
    <section className='py-6 lg:py-2'>
      <div className='mx-auto max-w-2xl text-center mb-8 sm:mb-10'>
        <h2 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
          Nosotros nos encargamos del papeleo
        </h2>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {PAPERS.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              className='h-full rounded-2xl border-0 bg-white py-0 shadow-[0_2px_12px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition-all hover:shadow-md'
            >
              <CardContent className='flex h-full flex-col items-center p-5 text-center'>
                <div className='flex size-12 items-center justify-center rounded-2xl border border-blue-100/80 bg-blue-50/50 text-primary'>
                  <Icon className='size-6 stroke-[1.75]' />
                </div>
                <h3 className='mt-3 text-sm font-bold text-slate-900'>
                  {item.title}
                </h3>
                <p className='mt-1.5 text-[11px] leading-relaxed text-slate-500'>
                  {item.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
