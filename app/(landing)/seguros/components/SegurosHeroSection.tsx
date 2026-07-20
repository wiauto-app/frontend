import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Clock,
  MapPinned,
  Globe,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  BRAND_BLUE,
  CONFIDENZA_RATING,
  CONFIDENZA_REVIEWS,
  CONFIDENZA_WEBSITE,
  HERO_FEATURES,
} from '../constants';

const FEATURE_ICONS = [Shield, Clock, MapPinned, Globe];

export function SegurosHeroSection() {
  return (
    <section className='relative overflow-hidden rounded-2xl'>
      <div className='absolute inset-0'>
        <Image
          src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000'
          alt='Car on road'
          fill
          className='object-cover'
          priority
        />
        <div
          className='absolute inset-0'
          style={{
            background: `linear-gradient(135deg, ${BRAND_BLUE}dd 0%, #0050c8dd 55%, #003d99dd 100%)`,
          }}
        />
      </div>

      <div className='absolute inset-0 opacity-10'>
        <div className='absolute -right-20 top-0 size-80 rounded-full bg-white blur-3xl' />
        <div className='absolute -left-10 bottom-0 size-64 rounded-full bg-white blur-3xl' />
      </div>

      <div className='container-custom relative z-10 mx-auto py-6 sm:py-8 px-6 sm:px-12 lg:px-16'>
        <div className='grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_340px] lg:gap-12'>
          <div className='max-w-2xl text-white'>
            <span className='inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100'>
              Compañía aliada
            </span>

            <h1 className='mt-5 text-4xl font-extrabold leading-tight sm:text-5xl'>
              Seguros Confianza
            </h1>

            <p className='mt-4 text-2xl font-semibold sm:text-3xl'>
              Protección que te acompaña{' '}
              <span className='text-blue-200'>siempre</span>
            </p>

            <p className='mt-4 max-w-xl text-base leading-relaxed text-blue-100 sm:text-lg'>
              En alianza con Seguros Confianza, te ofrecemos coberturas
              integrales, atención de calidad y respaldo cuando más lo
              necesitas.
            </p>

            <div className='mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4'>
              {HERO_FEATURES.map(({ label }, index) => {
                const Icon = FEATURE_ICONS[index] ?? Shield;
                return (
                  <div
                    key={label}
                    className='flex flex-row items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-center backdrop-blur-sm'
                  >
                    <Icon className='size-5 text-blue-100' />
                    <span className='text-xs font-semibold leading-tight sm:text-sm'>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            <Button
              asChild
              className='mt-6 px-8 py-4 rounded-md text-slate-900 inline-flex items-center gap-1.5 text-sm font-semibold bg-white hover:bg-blue-50'
            >
              <Link href={CONFIDENZA_WEBSITE} className='flex flex-row gap-1.5'>
                Conoce más en su sitio web
                <ExternalLink className='size-4' />
              </Link>
            </Button>
          </div>

          <Card className='mx-auto w-full max-w-sm rounded-2xl border-0 shadow-2xl lg:mx-0 lg:max-w-none'>
            <CardContent className='flex flex-col items-center p-6 text-center sm:p-8'>
              <div
                className='flex size-16 items-center justify-center rounded-2xl text-white'
                style={{ backgroundColor: BRAND_BLUE }}
              >
                <Shield className='size-8' />
              </div>

              <h2 className='mt-4 text-2xl font-extrabold text-slate-900'>
                Seguros Confianza
              </h2>
              <p className='mt-1 text-sm text-slate-500'>
                Tu tranquilidad, nuestro compromiso.
              </p>

              <div className='mt-5 flex items-center gap-2'>
                <span className='text-3xl font-extrabold text-slate-900'>
                  {CONFIDENZA_RATING}
                </span>
                <div className='text-left'>
                  <div className='flex gap-0.5'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className='size-4 fill-[#FFB800] text-[#FFB800]'
                      />
                    ))}
                  </div>
                  <p className='text-xs text-slate-500'>
                    ({CONFIDENZA_REVIEWS.toLocaleString('es-ES')} opiniones)
                  </p>
                </div>
              </div>

              <span className='mt-5 inline-flex rounded-full px-4 py-1.5 text-md font-bold text-slate-500'>
                Aliado oficial de WiAuto
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
