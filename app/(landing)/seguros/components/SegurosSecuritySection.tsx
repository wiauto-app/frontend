import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRAND_BLUE, CONFIDENZA_WEBSITE, SECURITY_POINTS } from '../constants';

export function SegurosSecuritySection() {
  return (
    <section className='py-10 sm:py-6 bg-gray-50'>
      <div className='container-custom mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div>
            <h2 className='text-3xl font-extrabold text-slate-900 sm:text-4xl '>
              Tu seguridad es nuestra prioridad
            </h2>
            <p className='mt-3 text-base leading-relaxed text-slate-600 '>
              Seguros Confianza cuenta con más de 30 años de experiencia
              protegiendo a miles de conductores en todo el país.
            </p>

            <div className='mt-8 space-y-3'>
              {SECURITY_POINTS.map((point) => (
                <div key={point} className='flex items-center gap-3'>
                  <CheckCircle2
                    className='size-5 shrink-0'
                    style={{ color: BRAND_BLUE }}
                  />
                  <span className='text-sm font-medium text-slate-700'>
                    {point}
                  </span>
                </div>
              ))}
            </div>

            <Button
              className='mt-8 rounded-md inline-flex items-center text-sm font-semibold '
              style={{ backgroundColor: BRAND_BLUE }}
            >
              <Link
                href={CONFIDENZA_WEBSITE}
                className='p-4 flex flex-row gap-2'
              >
                Conoce más en su sitio web
                <ExternalLink className='size-4' />
              </Link>
            </Button>
          </div>
          <div className='relative'>
            <div className='aspect-[4/3] rounded-2xl overflow-hidden'>
              <Image
                src='https://images.unsplash.com/photo-1549399549-7997468684?auto=format&fit=crop&q=80&w=800'
                alt='Family with car'
                fill
                className='object-cover'
              />
            </div>
            <div className='absolute bottom-4 right-4 bg-slate-900 text-white p-4 rounded-xl max-w-xs'>
              <p className='font-semibold'>
                Nuestro compromiso es simple: estar contigo en cada kilómetro.
              </p>
              <p className='text-sm opacity-90 mt-2'>Seguros Confianza</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
