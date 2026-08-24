import z from 'zod';

const SPANISH_PLATE_REGEX = /^\d{4}[\s-]?[A-Z]{3}$/;
const PHONE_REGEX = /^\+?[\d\s.-]{9,17}$/;

export const inspectionSchema = z.object({
  listingUrl: z.url({ error: 'Ingresa la URL del anuncio.' }),
  plate: z
    .string()
    .min(1, { error: 'Ingresa la matrícula del vehículo.' })
    .regex(SPANISH_PLATE_REGEX, {
      error: 'Formato no válido. Ejemplo: 1234 ABC.',
    }),
  province: z.string().min(1, { error: 'Selecciona una provincia.' }),
  name: z
    .string()
    .trim()
    .min(1, { error: 'Ingresa tu nombre.' })
    .min(3, { error: 'El nombre debe tener al menos 3 caracteres.' }),
  phone: z
    .string()
    .trim()
    .min(1, { error: 'Ingresa tu teléfono.' })
    .regex(PHONE_REGEX, { error: 'Ingresa un teléfono válido.' }),
  email: z.email({ error: 'Ingresa un email válido.' }),
});

export type InspectionFormValues = z.infer<typeof inspectionSchema>;
export type InspectionPayload = InspectionFormValues;

export const createInspectionDefaultValues = (): InspectionFormValues => ({
  listingUrl: '',
  plate: '',
  province: '',
  name: '',
  phone: '',
  email: '',
});

export const buildInspectionPayload = (
  values: InspectionFormValues,
): InspectionPayload => ({
  ...values,
});
