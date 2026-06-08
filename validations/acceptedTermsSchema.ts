import { z } from "zod";

export const acceptedTermsSchema = z.boolean().refine((value) => value, {
  message: "Debes aceptar los términos y condiciones",
});
