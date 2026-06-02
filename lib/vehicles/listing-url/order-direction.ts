export type OrderDirection = "ASC" | "DESC";
export type UrlOrderDirection = "asc" | "desc";

export const normalizeOrderDirection = (
  value: string | undefined | null,
): OrderDirection | undefined => {
  if (value === undefined || value === null || value.trim() === "") {
    return undefined;
  }

  const upper = value.trim().toUpperCase();
  if (upper === "ASC" || upper === "DESC") {
    return upper;
  }

  return undefined;
};

export const orderDirectionToUrlSegment = (
  direction: OrderDirection,
): UrlOrderDirection => (direction === "ASC" ? "asc" : "desc");

export const orderDirectionFromUrlSegment = (
  segment: string,
): OrderDirection | undefined => normalizeOrderDirection(segment);
