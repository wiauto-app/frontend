import { HOW_IT_WORKS_STEPS } from '../constants';

export const HowItWorks = () => {
  return (
    <section className=''>
      <div className='mx-auto max-w-2xl text-center'>
        <h2 className='text-xl font-black tracking-tight text-slate-900 sm:text-xl'>
          Cómo funciona
        </h2>
      </div>

      <div className='relative mx-auto max-w-6xl'>
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 relative'>
          {HOW_IT_WORKS_STEPS.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className='relative flex items-center gap-3.5'
              >
                <div className='flex size-9 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-white text-sm font-bold text-primary shadow-xs'>
                  {step.step}
                </div>

                <div className='flex size-13 shrink-0 items-center justify-center rounded-2xl border border-blue-100/80 bg-blue-50/40 text-primary'>
                  <Icon className='size-6 stroke-[1.75]' />
                </div>
                <div className='min-w-0 flex-1'>
                  <h3 className='text-xs sm:text-sm font-bold text-slate-900'>
                    {step.title}
                  </h3>
                  <p className='mt-1 text-[11px] leading-relaxed text-slate-500'>
                    {step.description}
                  </p>
                </div>

                {idx < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className='hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 w-6 border-t-2 border-dotted border-slate-200' />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
