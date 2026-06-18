export const toUrlSearchParams = (
  search_params: Record<string, string | string[] | undefined>,
): URLSearchParams => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(search_params)) {
    if (value === undefined) {
      continue;
    }
    if (Array.isArray(value)) {
      params.set(key, value.join(","));
      continue;
    }
    params.set(key, value);
  }

  return params;
};
