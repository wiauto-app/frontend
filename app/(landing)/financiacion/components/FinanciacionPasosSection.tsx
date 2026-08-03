import React from 'react';
import type { StrapiFinanciacionSteps } from '@/interfaces/strapi-components.interface';
import { FinanciacionSimuladorCard } from './FinanciacionSimuladorCard';
import { resolveStrapiIconName } from '@/app/(public)/simulador-financiamiento/utils/resolveStrapiIconName';
import { IconContainer } from '@/components/ui/iconContainer';
import { Car, Calculator, FileText, CheckCircle2, Disc } from 'lucide-react';

interface FinanciacionPasosSectionProps {
  data: StrapiFinanciacionSteps;
}

const ICONOS_POR_POSICION = [Car, Calculator, FileText, CheckCircle2, Disc];

export const FinanciacionPasosSection = ({
  data,
}: FinanciacionPasosSectionProps) => {
  const headerTitle = data?.header?.titulo || 'Así de fácil es financiar';
  const headerDesc = data?.header?.descripcion;

  const steps = data?.steps?.filter((item) => item.label?.trim()) ?? [];

  return (
    <section id='simulador' className='py-6'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
        {/* Izquierda: Pasos de Financiación */}
        <div className='lg:col-span-6 flex flex-col justify-between h-full'>
          <div>
            <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
              {headerTitle}
            </h2>
            {headerDesc && (
              <p className='text-xs sm:text-sm text-slate-500 mt-1 mb-8'>
                {headerDesc}
              </p>
            )}

            {steps.length > 0 && (
              <div
                className='relative grid gap-1.5 mt-4'
                style={{
                  gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
                }}
              >
                <div className='absolute top-4 left-[8%] right-[8%] h-0.5 border-t-2 border-dashed border-slate-200 z-0' />

                {steps.map((step, index) => {
                  const StrapiIcon = step.iconName
                    ? resolveStrapiIconName(step.iconName)
                    : null;

                  const FallbackIcon =
                    ICONOS_POR_POSICION[index % ICONOS_POR_POSICION.length];

                  return (
                    <div
                      key={step.id || index}
                      className='relative z-10 flex flex-col items-center text-center group'
                    >
                      <span className='size-7 rounded-full bg-slate-600 text-white text-[11px] font-extrabold flex items-center justify-center shadow-xs mb-2.5'>
                        {index + 1}
                      </span>
                      <div className='size-11 rounded-xl bg-white border border-slate-100/90 text-slate-600 flex items-center justify-center mb-2 shadow-xs group-hover:border-slate-200 transition-colors'>
                        {StrapiIcon ? (
                          <IconContainer Icon={StrapiIcon} justIcon />
                        ) : (
                          <FallbackIcon className='size-5 text-blue-600' />
                        )}
                      </div>

                      <h4 className='text-[10px] sm:text-[11px] font-bold text-slate-800 leading-tight'>
                        {step.label}
                      </h4>

                      {step.descripcion && (
                        <p className='text-[8px] sm:text-[9px] text-slate-400 leading-tight mt-1 hidden sm:block'>
                          {step.descripcion}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className='lg:col-span-6'>
          <FinanciacionSimuladorCard />
        </div>
      </div>
    </section>
  );
};
