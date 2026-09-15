import { z } from "zod";

/** Letras de control DNI/NIE (España). */
const DNI_CONTROL_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

const normalizeDni = (value: string): string =>
  value.trim().toUpperCase().replace(/[\s.-]/g, "");

/**
 * Valida DNI (8 dígitos + letra) o NIE (X/Y/Z + 7 dígitos + letra).
 */
export const isValidSpanishDniOrNie = (raw: string): boolean => {
  const value = normalizeDni(raw);
  const dniMatch = /^(\d{8})([A-Z])$/.exec(value);
  if (dniMatch) {
    const number = Number(dniMatch[1]);
    const letter = dniMatch[2];
    return DNI_CONTROL_LETTERS[number % 23] === letter;
  }

  const nieMatch = /^([XYZ])(\d{7})([A-Z])$/.exec(value);
  if (!nieMatch) {
    return false;
  }

  const prefixMap: Record<string, string> = { X: "0", Y: "1", Z: "2" };
  const number = Number(`${prefixMap[nieMatch[1]]}${nieMatch[2]}`);
  const letter = nieMatch[3];
  return DNI_CONTROL_LETTERS[number % 23] === letter;
};

export const spanishDniSchema = z
  .string()
  .trim()
  .min(1, "El DNI es obligatorio")
  .refine(isValidSpanishDniOrNie, {
    message: "Introduce un DNI o NIE válido",
  });
