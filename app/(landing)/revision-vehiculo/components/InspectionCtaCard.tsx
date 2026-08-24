import Image from 'next/image';
import { ArrowRight, Search } from 'lucide-react';

export const InspectionCtaCard = () => {
  return (
    <section className='relative overflow-hidden rounded-3xl bg-[#0052CC] shadow-xl '>
      <div className='absolute inset-y-0 right-0 w-full md:w-3/5 overflow-hidden'>
        <Image
          src='/cta-rear-car.jpg'
          alt=''
          fill
          className='object-cover object-center opacity-85'
          sizes='100vw'
          aria-hidden
        />
        <div className='absolute inset-0 bg-linear-to-r from-[#0052CC] via-[#0052CC]/85 to-transparent md:via-[#0052CC]/60' />
      </div>

      <div className='relative z-10 grid grid-cols-1 items-center gap-8 px-6 py-12 sm:px-12 sm:py-4 lg:grid-cols-[1.3fr_auto]'>
        <div className='max-w-xl text-white'>
          <h2 className='text-md font-extrabold tracking-tight sm:text-xl lg:text-2xl text-white'>
            Compra con confianza. Conduce tranquilo.
          </h2>
          <p className='mt-3 text-xs leading-relaxed text-blue-100/90 sm:text-sm max-w-md'>
            Una pequeña inversión ahora puede ahorrarte miles de euros después.
            Deja que un profesional revise el coche por ti.
          </p>
          <div className='flex flex-col sm:flex-row items-center gap-4 mt-6'>
            <a
              href='#solicitar-inspeccion'
              className='inline-flex h-12 items-center gap-2 rounded-md bg-white px-6 text-sm font-bold text-primary shadow-xl transition-all hover:bg-blue-50 active:scale-95'
            >
              Solicita tu inspección ahora
              <ArrowRight className='size-4 shrink-0 text-primary' />
            </a>

            <div className='flex items-center gap-2 text-white/90'>
              <svg
                className='h-5 w-8 text-white/80'
                viewBox='0 0 32 20'
                fill='none'
                aria-hidden
              >
                <path
                  d='M28 4 C 18 4, 8 10, 4 16'
                  stroke='currentColor'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeDasharray='3 3'
                />
                <path
                  d='M4 16 L 3 10 M 4 16 L 10 17'
                  stroke='currentColor'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span className='text-xs font-medium text-white/90 whitespace-nowrap'>
                Fácil, rápido y seguro
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
