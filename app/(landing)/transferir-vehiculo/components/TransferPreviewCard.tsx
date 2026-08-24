import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

import { PREVIEW_STEPS } from '../constants';

export const TransferPreviewCard = () => {
  return (
    <div className='w-full max-w-[430px] overflow-hidden rounded-3xl bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100'>
      {/* Header */}
      <div className='flex items-center justify-between pb-3 border-b border-slate-100/60'>
        <span className='text-sm font-semibold text-slate-700'>
          Proceso de transferencia
        </span>
        <span className='text-[11px] font-medium text-slate-400'>
          ID de trámite: TR-458729
        </span>
      </div>

      {/* Car summary */}
      <div className='mt-4 flex items-center gap-4'>
        <div className='relative h-20 w-32 shrink-0'>
          <Image
            src='/sample-corolla.jpg'
            alt='Toyota Corolla'
            fill
            className='object-contain'
            sizes='128px'
            priority
          />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-sm font-bold text-slate-900'>Toyota Corolla</h3>
          <p className='text-xs text-slate-500 font-medium mt-0.5'>
            1.8 Hybrid Active
          </p>
          <div className='mt-2 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-800 shadow-2xs'>
            <span className='size-2 rounded-full bg-blue-600' />
            1234 ABC
          </div>
        </div>
      </div>

      {/* Steps list */}
      <div className='mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-100 overflow-hidden'>
        {PREVIEW_STEPS.map((step) => (
          <div
            key={step.number}
            className={`flex items-center justify-between px-4 py-3 ${step.status === 'active' ? 'bg-blue-50/60' : 'bg-white'}`}
          >
            <div className='flex items-center gap-3'>
              {step.status === 'done' ? (
                <CheckCircle2 className='size-5 shrink-0 text-primary fill-primary text-white' />
              ) : (
                <div
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    step.status === 'active'
                      ? 'bg-primary text-white'
                      : 'border border-slate-300 text-slate-400'
                  }`}
                >
                  {step.number}
                </div>
              )}
              <span
                className={`text-xs font-medium ${
                  step.status === 'active'
                    ? 'text-primary font-semibold'
                    : step.status === 'done'
                      ? 'text-slate-700'
                      : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            <span
              className={`text-[10px] font-semibold ${
                step.status === 'active'
                  ? 'text-primary'
                  : step.status === 'done'
                    ? 'text-emerald-600'
                    : 'text-slate-400'
              }`}
            >
              {step.status === 'done'
                ? 'Completado'
                : step.status === 'active'
                  ? 'En curso'
                  : 'Pendiente'}
            </span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className='mt-4 flex items-center gap-2 rounded-xl bg-blue-50/70 px-4 py-2.5 text-[11px] text-slate-500'>
        <CheckCircle2 className='size-3.5 shrink-0 text-primary' />
        Te informamos en cada paso del estado de tu trámite.
      </div>
    </div>
  );
};
