import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BRAND_BLUE, CONFIDENZA_WEBSITE } from '../constants';
import { ExternalLink } from 'lucide-react';

export function SegurosCtaSection() {
  return (
    <section
      className='rounded-2xl overflow-hidden'
      style={{ backgroundColor: BRAND_BLUE }}
    >
      <div className='container-custom mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 items-center'>
          <div className='py-8 sm:py-12 text-white px-6 sm:px-8 md:px-10'>
            <h2 className='text-xl font-extrabold leading-tight sm:text-4xl'>
              Cotiza y contrata tu seguro directamente con Seguros Confianza
            </h2>
            <p className='mt-4 text-base sm:text-lg text-blue-100'>
              Hazlo fácil, hazlo online, hazlo seguro.
            </p>
            <Button
              size='lg'
              className='mt-6 sm:mt-8 rounded-xl bg-white px-6 md:px-8 py-3 sm:py-4 font-bold hover:bg-blue-50'
              style={{ color: BRAND_BLUE }}
            >
              <Link
                href={CONFIDENZA_WEBSITE}
                className='flex items-center gap-2'
              >
                Conoce más en su sitio web
                <ExternalLink className='size-4' />
              </Link>
            </Button>
          </div>
          <div className='flex justify-center px-4 pb-6 md:pb-0'>
            <Image
              src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000'
              alt='White SUV car'
              height={250}
              width={400}
              className='w-full max-w-xs sm:max-w-sm md:max-w-none h-auto object-contain'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
