export const emptyToUndefined = <T,>(
  values?: T[],
): T[] | undefined => (values && values.length > 0 ? values : undefined);
