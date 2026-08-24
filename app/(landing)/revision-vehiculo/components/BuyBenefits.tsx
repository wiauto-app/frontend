import { Card, CardContent } from '@/components/ui/card';
import { BUY_BENEFITS } from '../constants';

export const BuyBenefits = () => {
  return (
    <section className='py-6 lg:py-2'>
      <div className='mx-auto max-w-2xl text-center mb-8 sm:mb-10'>
        <h2 className='text-xl font-black tracking-tight text-slate-900 sm:text-xl'>
          Compra sabiendo realmente qué estás comprando
        </h2>
      </div>

      <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
        {BUY_BENEFITS.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <Card
              key={benefit.title}
              className='rounded-2xl border-0 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)] ring-1 ring-slate-100 transition-all hover:shadow-md'
            >
              <CardContent className='p-0'>
                <div className='flex size-12 items-center justify-center rounded-2xl border border-blue-100/80 bg-blue-50/50 text-primary'>
                  <Icon className='size-6 stroke-[1.75]' />
                </div>

                <h3 className='mt-4 text-base font-bold text-slate-900'>
                  {benefit.title}
                </h3>

                <p className='mt-2 text-xs leading-relaxed text-slate-500'>
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
