import Image from 'next/image';
import { ArrowUpRight, BadgeCheck, Check } from 'lucide-react';

import { BUY_BENEFITS } from '../constants';

export const BuyBenefits = () => {
  return (
    <section className='bg-white py-20 sm:py-28'>
      <div className='container-custom'>
        <div className='grid items-center gap-12 lg:grid-cols-[.88fr_1.12fr] lg:gap-20'>
          <div>
            <p className='mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#0755e9]'>
              Una alianza que te protege
            </p>
            <h2 className='max-w-lg text-3xl font-black leading-[1.05] tracking-[-0.045em] text-[#0a1738] sm:text-5xl'>
              Tu próxima decisión, respaldada por dos especialistas.
            </h2>
            <p className='mt-6 max-w-xl text-base leading-7 text-slate-600'>
              Wiauto te ayuda a encontrar el coche. NeedCarHelp lo examina con
              criterio técnico e independiente. Juntos convertimos la duda en
              una decisión informada.
            </p>

            <div className='mt-9 grid gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3'>
              {BUY_BENEFITS.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div key={benefit.title} className='border-l-2 border-[#ff7a1a] pl-4'>
                    <Icon className='mb-3 size-5 text-[#0755e9]' />
                    <h3 className='text-sm font-black text-[#0a1738]'>{benefit.title}</h3>
                    <p className='mt-2 text-xs leading-5 text-slate-500'>{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='relative pb-8'>
            <div className='relative aspect-[4/3] overflow-hidden bg-slate-200'>
              <Image
                src='/mechanic-inspection.jpg'
                alt='Especialista comprobando el estado exterior de un coche'
                fill
                className='object-cover'
                sizes='(max-width: 1024px) 100vw, 560px'
              />
              <div className='absolute inset-0 bg-linear-to-t from-[#06112d]/65 via-transparent to-transparent' />
              <div className='absolute bottom-6 left-6 right-6 flex items-end justify-between text-white'>
                <div>
                  <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-white/60'>Revisión profesional</p>
                  <p className='mt-1 text-lg font-black'>Sin intereses en la compraventa.</p>
                </div>
                <ArrowUpRight className='hidden size-7 sm:block' />
              </div>
            </div>

            <div className='absolute -bottom-4 -left-4 w-[88%] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(7,18,47,.14)] sm:-left-8 sm:w-80'>
              <div className='flex items-center gap-3'>
                <div className='flex size-11 shrink-0 items-center justify-center rounded-full bg-[#eaf1ff] text-[#0755e9]'>
                  <BadgeCheck className='size-6' />
                </div>
                <div>
                  <p className='text-sm font-black text-[#0a1738]'>Informe claro, no un jeroglífico</p>
                  <p className='mt-0.5 text-xs text-slate-500'>Fotos, diagnóstico y próximos pasos.</p>
                </div>
              </div>
              <div className='mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-[11px] font-semibold text-slate-600'>
                {['Daños visibles', 'Diagnosis', 'Prueba dinámica'].map((item) => (
                  <span key={item} className='flex items-center gap-1.5'>
                    <Check className='size-3 text-[#ff7a1a]' /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
