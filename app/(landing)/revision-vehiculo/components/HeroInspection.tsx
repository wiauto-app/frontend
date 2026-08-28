import Image from 'next/image';
import {
  ArrowDown,
  ArrowRight,
  Check,
  FileCheck2,
  ShieldCheck,
} from 'lucide-react';

export const HeroInspection = () => {
  return (
    <section className='relative isolate min-h-[680px] overflow-hidden bg-[#07122f] text-white lg:min-h-[720px]'>
      <Image
        src='/mechanic-inspection.jpg'
        alt='Técnico realizando una revisión profesional de un vehículo'
        fill
        className='z-0 object-cover object-[64%_center]'
        sizes='100vw'
        priority
      />
      <div className='absolute inset-0 z-10 bg-[linear-gradient(90deg,#07122f_0%,rgba(7,18,47,.96)_38%,rgba(7,18,47,.55)_66%,rgba(7,18,47,.16)_100%)]' />
      <div className='absolute inset-0 z-10 bg-[linear-gradient(0deg,#07122f_0%,transparent_36%)]' />
      <div className='absolute inset-0 z-10 opacity-15 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:72px_72px]' />

      <div className='container-custom relative z-20 flex min-h-[680px] flex-col justify-between py-14 lg:min-h-[720px] lg:py-18'>
        <div className='max-w-2xl'>
          <div className='mb-10 flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em]'>
            <span className='rounded-full bg-white px-4 py-2 text-[#0755e9]'>
              Wiauto
            </span>
            <span className='text-[#ff7a1a]'>×</span>
            <span className='rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white backdrop-blur-md'>
              NeedCarHelp
            </span>
            <span className='text-white/45'>Colaboración oficial</span>
          </div>

          <p className='mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#ff8b37]'>
            <span className='h-px w-9 bg-[#ff7a1a]' />
            Revisión antes de comprar
          </p>
          <h1 className='max-w-xl text-[2.7rem] font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl'>
            El coche puede parecer perfecto.
            <span className='mt-2 block text-[#ff8b37]'>Nosotros lo comprobamos.</span>
          </h1>
          <p className='mt-7 max-w-lg text-base leading-7 text-white/72 sm:text-lg'>
            Wiauto y NeedCarHelp unen tecnología y experiencia mecánica para
            que conozcas el estado real del vehículo antes de tomar una decisión.
          </p>

          <div className='mt-9 flex flex-col gap-3 sm:flex-row'>
              <a
                href='https://needcarhelp.es/'
                className='inline-flex h-13 items-center justify-center rounded-none bg-[#ff7517] px-7 text-sm font-black text-white shadow-[0_16px_40px_rgba(255,117,23,.28)] transition-all hover:-translate-y-0.5 hover:bg-[#ff8735]'
              >
                Solicitar revisión
                <ArrowRight className='ml-2 size-4' />
              </a>
              <a
                href='#puntos-revision'
                className='inline-flex h-13 items-center justify-center gap-2 border border-white/25 bg-white/5 px-7 text-sm font-bold text-white transition-colors hover:bg-white/12'
              >
                Ver qué revisamos <ArrowDown className='size-4' />
              </a>
          </div>
        </div>

        <div className='mt-12 grid border-y border-white/15 sm:grid-cols-3'>
          {[
            { icon: ShieldCheck, value: '+200', label: 'puntos de control' },
            { icon: FileCheck2, value: '24–48 h', label: 'informe detallado' },
            { icon: Check, value: 'Objetiva', label: 'valoración independiente' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className='flex items-center gap-4 border-white/15 px-1 py-5 sm:border-r sm:px-6 last:border-r-0'>
              <Icon className='size-5 text-[#ff8b37]' />
              <div>
                <p className='text-lg font-black text-white'>{value}</p>
                <p className='text-[11px] uppercase tracking-[0.16em] text-white/50'>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
