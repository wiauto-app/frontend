import { HOW_IT_WORKS_STEPS } from '../constants';

export const HowItWorks = () => {
  return (
    <section className='bg-[#eef2f7] py-20 sm:py-28'>
      <div className='container-custom'>
        <div className='grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-16'>
          <div>
            <p className='mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#0755e9]'>
              De anuncio a informe
            </p>
            <h2 className='text-3xl font-black leading-[1.05] tracking-[-0.045em] text-[#0a1738] sm:text-5xl'>
              Tú eliges el coche. Nosotros despejamos las dudas.
            </h2>
          </div>

          <div className='grid grid-cols-1 border-t border-slate-300 sm:grid-cols-2'>
          {HOW_IT_WORKS_STEPS.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className='group relative min-h-52 border-b border-slate-300 p-6 sm:border-r sm:p-8 [&:nth-child(2n)]:border-r-0'
              >
                <div className='flex items-start justify-between'>
                  <span className='text-5xl font-black tracking-[-0.06em] text-[#0a1738]/10'>
                    0{step.step}
                  </span>
                  <div className='flex size-11 items-center justify-center rounded-full bg-white text-[#0755e9] shadow-sm transition-transform duration-300 group-hover:-translate-y-1'>
                    <Icon className='size-5' />
                  </div>
                </div>
                <h3 className='mt-7 text-base font-black text-[#0a1738]'>{step.title}</h3>
                <p className='mt-2 text-xs leading-5 text-slate-500'>{step.description}</p>
                {idx === 0 && <span className='absolute left-0 top-0 h-1 w-16 bg-[#ff7517]' />}
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
};
