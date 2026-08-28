import { Check, FileText, ShieldCheck } from 'lucide-react';

import { INSPECTION_POINTS } from '../constants';

export const InspectionPoints = () => {
  const points = [...INSPECTION_POINTS.left, ...INSPECTION_POINTS.right];

  return (
    <section id='puntos-revision' className='relative bg-[#07122f] py-20 text-white sm:py-28'>
      <div className='absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:24px_24px]' />
      <div className='container-custom relative'>
        <div className='flex flex-col justify-between gap-8 lg:flex-row lg:items-end'>
          <div>
            <p className='mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#ff8b37]'>
              Nada se queda en la superficie
            </p>
            <h2 className='max-w-2xl text-3xl font-black leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl'>
              Más de 200 comprobaciones. Una respuesta sencilla.
            </h2>
          </div>
          <p className='max-w-sm text-sm leading-6 text-white/55'>
            De la diagnosis electrónica a la prueba de conducción: revisamos el
            vehículo como si fuéramos a comprarlo nosotros.
          </p>
        </div>

        <div className='mt-14 grid overflow-hidden border border-white/15 sm:grid-cols-2 lg:grid-cols-4'>
          {points.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className='group relative min-h-44 border-b border-white/15 p-6 transition-colors hover:bg-white/[.07] sm:border-r lg:min-h-48 [&:nth-child(2n)]:sm:border-r-0 [&:nth-child(4n)]:lg:border-r-0 [&:nth-last-child(-n+2)]:sm:border-b-0 [&:nth-last-child(-n+4)]:lg:border-b-0'
              >
                <div className='flex items-start justify-between'>
                  <span className='text-[10px] font-bold tracking-[0.2em] text-white/30'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Icon className='size-6 text-[#ff8b37] transition-transform duration-300 group-hover:scale-110' />
                </div>
                <h3 className='mt-10 text-lg font-black text-white'>{item.title}</h3>
                <p className='mt-1 text-xs leading-5 text-white/50'>{item.description}</p>
              </article>
            );
          })}
        </div>

        <div className='mt-8 grid gap-4 lg:grid-cols-[1.2fr_.8fr]'>
          <div className='flex flex-col justify-between gap-8 bg-[#0d2353] p-7 sm:flex-row sm:items-center sm:p-9'>
            <div className='flex items-start gap-4'>
              <FileText className='mt-1 size-7 shrink-0 text-[#ff8b37]' />
              <div>
                <h3 className='text-lg font-black'>Un informe pensado para decidir</h3>
                <p className='mt-2 max-w-xl text-sm leading-6 text-white/55'>
                  Hallazgos clasificados, fotografías, estimación de próximos gastos
                  y una recomendación final sin letra pequeña.
                </p>
              </div>
            </div>
            <div className='flex shrink-0 flex-wrap gap-3'>
              {['Fotos', 'Prioridades', 'Conclusión'].map((label) => (
                <span key={label} className='flex items-center gap-1.5 border border-white/15 px-3 py-2 text-[11px] font-bold text-white/70'>
                  <Check className='size-3 text-[#ff8b37]' /> {label}
                </span>
              ))}
            </div>
          </div>

          <div className='flex items-center gap-5 border border-white/15 p-7 sm:p-9'>
            <div className='flex size-14 shrink-0 items-center justify-center rounded-full bg-[#ff7517]'>
              <ShieldCheck className='size-7' />
            </div>
            <div>
              <h3 className='text-base font-black'>Independiente y objetiva</h3>
              <p className='mt-2 text-xs leading-5 text-white/50'>
                La revisión no depende del vendedor ni del concesionario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
