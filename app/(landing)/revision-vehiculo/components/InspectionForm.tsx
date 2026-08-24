'use client';

import { useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { SPANISH_PROVINCES } from '../constants';
import {
  buildInspectionPayload,
  createInspectionDefaultValues,
  inspectionSchema,
  type InspectionFormValues,
} from '../schemas/inspection.schema';

const inputClassName =
  'h-12 rounded-xl border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400';

const selectTriggerClassName = `${inputClassName} w-full`;

export const InspectionForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InspectionFormValues>({
    resolver: standardSchemaResolver(
      inspectionSchema
    ) as Resolver<InspectionFormValues>,
    defaultValues: createInspectionDefaultValues(),
  });

  const handleSubmit = async (values: InspectionFormValues) => {
    setIsLoading(true);
    try {
      const payload = buildInspectionPayload(values);
      // TODO: conectar con el endpoint de inspección
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log(payload);
      toast.success(
        'Solicitud recibida. Te contactaremos para agendar la inspección.'
      );
      form.reset();
    } catch {
      toast.error('No se pudo enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id='solicitar-inspeccion' className='py-6 lg:py-10'>
      <div className='rounded-3xl border-0 bg-white shadow-[0_4px_25px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 p-6 sm:p-9'>
        <h2 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl mb-6'>
          Solicita una inspección
        </h2>

        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <FieldGroup className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-0 space-y-0'>
            <Controller
              name='listingUrl'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='ins-url'>URL del anuncio</FieldLabel>
                  <Input
                    {...field}
                    id='ins-url'
                    type='url'
                    placeholder='https://www.ejemplo.com/anuncio/12345'
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                    className={inputClassName}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name='plate'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='ins-plate'>Matrícula</FieldLabel>
                  <Input
                    {...field}
                    id='ins-plate'
                    type='text'
                    placeholder='1234 ABC'
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                    maxLength={10}
                    className={`${inputClassName} font-semibold tracking-wider uppercase`}
                    onChange={(event) =>
                      field.onChange(event.target.value.toUpperCase())
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name='province'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className='sm:col-span-2 lg:col-span-1'
                >
                  <FieldLabel htmlFor='ins-province'>Provincia</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      ref={field.ref}
                      id='ins-province'
                      aria-invalid={fieldState.invalid}
                      className={selectTriggerClassName}
                    >
                      <SelectValue placeholder='Selecciona una provincia' />
                    </SelectTrigger>
                    <SelectContent>
                      {SPANISH_PROVINCES.map((prov) => (
                        <SelectItem key={prov} value={prov}>
                          {prov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-0 space-y-0'>
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='ins-name'>Nombre</FieldLabel>
                  <Input
                    {...field}
                    id='ins-name'
                    type='text'
                    placeholder='Tu nombre'
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                    autoComplete='name'
                    className={inputClassName}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name='phone'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='ins-phone'>Teléfono</FieldLabel>
                  <Input
                    {...field}
                    id='ins-phone'
                    type='tel'
                    placeholder='600 123 456'
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                    autoComplete='tel'
                    className={inputClassName}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className='sm:col-span-2 lg:col-span-1'
                >
                  <FieldLabel htmlFor='ins-email'>Email</FieldLabel>
                  <Input
                    {...field}
                    id='ins-email'
                    type='email'
                    placeholder='tu@email.com'
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                    autoComplete='email'
                    className={inputClassName}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <div className='flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between'>
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
              disabled={isLoading}
              className='h-12 w-full sm:w-auto px-8 rounded-xl bg-primary text-sm font-bold text-white shadow-md hover:bg-primary/95 transition-all'
            >
              {isLoading ? (
                <span className='flex items-center gap-2'>
                  <span className='size-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                  Enviando...
                </span>
              ) : (
                <>
                  Solicitar revisión
                  <ArrowRight className='ml-1.5 size-4' />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
