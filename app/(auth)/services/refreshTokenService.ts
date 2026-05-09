import { API_URL } from "@/constants";
import { ApiResponse } from "@/lib/api";
import { AuthResponseDto } from "@/validations/auth";


export const refreshTokenService = {
  refreshToken: async (cookies: string): Promise<ApiResponse<AuthResponseDto>> => {
    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies,
      },
    });
    const data = await refreshResponse.json();
    return {
      ok: refreshResponse.ok,
      status: refreshResponse.status,
      data,
    };
  },
}