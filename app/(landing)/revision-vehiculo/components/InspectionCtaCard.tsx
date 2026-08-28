import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const InspectionCtaCard = () => {
  return (
    <section className='relative mt-8 overflow-hidden bg-[#07122f] shadow-[0_24px_80px_rgba(7,18,47,.18)]'>
      <div className='absolute inset-y-0 right-0 w-full overflow-hidden md:w-3/5'>
        <Image
          src='/cta-rear-car.jpg'
          alt=''
          fill
          className='object-cover object-center opacity-90'
          sizes='100vw'
          aria-hidden
        />
        <div className='absolute inset-0 bg-linear-to-r from-[#07122f] via-[#07122f]/85 to-[#07122f]/10 md:via-[#07122f]/65' />
      </div>

      <div className='relative z-10 grid grid-cols-1 items-center gap-8 px-7 py-12 sm:px-12 sm:py-14 lg:grid-cols-[1.3fr_auto]'>
        <div className='max-w-xl text-white'>
          <p className='mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#ff8b37]'>
            Wiauto × NeedCarHelp
          </p>
          <h2 className='text-2xl font-black leading-tight tracking-[-0.035em] text-white sm:text-3xl'>
            Si el coche merece la pena, que lo demuestre.
          </h2>
          <p className='mt-3 max-w-md text-xs leading-relaxed text-white/60 sm:text-sm'>
            Una revisión a tiempo puede evitar gastos inesperados y darte una
            posición mucho más fuerte para negociar.
          </p>
          <div className='mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
            <a
              href='https://needcarhelp.es/'
              className='inline-flex h-12 items-center gap-2 bg-[#ff7517] px-6 text-sm font-black text-white shadow-xl transition-all hover:bg-[#ff8735] active:scale-95'
            >
              Solicitar ahora
              <ArrowRight className='size-4 shrink-0' />
            </a>

            <div className='flex items-center gap-2 text-white/80'>
              <CheckCircle2 className='size-4 text-[#ff8b37]' />
              <span className='whitespace-nowrap text-xs font-medium'>
                Coordinación sencilla y segura
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
