import Image from 'next/image';
import { AlertTriangle, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { REPORT_CHECKS, SAMPLE_VEHICLE } from '../constants';

export const VehicleHero = () => {
  return (
    <section className='py-4 lg:py-8'>
      <Card className='overflow-hidden border-0 bg-white py-0  rounded-3xl'>
        <CardContent className='p-0'>
          <div className='grid grid-cols-1 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 lg:grid-cols-[1.8fr_1.3fr_1.1fr]'>
            {/* Column 1: Header + Landscape/Car banner + Info + Tags */}
            <div className='p-5 sm:p-7 flex flex-col justify-between'>
              <div>
                <h2 className='text-lg sm:text-xl font-bold tracking-tight text-slate-900'>
                  Informe del vehículo
                </h2>

                <div className='relative mt-4 flex flex-col sm:flex-row items-center sm:items-center min-h-[140px] rounded-2xl overflow-hidden bg-slate-50/50 sm:bg-slate-50/30 p-3 sm:p-3'>
                  {/* Subtle road landscape background on the left */}
                  <div className='absolute inset-0 sm:w-2/3 overflow-hidden pointer-events-none'>
                    <Image
                      src='/road-landscape-bg.jpg'
                      alt=''
                      fill
                      className='object-cover object-left opacity-25 sm:opacity-30'
                      aria-hidden
                    />
                    <div className='absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white sm:bg-gradient-to-r sm:from-transparent sm:via-white/70 sm:to-white' />
                  </div>

                  {/* Car image */}
                  <div className='relative z-10 w-44 sm:w-48 shrink-0 flex items-center justify-center'>
                    <div className='relative h-24 sm:h-28 w-full'>
                      <Image
                        src={SAMPLE_VEHICLE.heroImage}
                        alt={`${SAMPLE_VEHICLE.make} ${SAMPLE_VEHICLE.model}`}
                        fill
                        className='object-contain'
                        sizes='192px'
                        priority
                      />
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className='relative z-10 flex-1 min-w-0 text-center sm:text-left pt-2 sm:pt-0 sm:pl-3'>
                    <p className='text-base sm:text-lg font-bold text-slate-900 leading-snug truncate'>
                      {SAMPLE_VEHICLE.make} {SAMPLE_VEHICLE.model}
                    </p>
                    <p className='text-xs text-slate-500 font-medium mt-0.5 truncate'>
                      {SAMPLE_VEHICLE.variant}
                    </p>
                    <p className='text-[11px] text-slate-400 mt-0.5 whitespace-nowrap'>
                      {SAMPLE_VEHICLE.year} · Híbrido · {SAMPLE_VEHICLE.power}
                    </p>
                    <p className='text-[11px] text-slate-500 mt-1 whitespace-nowrap'>
                      Matrícula:{' '}
                      <span className='font-semibold text-slate-800'>
                        1234 LXY
                      </span>
                    </p>
                    <p className='text-[10px] text-slate-400 mt-0.5 whitespace-nowrap'>
                      VIN: {SAMPLE_VEHICLE.vin}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags/Badges */}
              <div className='flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-4'>
                <span className='inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 font-medium shadow-2xs'>
                  🇪🇸 España
                </span>
                <span className='inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 font-medium shadow-2xs'>
                  Particular
                </span>
                <span className='inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 font-medium shadow-2xs'>
                  Segmento C
                </span>
              </div>
            </div>

            {/* Column 2: Checklist Items */}
            <div className='p-6 sm:p-7 flex flex-col justify-center space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xs'>
                  <CheckCircle2 className='size-3.5 fill-emerald-500 text-white' />
                </div>
                <div>
                  <p className='text-xs font-bold text-slate-900 leading-tight'>
                    Identificación verificada
                  </p>
                  <p className='text-[11px] text-slate-400 mt-0.5'>
                    Matrícula y VIN coinciden
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xs'>
                  <CheckCircle2 className='size-3.5 fill-emerald-500 text-white' />
                </div>
                <div>
                  <p className='text-xs font-bold text-slate-900 leading-tight'>
                    Registros de kilometraje
                  </p>
                  <p className='text-[11px] text-slate-400 mt-0.5'>
                    7 registros encontrados
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xs'>
                  <CheckCircle2 className='size-3.5 fill-emerald-500 text-white' />
                </div>
                <div>
                  <p className='text-xs font-bold text-slate-900 leading-tight'>
                    Datos técnicos disponibles
                  </p>
                  <p className='text-[11px] text-slate-400 mt-0.5'>
                    Equipamiento y especificaciones
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <div className='mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-2xs'>
                  <span className='text-[11px] font-bold'>!</span>
                </div>
                <div>
                  <p className='text-xs font-bold text-amber-700 leading-tight'>
                    1 incidencia encontrada
                  </p>
                  <p className='text-[11px] text-slate-400 mt-0.5'>
                    Consulta los detalles en el informe
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Action Button and Assurance */}
            <div className='p-6 sm:p-7 flex flex-col items-center justify-center gap-3 text-center'>
              <Button
                size='lg'
                className='h-12 w-full max-w-[220px] rounded-xl bg-primary text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all'
              >
                Ver informe completo &gt;
              </Button>
              <div className='flex items-center gap-1.5 text-xs text-slate-500'>
                <Lock className='size-3.5 shrink-0 text-slate-400' />
                <span>Pago 100% seguro</span>
              </div>
              <p className='text-[11px] text-slate-400'>
                Recibe el informe al instante en PDF
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
