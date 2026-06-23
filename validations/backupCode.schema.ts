import { z } from "zod";

export const backupCodeSchema = z.object({
  code: z
    .string()
    .regex(/^[A-Z0-9]{4}-[A-Z0-9]{4}$/, {
      message: "El código debe tener el formato XXXX-XXXX.",
    }),
});

export type BackupCodeSchema = z.infer<typeof backupCodeSchema>;

export const formatBackupCode = (rawValue: string): string => {
  const normalized = rawValue.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (normalized.length <= 4) {
    return normalized;
  }
  return `${normalized.slice(0, 4)}-${normalized.slice(4, 8)}`;
};
