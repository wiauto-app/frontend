export const parseCommaList = (raw?: string): string[] => {
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

export const joinCommaList = (items: string[]): string | undefined => {
  if (items.length === 0) {
    return undefined;
  }
  return items.join(",");
};

export const parseOptionalNumber = (raw?: string): number | undefined => {
  if (!raw) {
    return undefined;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
};
