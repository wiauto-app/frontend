"use server";

import { cookies } from "next/headers";

import { cookiesConfig } from "@/config/cookies.config";
import { API_URL } from "@/constants";

type VerifyTwoFactorActionResult =
  | { ok: true }
  | { ok: false; message: string };

const buildApiUrl = (path: string): string => {
  const base = (API_URL ?? "").replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!base) {
    return normalizedPath;
  }
  return `${base}${normalizedPath}`;
};

const updateAccessTokenCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(
    cookiesConfig.accessToken.name,
    token,
    cookiesConfig.accessToken.options,
  );
};

const verifyTwoFactorRequest = async (
  path: string,
  body: Record<string, string>,
): Promise<VerifyTwoFactorActionResult> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(cookiesConfig.accessToken.name)?.value;

  if (!accessToken) {
    return { ok: false, message: "No hay una sesión de verificación activa" };
  }

  const response = await fetch(buildApiUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      Cookie: cookieStore
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; "),
    },
    body: JSON.stringify(body),
  });

  const responseBody = (await response.json()) as {
    ok?: boolean;
    message?: string;
    data?: {
      message?: string;
      data?: {
        type?: "session";
        token?: string;
      };
    };
  };

  const verifyData = responseBody.data?.data;

  if (!response.ok || verifyData?.type !== "session") {
    return {
      ok: false,
      message:
        responseBody.data?.message ??
        responseBody.message ??
        "No se pudo completar la verificación",
    };
  }

  if (verifyData.token) {
    await updateAccessTokenCookie(verifyData.token);
  }

  return { ok: true };
};

export const verifyTwoFactorAction = async (
  code: string,
): Promise<VerifyTwoFactorActionResult> => {
  return verifyTwoFactorRequest("/auth/verify-2fa", { code });
};

export const verifyBackupCodeAction = async (
  code: string,
): Promise<VerifyTwoFactorActionResult> => {
  return verifyTwoFactorRequest("/auth/verify-backup-code", { code });
};
