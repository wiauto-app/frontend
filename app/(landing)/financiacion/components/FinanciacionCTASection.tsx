import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export const FinanciacionCTASection = () => {
  return (
    <section className='bg-[#edf3fc]/90 border border-slate-100/80 rounded-[20px] px-6 py-4 sm:px-8 relative overflow-hidden flex items-center min-h-[110px]'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-4 w-full relative z-10'>
        <div className='flex flex-col gap-0.5 max-w-xl text-center md:text-left'>
          <h2 className='text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight'>
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className='text-[11px] sm:text-xs text-slate-600'>
            Simula tu financiación ahora y haz realidad tu próximo vehículo.
          </p>
        </div>

        <div className='shrink-0 my-auto'>
          <Link
            href='#simulador'
            className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all text-xs sm:text-sm'
          >
            Comenzar simulación
            <ArrowRight className='size-3.5' />
          </Link>
        </div>

        <div className='w-full md:w-auto flex justify-center md:justify-end shrink-0 -my-4 md:-mr-4'>
          <Image
            src='/car-cta.png'
            alt='Vehículo listo'
            className='w-44 sm:w-52 md:w-56 object-contain drop-shadow-md'
            width={240}
            height={120}
          />
        </div>
      </div>
    </section>
  );
};
