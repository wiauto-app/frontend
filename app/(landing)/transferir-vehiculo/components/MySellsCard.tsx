'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { MY_SELL } from '../constants';

export const MySellsCard = () => {
  return (
    <section className='rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.06)] ring-1 ring-slate-100'>
      <div className='grid gap-6 lg:grid-cols-[1fr_auto] items-center'>
        {/* Left – description */}
        <div className='flex flex-col gap-3 max-w-sm'>
          <h2 className='text-lg font-bold text-slate-900 leading-snug'>
            ¿Has vendido el coche en{' '}
            <span className='text-primary'>WiAuto</span>?
          </h2>
          <p className='text-sm leading-relaxed text-slate-500'>
            Si vendiste el vehículo a través de WiAuto, podemos iniciar la
            transferencia con los datos de la compraventa ya verificados.
          </p>
          <button
            type='button'
            className='mt-1 inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50'
          >
            Ver mis ventas
          </button>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 min-w-0 sm:min-w-[380px]'>
          <div className='relative shrink-0'>
            <div className='relative h-24 w-36'>
              <Image
                src={MY_SELL.image}
                alt={MY_SELL.model}
                fill
                className='object-contain'
                sizes='150px'
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <span className='absolute -top-2 -left-2 inline-flex items-center rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow'>
              {MY_SELL.badge}
            </span>
          </div>

          <div className='flex-1 min-w-0'>
            <p className='text-sm font-bold text-slate-900'>{MY_SELL.model}</p>
            <p className='text-xs text-slate-500 mt-0.5'>{MY_SELL.version}</p>
            <div className='mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500'>
              <span>Matrícula: {MY_SELL.plate}</span>
              <span>·</span>
              <span>Año: {MY_SELL.year}</span>
              <span>·</span>
              <span>{MY_SELL.km}</span>
            </div>
            <p className='mt-1 text-[11px] text-slate-500'>
              Comprador:{' '}
              <span className='font-semibold text-slate-700'>
                {MY_SELL.buyer}
              </span>
            </p>

            <button
              type='button'
              className='mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-primary/90'
            >
              Transferir este vehículo
              <ArrowRight className='size-3.5' />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
