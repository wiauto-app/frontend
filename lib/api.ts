import { API_URL } from "@/constants";
import { isPublicAuthRoute } from "@/lib/publicAuthRoutes";
import qs from "qs";

export interface ApiResponse<T> {
  ok: boolean;
  message: string;
  data: T;
  status: number;
}

interface FetchWithAuthOptions extends RequestInit {
  noResponse?: boolean;
  _auth_retry_count?: number;
  /** Evita refresh/logout automático (p. ej. `/auth/me` dentro de `ensureValidSession`). */
  skipAuthRefresh?: boolean;
  isFileUpload?: boolean;
  isFormData?: boolean;
}

interface BackendJsonBody<T> {
  ok?: boolean;
  status?: number;
  message?: string;
  data?: T;
}

interface TryRefreshSessionResult {
  ok: boolean;
  unauthorized: boolean;
}

export const buildApiUrl = (path: string): string => {
  return `${API_URL}${path}`;
};

const isAuthRefreshRequest = (requestUrl: string): boolean =>
  requestUrl.includes("/auth/refresh");

const isAuthLogoutRequest = (requestUrl: string): boolean =>
  requestUrl.includes("/auth/logout");

const isOptionalAuthRequest = (requestUrl: string): boolean =>
  requestUrl.includes("/auth/admin/two-factor/challenge") ||
  requestUrl.includes("/auth/two-factor/challenge");

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
  // if (typeof window !== "undefined") {
  //   window.location.href = AUTH_ROUTES.LOGIN;
  // }
};

/** Single-flight: una sola petición de refresh compartida mientras hay otra en curso. */
let refreshSessionInFlight: Promise<TryRefreshSessionResult> | null = null;

const executeRefreshSession = async (): Promise<TryRefreshSessionResult> => {
  try {
    const res = await fetch(`${buildApiUrl("/auth/refresh")}`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      return { ok: true, unauthorized: false };
    }

    return {
      ok: false,
      unauthorized: res.status === 401,
    };
  } catch {
    return { ok: false, unauthorized: false };
  }
};

const tryRefreshSession = async (): Promise<TryRefreshSessionResult> => {
  if (!refreshSessionInFlight) {
    refreshSessionInFlight = executeRefreshSession().finally(() => {
      refreshSessionInFlight = null;
    });
  }

  return refreshSessionInFlight;
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

    const refreshResult = await tryRefreshSession();
    if (refreshResult.ok) {
      return fetchWithAuth<T>(path, {
        ...options,
        _auth_retry_count: _auth_retry_count + 1,
      });
    }

    if (refreshResult.unauthorized) {
      await bestEffortLogout();
      redirectToLogin();
      return {
        ok: false,
        message: "Sesión expirada",
        status: 401,
        data: null as T,
      };
    }

    return {
      ok: false,
      message: "No se pudo renovar la sesión",
      status: 503,
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

  const body = (await res.json()) as BackendJsonBody<T> | null;

  return toApiResponse<T>(res, body);
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

  const body = await res.json();

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
  revalidate?: number,
): Promise<ApiResponse<T>> => {
  let query = "";
  if (queryParams) {
    query = qs.stringify(queryParams, { skipNulls: true, addQueryPrefix: true });
  }

  return fetchWithAuth<T>(`${path}${query}`, { method: "GET", next: { revalidate } });
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

export const uploadSignedFile = <T>(
  url: string,
  file: File | Blob,
  opts?: {
    content_type?: string;
    onProgress?: (progress: number) => void;
  },
): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    const contentType =
      opts?.content_type?.trim() ||
      file.type?.trim() ||
      "application/octet-stream";

    const xhr = new XMLHttpRequest();

    xhr.open("PUT", url, true);

    xhr.setRequestHeader("Content-Type", contentType);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const progress = Math.round(
        (event.loaded / event.total) * 100,
      );
      console.log("progress", progress);

      opts?.onProgress?.(progress);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        opts?.onProgress?.(100);

        resolve({
          message: xhr.statusText,
          status: xhr.status,
          ok: true,
          data: null as T,
        });

        return;
      }

      resolve({
        message: xhr.statusText || "Upload failed",
        status: xhr.status,
        ok: false,
        data: null as T,
      });
    };

    xhr.onerror = () => {
      resolve({
        message: "Network error while uploading file",
        status: xhr.status || 0,
        ok: false,
        data: null as T,
      });
    };

    xhr.onabort = () => {
      resolve({
        message: "Upload aborted",
        status: xhr.status || 0,
        ok: false,
        data: null as T,
      });
    };

    xhr.send(file);
  });
};
