export const DEFAULT_NEWS_PAGE_SIZE = 9;

export const parseNewsSearchParams = (raw: {
  category?: string;
  page?: string;
  page_size?: string;
}) => ({
  category_slug: raw.category?.trim() || undefined,
  page: Math.max(1, Number(raw.page) || 1),
  page_size: Math.max(1, Number(raw.page_size) || DEFAULT_NEWS_PAGE_SIZE),
});
