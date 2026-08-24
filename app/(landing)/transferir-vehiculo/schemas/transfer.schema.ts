import z from "zod";

const SPANISH_PLATE_REGEX = /^\d{4}[\s-]?[A-Z]{3}$/;
const PHONE_REGEX = /^\+?[\d\s.-]{9,17}$/;

export const transferSchema = z.object({
  plate: z
    .string()
    .min(1, { error: "Ingresa la matrícula del vehículo." })
    .regex(SPANISH_PLATE_REGEX, {
      error: "Formato no válido. Ejemplo: 1234 ABC.",
    }),
  sellerName: z
    .string()
    .min(1, { error: "Ingresa el nombre del vendedor." })
    .min(3, { error: "El nombre debe tener al menos 3 caracteres." }),
  buyerName: z
    .string()
    .min(1, { error: "Ingresa el nombre del comprador." })
    .min(3, { error: "El nombre debe tener al menos 3 caracteres." }),
  email: z.email({ error: "Ingresa un email válido." }),
  phone: z
    .string()
    .min(1, { error: "Ingresa tu teléfono." })
    .regex(PHONE_REGEX, { error: "Ingresa un teléfono válido." }),
  province: z.string().min(1, { error: "Selecciona una provincia." }),
  acceptPrivacy: z.boolean().refine((value) => value, {
    error: "Debes aceptar la política de privacidad.",
  }),
});

export type TransferFormValues = z.infer<typeof transferSchema>;
export type TransferPayload = TransferFormValues;

export const createTransferDefaultValues = (): TransferFormValues => ({
  plate: "",
  sellerName: "",
  buyerName: "",
  email: "",
  phone: "",
  province: "",
  acceptPrivacy: false,
});

export const buildTransferPayload = (
  values: TransferFormValues,
): TransferPayload => ({
  ...values,
});
