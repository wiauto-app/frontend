export const normalizeLicensePlate = (raw: string): string =>
  raw.trim().toUpperCase().replace(/\s+/g, "");

/** Formato de matrícula española (1234ABC o A1234BC). No acepta cadena vacía. */
export const isSpanishLicensePlateFormat = (raw: string): boolean => {
  const value = normalizeLicensePlate(raw);
  if (!value) {
    return false;
  }

  return (
    /^\d{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/.test(value) ||
    /^[A-Z]{1,2}\d{4}[A-Z]{1,2}$/.test(value)
  );
};

/** Matrícula española; cadena vacía es válida (campos opcionales). */
export const isValidSpanishLicensePlate = (raw: string): boolean => {
  const value = normalizeLicensePlate(raw);
  if (!value) {
    return true;
  }

  return isSpanishLicensePlateFormat(raw);
};
