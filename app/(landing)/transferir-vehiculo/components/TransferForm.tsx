'use client';

import { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

import { FORM_BENEFITS, TRANSFER_PROVINCES } from '../constants';
import {
  buildTransferPayload,
  createTransferDefaultValues,
  transferSchema,
  type TransferFormValues,
} from '../schemas/transfer.schema';

const inputClassName =
  'h-10 rounded-lg border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-300 shadow-xs';

export const TransferForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TransferFormValues>({
    resolver: standardSchemaResolver(
      transferSchema
    ) as Resolver<TransferFormValues>,
    defaultValues: createTransferDefaultValues(),
  });

  const handleSubmit = async (values: TransferFormValues) => {
    setIsLoading(true);
    try {
      const payload = buildTransferPayload(values);
      // TODO: conectar con el endpoint de transferencia
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log(payload);
      toast.success(
        'Solicitud recibida. Te contactaremos para iniciar el trámite.'
      );
      form.reset();
    } catch {
      toast.error('No se pudo enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.06)]'>
      <div className='grid gap-8 lg:grid-cols-[1fr_2fr] items-start'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-lg font-bold text-slate-900 leading-snug'>
            Inicia la transferencia
          </h2>
          <p className='text-sm text-slate-500 leading-relaxed'>
            Completa los datos para comenzar el trámite. Te guiamos en cada
            paso.
          </p>

          <ul className='flex flex-col gap-2.5 mt-2'>
            {FORM_BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <li
                  key={b.text}
                  className='flex items-start gap-2.5 text-[12px] text-slate-600'
                >
                  <div className='mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/5 text-primary'>
                    <Icon className='size-3' />
                  </div>
                  {b.text}
                </li>
              );
            })}
          </ul>
        </div>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          noValidate
          className='flex flex-col gap-4'
        >
          <FieldGroup className='grid grid-cols-1 gap-4 sm:grid-cols-3 p-0'>
            <Controller
              name='plate'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='tf-plate'>Matrícula</FieldLabel>
                  <Input
                    {...field}
                    id='tf-plate'
                    type='text'
                    placeholder='1234 ABC'
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                    autoComplete='off'
                    className={`${inputClassName} uppercase`}
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
              name='sellerName'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='tf-seller'>Nombre del vendedor</FieldLabel>
                  <Input
                    {...field}
                    id='tf-seller'
                    type='text'
                    placeholder='Nombre y apellidos'
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
              name='buyerName'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='tf-buyer'>Nombre del comprador</FieldLabel>
                  <Input
                    {...field}
                    id='tf-buyer'
                    type='text'
                    placeholder='Nombre y apellidos'
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
          </FieldGroup>

          <FieldGroup className='grid grid-cols-1 gap-4 sm:grid-cols-3 p-0'>
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='tf-email'>Email</FieldLabel>
                  <Input
                    {...field}
                    id='tf-email'
                    type='email'
                    placeholder='ejemplo@correo.com'
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

            <Controller
              name='phone'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='tf-phone'>Teléfono</FieldLabel>
                  <Input
                    {...field}
                    id='tf-phone'
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
              name='province'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='tf-province'>Provincia</FieldLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      ref={field.ref}
                      id='tf-province'
                      aria-invalid={fieldState.invalid}
                      className={`${inputClassName} w-full`}
                    >
                      <SelectValue placeholder='Selecciona provincia' />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSFER_PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
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

          <Controller
            name='acceptPrivacy'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <label className='flex items-start gap-2.5 cursor-pointer'>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    disabled={isLoading}
                    className='mt-0.5'
                  />
                  <span className='text-[11px] text-slate-500 leading-relaxed'>
                    He leído y acepto la{' '}
                    <a href='#' className='text-primary hover:underline'>
                      Política de privacidad
                    </a>{' '}
                    y las{' '}
                    <a href='#' className='text-primary hover:underline'>
                      Condiciones del servicio
                    </a>
                    .
                  </span>
                </label>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
            <Button
              type='submit'
              disabled={isLoading}
              className='inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-md transition hover:bg-primary/90 active:scale-[0.98]'
            >
              {isLoading ? (
                <span className='flex items-center gap-2'>
                  <span className='size-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                  Enviando...
                </span>
              ) : (
                <>
                  Iniciar trámite
                  <ArrowRight className='size-4' />
                </>
              )}
            </Button>
            <p className='flex items-center gap-1.5 text-[11px] text-slate-400'>
              <Lock className='size-3' />
              Tus datos están protegidos y solo se utilizarán para gestionar tu
              trámite.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};
