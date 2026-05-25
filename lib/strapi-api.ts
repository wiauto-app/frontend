import { STRAPI_API_URL, STRAPI_TOKEN } from "@/constants/strapi.constants";

const buildStrapiUrl = (endpoint: string): string => {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${STRAPI_API_URL}/api${path}`;
};

const parseStrapiError = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as {
      error?: { message?: string };
      message?: string;
    };
    return body.error?.message ?? body.message ?? response.statusText;
  } catch {
    return response.statusText;
  }
};

export const getStrapiData = async <T>(endpoint: string): Promise<T> => {
  
  const response = await fetch(buildStrapiUrl(endpoint), {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const message = await parseStrapiError(response);
    throw new Error(`Strapi GET failed: ${response.status} ${message}`);
  }

  return response.json() as Promise<T>;
};

export const postStrapiData = async <TResponse, TBody extends Record<string, unknown>>(
  endpoint: string,
  body: { data: TBody },
): Promise<TResponse> => {
  const response = await fetch(buildStrapiUrl(endpoint), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await parseStrapiError(response);
    throw new Error(`Strapi POST failed: ${response.status} ${message}`);
  }

  return response.json() as Promise<TResponse>;
};

export const putStrapiData = async <TResponse, TBody extends Record<string, unknown>>(
  endpoint: string,
  body: { data: TBody },
): Promise<TResponse> => {
  const response = await fetch(buildStrapiUrl(endpoint), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await parseStrapiError(response);
    throw new Error(`Strapi PUT failed: ${response.status} ${message}`);
  }

  return response.json() as Promise<TResponse>;
};