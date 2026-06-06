const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

const parsePositiveInt = (
  value: string | undefined,
  fallback: number,
  max?: number,
): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  if (max !== undefined && parsed > max) {
    return max;
  }

  return parsed;
};

export const parsePressSearchParams = (params: {
  page?: string;
  page_size?: string;
}) => ({
  page: parsePositiveInt(params.page, DEFAULT_PAGE),
  page_size: parsePositiveInt(params.page_size, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
});
