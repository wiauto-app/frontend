/**
 * Convierte entradas de precio/km al estilo España (12.500, 4.400) a entero.
 * Sin esto, `Number("12.500")` → 12.5 y acaba en error de BD o precio erróneo.
 */
export const parseEuroIntegerInput = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return undefined;
    }
    return Math.round(value);
  }

  const raw = String(value).trim();
  if (!raw) {
    return undefined;
  }

  const hasComma = raw.includes(",");
  const hasDot = raw.includes(".");

  let normalized = raw.replace(/\s/g, "");

  if (hasComma && hasDot) {
    const lastComma = normalized.lastIndexOf(",");
    const lastDot = normalized.lastIndexOf(".");
    if (lastComma > lastDot) {
      normalized = normalized.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = normalized.replace(/,/g, "");
    }
  } else if (hasComma) {
    const parts = normalized.split(",");
    if (parts.length === 2 && parts[1].length <= 2) {
      normalized = `${parts[0].replace(/\./g, "")}.${parts[1]}`;
    } else {
      normalized = normalized.replace(/,/g, "");
    }
  } else if (hasDot) {
    const parts = normalized.split(".");
    if (parts.length === 2 && parts[1].length <= 2) {
      normalized = normalized;
    } else {
      normalized = normalized.replace(/\./g, "");
    }
  }

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return Math.round(parsed);
};
