import { z } from "zod";

import type { StrapiCampoMensajes } from "@/interfaces/strapi-content-props.interface";

/** Schema del código de respaldo 2FA con mensajes opcionales de `formulario.campo`. */
export const createBackupCodeSchema = (
  mensajes?: Partial<StrapiCampoMensajes> | null,
) =>
  z.object({
    code: z.string().regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/, {
      message:
        mensajes?.mensaje_invalido || "El código debe tener el formato XXXX-XXXX.",
    }),
  });

export const backupCodeSchema = createBackupCodeSchema();

export type BackupCodeSchema = z.infer<typeof backupCodeSchema>;

export const formatBackupCode = (rawValue: string): string => {
  const normalized = rawValue.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (normalized.length <= 4) {
    return normalized;
  }
  return `${normalized.slice(0, 4)}-${normalized.slice(4, 8)}`;
};
