'use client';

import { useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SPANISH_PROVINCES } from '../constants';

export const InspectionForm = () => {
  const [formData, setFormData] = useState({
    url: '',
    plate: '',
    province: '',
    name: '',
    phone: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: conectar con flujo de envio de formulario
  };

  return (
    <section id='solicitar-inspeccion' className='py-6 lg:py-10'>
      <Card className='rounded-3xl border-0 bg-white shadow-[0_4px_25px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 p-6 sm:p-9'>
        <CardContent className='p-0'>
          <h2 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl mb-6'>
            Solicita una inspección
          </h2>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <div className='space-y-2'>
                <label className='text-xs font-semibold text-slate-700'>
                  URL del anuncio
                </label>
                <Input
                  type='url'
                  placeholder='https://www.ejemplo.com/anuncio/12345'
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  className='h-12 rounded-xl border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary'
                />
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-semibold text-slate-700'>
                  Matrícula
                </label>
                <Input
                  type='text'
                  placeholder='1234 ABC'
                  value={formData.plate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plate: e.target.value.toUpperCase(),
                    })
                  }
                  className='h-12 rounded-xl border-slate-200 bg-white text-xs sm:text-sm font-semibold tracking-wider text-slate-900 placeholder:text-slate-400 uppercase focus-visible:ring-primary'
                  maxLength={10}
                />
              </div>

              <div className='space-y-2 sm:col-span-2 lg:col-span-1'>
                <label className='text-xs font-semibold text-slate-700'>
                  Provincia
                </label>
                <div className='relative'>
                  <select
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    className='flex h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'
                  >
                    <option value='' disabled>
                      Selecciona una provincia
                    </option>
                    {SPANISH_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                  <div className='pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400'>
                    <svg className='size-4 fill-current' viewBox='0 0 20 20'>
                      <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <div className='space-y-2'>
                <label className='text-xs font-semibold text-slate-700'>
                  Nombre
                </label>
                <Input
                  type='text'
                  placeholder='Tu nombre'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='h-12 rounded-xl border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary'
                />
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-semibold text-slate-700'>
                  Teléfono
                </label>
                <Input
                  type='tel'
                  placeholder='600 123 456'
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className='h-12 rounded-xl border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary'
                />
              </div>

              <div className='space-y-2 sm:col-span-2 lg:col-span-1'>
                <label className='text-xs font-semibold text-slate-700'>
                  Email
                </label>
                <Input
                  type='email'
                  placeholder='tu@email.com'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className='h-12 rounded-xl border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-primary'
                />
              </div>
            </div>
            <div className='flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex items-center gap-2.5 rounded-xl bg-blue-50/70 px-4 py-3 text-xs text-slate-600 sm:max-w-md'>
                <Info className='size-4 shrink-0 text-primary' />
                <span>
                  Te contactaremos para confirmar los detalles y agendar la
                  inspección.
                </span>
              </div>

              <Button
                type='submit'
                size='lg'
                className='h-12 w-full sm:w-auto px-8 rounded-xl bg-primary text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all'
              >
                Solicitar revisión
                <ArrowRight className='ml-1.5 size-4' />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
