import { API_URL } from "@/constants";
import type { ApiResponse } from "@/lib/api";
import type { AuthResponseDto } from "@/validations/auth";

const buildApiUrl = (path: string): string => {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!base) {
    return normalizedPath;
  }
  return `${base}${normalizedPath}`;
};

export const refreshTokenService = {
  refreshToken: async (
    refresh_token_value: string,
  ): Promise<ApiResponse<AuthResponseDto>> => {
    const refreshResponse = await fetch(buildApiUrl("/auth/refresh"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(refresh_token_value
          ? { Cookie: `refresh_token=${refresh_token_value}` }
          : {}),
      },
    });

    const body = (await refreshResponse.json()) as ApiResponse<AuthResponseDto>;

    return {
      ok: body.ok ?? refreshResponse.ok,
      message: body.message ?? refreshResponse.statusText,
      status: body.status ?? refreshResponse.status,
      data: body.data,
    };
  },
};
