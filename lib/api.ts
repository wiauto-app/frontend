import { AUTH_ROUTES } from '@/constants/auth.constants';
import { authStorage } from '@/services/authStorage';

/** Base del Route Handler que reenvía al backend y adjunta el Bearer desde la cookie `access_token`. */
const PROXY_API_BASE = '/api/proxy';

/** En el navegador basta la ruta relativa; en Server Actions hace falta origen absoluto. */
const getOriginForProxy = (): string => {
  if (typeof window !== 'undefined') return '';
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  return 'http://localhost:3000';
};

const toProxyUrl = (endpoint: string): string => {
  const normalized = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const path = `${PROXY_API_BASE}/${normalized}`;
  const origin = getOriginForProxy();
  return origin ? `${origin}${path}` : path;
};

interface FetchOptions extends RequestInit {
  isFileUpload?: boolean;
  isFormData?: boolean;
}

// Peticiones al origen de Next; el proxy en el servidor lee `access_token` y llama al API real.
export const fetchWithAuth = async (url: string, options: FetchOptions = {}) => {
  const isFormDataBody =
    options.body instanceof FormData ||
    options.isFormData ||
    options.isFileUpload;

  const headers = new Headers(options.headers as HeadersInit);
  if (!isFormDataBody && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    authStorage.clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = AUTH_ROUTES.LOGIN;
    }
  }

  if (response.status === 403) {
    const error = await response.json();
    console.log('error', error);
    throw new Error(error.message || 'No tienes permisos para acceder a este recurso');
  }

  if (!response.ok) {
    const error = await response.json();
    console.log('error', error);
    throw new Error(error.message || 'Error en la petición');
  }

  return response;
};

export const apiGet = async <T>(endpoint: string): Promise<T> => {
  const response = await fetchWithAuth(toProxyUrl(endpoint));
  return response.json() as Promise<T>;
};

export const apiPost = async <T>(
  endpoint: string,
  data?: unknown,
): Promise<T> => {
  const response = await fetchWithAuth(toProxyUrl(endpoint), {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json() as Promise<T>;
};

/** POST que devuelve un Blob (p. ej. PDF). */
export const apiPostBlob = async (
  endpoint: string,
  data?: unknown,
): Promise<Blob> => {
  const response = await fetchWithAuth(toProxyUrl(endpoint), {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.blob();
};

export const apiPut = async <T>(endpoint: string, data: unknown): Promise<T> => {
  const response = await fetchWithAuth(toProxyUrl(endpoint), {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.json() as Promise<T>;
};

export const apiPatch = async <T>(endpoint: string, data: unknown): Promise<T> => {
  const response = await fetchWithAuth(toProxyUrl(endpoint), {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return response.json() as Promise<T>;
};

export const apiDelete = async (endpoint: string): Promise<void> => {
  await fetchWithAuth(toProxyUrl(endpoint), {
    method: 'DELETE',
  });
};
