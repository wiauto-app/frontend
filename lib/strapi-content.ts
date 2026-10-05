/**
 * Contenido de respaldo con la misma forma que un componente de Strapi,
 * sin `id` y con todo opcional. Los componentes repetibles (arrays) también
 * son parciales; los bloques de texto enriquecido (nodos con `type`) van enteros.
 * Un array con contenido se toma entero.
 */
export type StrapiFallback<T> = T extends readonly (infer U)[]
  ? [U] extends [{ type: string }]
    ? T
    : [U] extends [object]
      ? StrapiFallback<U>[]
      : T
  : T extends object
    ? {
        [K in keyof T as K extends "id" ? never : K]?: StrapiFallback<
          NonNullable<T[K]>
        > | null;
      }
    : T;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isEmpty = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

const mergeWithFallback = (data: unknown, fallback: unknown): unknown => {
  if (isEmpty(data)) {
    return fallback ?? data;
  }

  if (isPlainObject(data) && isPlainObject(fallback)) {
    const merged: Record<string, unknown> = { ...data };
    for (const key of Object.keys(fallback)) {
      merged[key] = mergeWithFallback(data[key], fallback[key]);
    }
    return merged;
  }

  return data;
};

/**
 * Completa la respuesta de Strapi con el contenido de respaldo sin cambiar su forma:
 * cada valor vacío (`null`, `undefined`, `""`, `[]`) se reemplaza por el del respaldo.
 */
export const withStrapiFallback = <T>(
  data: T | null | undefined,
  fallback: StrapiFallback<T>,
): T => mergeWithFallback(data, fallback) as T;
