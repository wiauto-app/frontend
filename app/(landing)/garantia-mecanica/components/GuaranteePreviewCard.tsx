import Image from 'next/image';
import {
  CheckCircle2,
  Clock,
  Coins,
  Shield,
  ShieldCheck,
} from 'lucide-react';

export const GuaranteePreviewCard = () => {
  return (
    <div className='w-full max-w-[430px] overflow-hidden rounded-3xl bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 ring-border'>
      {/* Header inside card */}
      <div className='flex items-center justify-between pb-3 border-b border-slate-100/60'>
        <span className='text-xl font-black tracking-tight text-primary'>
          Wi<span className='text-slate-900'>Auto</span>
        </span>
        <span className='text-[11px] font-medium text-slate-400'>
          Garantía mecánica
        </span>
      </div>

      {/* Car details row */}
      <div className='mt-4 flex items-center gap-4'>
        <div className='relative h-24 w-36 shrink-0'>
          <Image
            src='/sample-corolla.jpg'
            alt='Toyota Corolla'
            fill
            className='object-contain'
            sizes='150px'
            priority
          />
        </div>

        <div className='flex-1 min-w-0'>
          <h3 className='text-base font-bold text-slate-900 truncate'>
            Toyota Corolla
          </h3>
          <p className='text-xs text-slate-500 font-medium mt-0.5'>
            1.8 Hybrid Active
          </p>
          <p className='text-[11px] text-slate-400 mt-0.5'>
            2019 · Híbrido · 122 CV
          </p>

          <div className='mt-2 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-800 shadow-2xs'>
            <span className='size-2 rounded-full bg-blue-600' />
            1234 ABC
          </div>
        </div>
      </div>

      {/* 3 Metric Pills */}
      <div className='mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-2.5 text-center'>
        <div className='p-1'>
          <div className='flex items-center justify-center gap-1 text-[10px] text-slate-400'>
            <Clock className='size-3' />
            <span>Duración</span>
          </div>
          <p className='mt-0.5 text-xs font-bold text-slate-900'>24 meses</p>
        </div>

        <div className='p-1 border-x border-slate-200/70'>
          <div className='flex items-center justify-center gap-1 text-[10px] text-slate-400'>
            <ShieldCheck className='size-3' />
            <span>Desde</span>
          </div>
          <p className='mt-0.5 text-xs font-bold text-slate-900'>29,90 € <span className='text-[10px] font-normal text-slate-400'>/mes</span></p>
        </div>

        <div className='p-1'>
          <div className='flex items-center justify-center gap-1 text-[10px] text-slate-400'>
            <Coins className='size-3' />
            <span>Sin franquicia</span>
          </div>
          <p className='mt-0.5 text-xs font-bold text-slate-900'>0 €</p>
        </div>
      </div>

      {/* Cobertura destacada checklist */}
      <div className='mt-4 p-1'>
        <p className='text-xs font-bold text-slate-900 mb-2.5'>
          Cobertura destacada
        </p>

        <div className='grid grid-cols-2 gap-x-2 gap-y-2 text-[11px] text-slate-600'>
          <div className='flex items-center gap-1.5'>
            <CheckCircle2 className='size-3.5 shrink-0 text-emerald-500 fill-emerald-500 text-white' />
            <span className='truncate'>Motor y sus componentes</span>
          </div>

          <div className='flex items-center gap-1.5'>
            <CheckCircle2 className='size-3.5 shrink-0 text-emerald-500 fill-emerald-500 text-white' />
            <span className='truncate'>Sistema de climatización</span>
          </div>

          <div className='flex items-center gap-1.5'>
            <CheckCircle2 className='size-3.5 shrink-0 text-emerald-500 fill-emerald-500 text-white' />
            <span className='truncate'>Caja de cambios manual o aut.</span>
          </div>

          <div className='flex items-center gap-1.5'>
            <CheckCircle2 className='size-3.5 shrink-0 text-emerald-500 fill-emerald-500 text-white' />
            <span className='truncate'>Dirección y suspensión</span>
          </div>

          <div className='flex items-center gap-1.5'>
            <CheckCircle2 className='size-3.5 shrink-0 text-emerald-500 fill-emerald-500 text-white' />
            <span className='truncate'>Sistema eléctrico y electr.</span>
          </div>

          <div className='flex items-center gap-1.5'>
            <CheckCircle2 className='size-3.5 shrink-0 text-emerald-500 fill-emerald-500 text-white' />
            <span className='truncate'>Y mucho más</span>
          </div>
        </div>
      </div>

      {/* Bottom guarantee footer banner */}
      <div className='mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-50/70 py-3 text-xs font-bold text-primary'>
        <ShieldCheck className='size-4 text-primary' />
        Protegemos lo importante para que sigas avanzando.
      </div>
    </div>
  );
};
