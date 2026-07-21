import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRAND_BLUE, CONFIDENZA_WEBSITE, SECURITY_POINTS } from '../constants';

export function SegurosSecuritySection() {
  return (
    <section className=' bg-gray-50 rounded-2xl'>
      <div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8 items-center'>
          <div className='py-10 sm:py-6 px-6 md:px-10 md:col-span-1'>
            <h2 className='text-3xl font-extrabold text-slate-900 sm:text-2xl '>
              Tu seguridad es nuestra prioridad
            </h2>
            <p className='mt-3 text-base leading-relaxed text-slate-600 '>
              Seguros Confianza cuenta con más de 30 años de experiencia
              protegiendo a miles de conductores en todo el país.
            </p>

            <div className='mt-8 space-y-1'>
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
          <div className='md:col-span-2 relative py-10 sm:py-3 h-full'>
            <div className='aspect-4/2 rounded-2xl overflow-hidden h-full'>
              <Image
                src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000'
                alt='Family with car'
                fill
                className='object-cover rounded-2xl'
              />
            </div>
            <div className='hidden md:flex absolute flex-col items-start gap-3 top-1/2 -translate-y-1/2 right-16 bg-slate-900 text-white p-6 rounded-xl w-64'>
              <ExternalLink className='size-4' />
              <p className='font-semibold text-left text-sm leading-snug'>
                &quot;Nuestro compromiso es simple: estar contigo en cada kilómetro.&quot;
              </p>
              <div className='w-full h-1 rounded-full bg-white/20'>
                <div className='w-1/5 h-full rounded-full bg-white' />
              </div>
              <p className='text-xs opacity-90 text-left'>Seguros Confianza</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
