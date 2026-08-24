import { TRANSFER_STEPS } from '../constants';

export const TransferSteps = () => {
  return (
    <section className='py-6 lg:py-2'>
      <div className='mx-auto max-w-2xl text-center mb-8 sm:mb-10'>
        <h2 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
          Transferir tu coche en 4 pasos
        </h2>
      </div>

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {TRANSFER_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === TRANSFER_STEPS.length - 1;

          return (
            <div
              key={step.number}
              className='relative flex flex-col items-center text-center gap-3'
            >
              {!isLast && (
                <div
                  className='absolute top-7 left-[calc(50%+2.5rem)] hidden h-px w-[calc(100%-5rem)] border-t-2 border-dashed border-slate-200 lg:block'
                  aria-hidden
                />
              )}

              <div className='relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white font-black text-lg shadow-md'>
                {step.number}
                <div className='absolute -bottom-2 -right-2 flex size-6 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm text-primary'>
                  <Icon className='size-3.5' />
                </div>
              </div>

              <div>
                <h3 className='text-sm font-bold text-slate-900'>
                  {step.title}
                </h3>
                <p className='mt-1 text-[11px] leading-relaxed text-slate-500 max-w-[180px] mx-auto'>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
