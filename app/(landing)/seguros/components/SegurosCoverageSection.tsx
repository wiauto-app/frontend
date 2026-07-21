import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BRAND_BLUE, COVERAGE_ITEMS } from '../constants';

export function SegurosCoverageSection() {
  return (
    <section className='bg-white  sm:py-6'>
      <div className='container-custom mx-auto bg-gray-50 rounded-2xl pt-8 px-4 sm:px-6'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-2xl font-extrabold text-slate-900 sm:text-4xl'>
            ¿Qué cubre tu seguro?
          </h2>
          <p className='mt-3 text-slate-500'>
            Protección diseñada para lo que realmente importa.
          </p>
        </div>

        <div className='grid grid-cols-2 gap-2 md:grid-cols-6'>
          {COVERAGE_ITEMS.map((item) => (
            <Card
              key={item}
              className='rounded-2xl border-0 bg-transparent shadow-none ring-0'
            >
              <CardContent className='flex items-center gap-3 p-5'>
                <CheckCircle2
                  className='size-5 shrink-0'
                  style={{ color: BRAND_BLUE }}
                />
                <span className='text-sm font-medium text-slate-700'>
                  {item}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
