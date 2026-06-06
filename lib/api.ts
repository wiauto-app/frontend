import { API_URL } from "@/constants";
import { AUTH_ROUTES } from "@/constants/auth.constants";
import { isPublicAuthRoute } from "@/lib/publicAuthRoutes";
import qs from "qs";

export interface ApiResponse<T> {
  ok: boolean;
  message: string;
  data: T;
  status: number;
}

type FetchWithAuthOptions = RequestInit & {
  noResponse?: boolean;
  _auth_retry_count?: number;
  /** Evita refresh/logout automático (p. ej. `/auth/me` dentro de `ensureValidSession`). */
  skipAuthRefresh?: boolean;
  isFileUpload?: boolean;
  isFormData?: boolean;
};

type BackendJsonBody<T> = {
  ok?: boolean;
  status?: number;
  message?: string;
  data?: T;
};

const buildApiUrl = (path: string): string => {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!base) {
    return normalizedPath;
  }

  return `${base}${normalizedPath}`;
};

const isAuthRefreshRequest = (requestUrl: string): boolean =>
  requestUrl.includes("/auth/refresh");

const isAuthLogoutRequest = (requestUrl: string): boolean =>
  requestUrl.includes("/auth/logout");

const isOptionalAuthRequest = (requestUrl: string): boolean =>
  requestUrl.includes("/auth/admin/two-factor/challenge");

const buildJsonHeaders = (
  requestHeaders: HeadersInit | undefined,
  hasJsonBody: boolean,
): HeadersInit => {
  const headers = new Headers(requestHeaders);

  if (hasJsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
};

const parseJsonBody = async <T>(response: Response): Promise<T | null> => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
};

const toApiResponse = <T>(
  response: Response,
  body: BackendJsonBody<T> | null,
): ApiResponse<T> => {
  const message =
    (typeof body === "object" && body !== null && "message" in body
      ? body.message
      : undefined) ?? response.statusText;

  const data =
    typeof body === "object" && body !== null && "data" in body
      ? (body.data as T)
      : (body as T);

  const ok =
    typeof body === "object" && body !== null && typeof body.ok === "boolean"
      ? body.ok
      : response.ok;

  return {
    ok,
    message,
    status: response.status,
    data,
  };
};

