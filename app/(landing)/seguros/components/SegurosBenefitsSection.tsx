import {
  Shield,
  User,
  Zap,
  Laptop,
  MapPinned,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BRAND_BLUE, BRAND_BLUE_LIGHT, BENEFITS } from '../constants';

const ICON_MAP: Record<(typeof BENEFITS)[number]['icon'], LucideIcon> = {
  shield: Shield,
  user: User,
  zap: Zap,
  laptop: Laptop,
  map: MapPinned,
};

export function SegurosBenefitsSection() {
  return (
    <section className='bg-white  sm:py-6 '>
      <div className='container-custom mx-auto bg-gray-50 rounded-2xl pt-8 px-4 sm:px-6'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-2xl font-extrabold text-slate-900 sm:text-4xl'>
            Más que un seguro, tu tranquilidad
          </h2>
          <p className='mt-3 text-slate-500'>
            Beneficios exclusivos por ser parte de WiAuto.
          </p>
        </div>

        <div className='mx-auto mt-2 grid grid-cols-2 gap-4 md:grid-cols-5'>
          {BENEFITS.map((benefit) => {
            const Icon = ICON_MAP[benefit.icon];

            return (
              <Card
                key={benefit.title}
                className='rounded-2xl border-0 bg-transparent shadow-none ring-0'
              >
                <CardContent className='flex flex-col items-center md:p-6 text-center'>
                  <div
                    className='flex size-12 items-center justify-center rounded-full'
                    style={{
                      backgroundColor: BRAND_BLUE_LIGHT,
                      color: BRAND_BLUE,
                    }}
                  >
                    <Icon className='size-7' />
                  </div>
                  <h3 className='mt-4 text-md font-bold text-slate-900'>
                    {benefit.title}
                  </h3>
                  <p className='mt-2 text-sm leading-relaxed text-slate-500'>
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
