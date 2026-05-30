import { API_URL } from "@/constants";

interface FetchOptions extends RequestInit {
  isFileUpload?: boolean;
  isFormData?: boolean;
}

export interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data: T;
}

export const fetchWithAuth = async (url: string, options: FetchOptions = {}) => {
  const isFormDataBody =
    options.body instanceof FormData ||
    options.isFormData ||
    options.isFileUpload;

  const headers = new Headers(options.headers as HeadersInit);
  if (!isFormDataBody && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });
};

const parseJson = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) return null as T;
  const text = await response.text();
  if (!text) return null as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
};

const toApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const body = await parseJson<{ ok?: boolean; status?: number; data: T }>(response);
  const data = body.data;
  return { ok: response.ok, status: response.status, data };
};

export const apiGet = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  const response = await fetchWithAuth(endpoint);
  return toApiResponse<T>(response);
};

export const apiPost = async <T>(
  endpoint: string,
  data?: unknown,
): Promise<ApiResponse<T>> => {
  const isFormData = data instanceof FormData;
  const response = await fetchWithAuth(endpoint, {
    method: 'POST',
    body: isFormData ? data : data !== undefined ? JSON.stringify(data) : undefined,
    ...(isFormData ? { isFormData: true as const } : {}),
  });
  return toApiResponse<T>(response);
};

/** POST que devuelve un Blob (p. ej. PDF). */
export const apiPostBlob = async (
  endpoint: string,
  data?: unknown,
): Promise<ApiResponse<Blob>> => {
  const response = await fetchWithAuth(endpoint, {
    method: 'POST',
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
  const blob = await response.blob();
  return { ok: response.ok, status: response.status, data: blob };
};

export const apiPut = async <T>(
  endpoint: string,
  data: unknown,
): Promise<ApiResponse<T>> => {
  const response = await fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return toApiResponse<T>(response);
};

export const apiPatch = async <T>(
  endpoint: string,
  data: unknown,
): Promise<ApiResponse<T>> => {
  const response = await fetchWithAuth(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return toApiResponse<T>(response);
};

export const apiDelete = async <T = null>(
  endpoint: string,
): Promise<ApiResponse<T>> => {
  const response = await fetchWithAuth(endpoint, {
    method: 'DELETE',
  });
  return toApiResponse<T>(response);
};