const bestEffortLogout = async (): Promise<void> => {
  try {
    await fetch(buildApiUrl("/auth/logout"), {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // Best-effort: lo importante es limpiar sesión en el cliente.
  }

  if (typeof window !== "undefined") {
    try {
      const { logoutAction } = await import(
        "@/app/(auth)/authActions/authActions"
      );
      await logoutAction();
    } catch {
      // ignore
    }
  }
};

const redirectToLogin = (): void => {
  if (typeof window !== "undefined") {
    window.location.href = AUTH_ROUTES.LOGIN;
  }
};

const tryRefreshSession = async (): Promise<boolean> => {
  if (typeof window !== "undefined") {
    try {
      const { refreshSessionAction } = await import(
        "@/app/(auth)/actions/refreshSessionAction"
      );
      const result = await refreshSessionAction();
      return result.ok;
    } catch {
      return false;
    }
  }

  const refreshResponse = await fetch(buildApiUrl("/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return refreshResponse.ok;
};

export const fetchWithAuth = async <T>(
  path: string,
  options: FetchWithAuthOptions = {},
): Promise<ApiResponse<T>> => {
  const requestUrl = buildApiUrl(path);

  const {
    noResponse,
    _auth_retry_count = 0,
    skipAuthRefresh = false,
    headers: requestHeaders,
    isFileUpload,
    isFormData,
    ...fetchOptions
  } = options;

  const isFormDataBody =
    fetchOptions.body instanceof FormData || isFormData || isFileUpload;

  const hasJsonBody =
    !isFormDataBody &&
    fetchOptions.body !== undefined &&
    fetchOptions.body !== null;

  const res = await fetch(requestUrl, {
    ...fetchOptions,
    credentials: "include",
    headers: buildJsonHeaders(requestHeaders, hasJsonBody),
  });

  if (
    res.status === 401 &&
    !skipAuthRefresh &&
    typeof window !== "undefined" &&
    !isPublicAuthRoute() &&
    !isOptionalAuthRequest(requestUrl) &&
    !isAuthRefreshRequest(requestUrl) &&
    !isAuthLogoutRequest(requestUrl)
  ) {
    if (_auth_retry_count >= 1) {
      await bestEffortLogout();
      redirectToLogin();
      return {
        ok: false,
        message: "Sesión expirada",
        status: res.status,
        data: null as T,
      };
    }

    const refreshed = await tryRefreshSession();

    if (refreshed) {
      return fetchWithAuth<T>(path, {
        ...options,
        _auth_retry_count: _auth_retry_count + 1,
      });
    }

    await bestEffortLogout();
    redirectToLogin();
    return {
      ok: false,
      message: "Sesión expirada",
      status: res.status,
      data: null as T,
    };
  }

  if (noResponse) {
    return {
      ok: res.ok,
      message: res.statusText,
      status: res.status,
      data: null as T,
    };
  }

  const body = await parseJsonBody<BackendJsonBody<T>>(res);
  const apiResponse = toApiResponse<T>(res, body);

  if (!res.ok && !apiResponse.message) {
    apiResponse.message = res.statusText;
  }

  if (!res.ok) {
    console.error(body);
  }

  return apiResponse;
};

export const fetchOptionalAuth = async <T>(
  path: string,
  options: RequestInit & { noResponse?: boolean } = {},
): Promise<ApiResponse<T>> => {
  const requestUrl = buildApiUrl(path);
  const { noResponse, headers: requestHeaders, ...fetchOptions } = options;

  const hasJsonBody =
    fetchOptions.body !== undefined && fetchOptions.body !== null;

  const res = await fetch(requestUrl, {
    ...fetchOptions,
    credentials: "include",
    headers: buildJsonHeaders(requestHeaders, hasJsonBody),
  });

  if (noResponse) {
    return {
      ok: res.ok,
      message: res.statusText,
      status: res.status,
      data: null as T,
    };
  }

  const body = await parseJsonBody<BackendJsonBody<T>>(res);

  if (!res.ok) {
    if (body !== null) {
      return toApiResponse<T>(res, body);
    }

    return {
      ok: false,
      message: res.statusText,
      status: res.status,
      data: null as T,
    };
  }

  return toApiResponse<T>(res, body);
};

export const apiGet = async <T>(
  path: string,
  queryParams?: Record<string, unknown>,
): Promise<ApiResponse<T>> => {
  let query = "";
  if (queryParams) {
    query = qs.stringify(queryParams, { skipNulls: true, addQueryPrefix: true });
  }

  return fetchWithAuth<T>(`${path}${query}`, { method: "GET" });
};

export const apiPost = async <T>(
  path: string,
  data?: unknown,
): Promise<ApiResponse<T>> => {
  const isFormData = data instanceof FormData;

  return fetchWithAuth<T>(path, {
    method: "POST",
    body: isFormData
      ? data
      : data !== undefined
        ? JSON.stringify(data)
        : undefined,
    ...(isFormData ? { isFormData: true } : {}),
  });
};

export const apiPostBlob = async (
  path: string,
  data?: unknown,
): Promise<ApiResponse<Blob>> => {
  const response = await fetch(buildApiUrl(path), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  const blob = await response.blob();

  return {
    ok: response.ok,
    message: response.statusText,
    status: response.status,
    data: blob,
  };
};

export const apiPut = async <T>(
  path: string,
  data: unknown,
): Promise<ApiResponse<T>> => {
  return fetchWithAuth<T>(path, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const apiPatch = async <T>(
  path: string,
  data: unknown,
): Promise<ApiResponse<T>> => {
  return fetchWithAuth<T>(path, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const apiDelete = async <T = null>(
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> => {
  const options: FetchWithAuthOptions = {
    method: "DELETE",
    noResponse: true,
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  return fetchWithAuth<T>(path, options);
};

export const uploadSignedFile = async <T>(
  url: string,
  file: File,
  opts?: { content_type?: string },
): Promise<ApiResponse<T>> => {
  const contentType =
    opts?.content_type?.trim() ||
    file.type.trim() ||
    "application/octet-stream";

  const response = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": contentType,
    },
  });

  if (!response.ok) {
    return {
      message: response.statusText,
      status: response.status,
      ok: false,
      data: null as T,
    };
  }

  return {
    message: response.statusText,
    status: response.status,
    ok: true,
    data: null as T,
  };
};
