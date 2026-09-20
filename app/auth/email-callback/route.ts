import { NextRequest } from "next/server";

import { handleAuthSessionCallback } from "@/lib/auth/handleAuthSessionCallback";

/**
 * Deep link HTTPS de verificación de correo (Universal Links / App Links).
 * En web: cookies de sesión + redirect (mismo contrato que /api/auth/callback).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  return handleAuthSessionCallback(
    {
      token: searchParams.get("token"),
      refreshToken: searchParams.get("refresh_token"),
      type: searchParams.get("type"),
      message: searchParams.get("message"),
    },
    {
      forceVerifiedHome: true,
      defaultErrorMessage: "No se pudo verificar el correo electrónico",
    },
  );
}
