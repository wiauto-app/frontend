import { Card, CardContent } from '@/components/ui/card';
import { GUARANTEE_BENEFITS } from '../constants';

export const GuaranteeBenefits = () => {
  return (
    <section className='py-6 lg:py-2'>
      <div className='mx-auto max-w-2xl text-center mb-8 sm:mb-2'>
        <h2 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
          Más que una garantía, tu tranquilidad
        </h2>
      </div>

      <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
        {GUARANTEE_BENEFITS.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <Card
              key={benefit.title}
              className='rounded-2xl border-0 bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.05)] ring-1 ring-slate-100 transition-all hover:shadow-md'
            >
              <CardContent className='flex items-center gap-4 p-0'>
                <div className='flex size-12 shrink-0 items-center justify-center rounded-2xl border border-blue-100/80 bg-blue-50/50 text-primary'>
                  <Icon className='size-6 stroke-[1.75]' />
                </div>

                <div className='min-w-0 flex-1'>
                  <h3 className='text-sm sm:text-base font-bold text-slate-900 leading-tight'>
                    {benefit.title}
                  </h3>
                  <p className='mt-1.5 text-xs leading-relaxed text-slate-500'>
                    {benefit.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
