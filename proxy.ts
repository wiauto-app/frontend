import { NextRequest, NextResponse } from "next/server";

import { cookiesConfig } from "@/config/cookies.config";
import {
  buildLoginRedirectUrl,
  isPrivatePathname,
  resolveSessionFailureResponse,
} from "@/lib/proxy-session";
import {
  ensureValidSession,
  setSessionCookies,
  clearSessionCookiesOnResponse,
} from "@/lib/ensure-session.server";

const TWO_FACTOR_PATHS = ["/verificacion-2fa", "/oauth-popup-complete"];

/**
 * Refresca sesión al navegar si hay refresh_token (UX en rutas privadas y públicas).
 * El cliente usa POST /api/auth/refresh con single-flight; Nest mitiga rotación concurrente.
 * Ante refresh_unavailable / me_not_ok no borramos cookies (el cliente puede reintentar).
 * Si el refresh falla (401) en una ruta pública, se limpian cookies y se sirve la página sin login.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPrivatePath = isPrivatePathname(pathname);

  const access_token = req.cookies.get(cookiesConfig.accessToken.name)?.value ?? null;
  const refresh_token = req.cookies.get(cookiesConfig.refreshToken.name)?.value ?? null;

  const shouldRedirect = !access_token && !refresh_token && isPrivatePath;
  if (shouldRedirect) {
    return NextResponse.redirect(buildLoginRedirectUrl(req));
  }

  if (!refresh_token && !isPrivatePath) {
    return NextResponse.next();
  }

  if (!refresh_token) {
    return NextResponse.redirect(buildLoginRedirectUrl(req));
  }

  const result = await ensureValidSession({ refresh_token, access_token });
  if (
    result.outcome === "session_valid" ||
    result.outcome === "me_not_ok" ||
    result.outcome === "refresh_unavailable"
  ) {
    return NextResponse.next();
  }

  if (result.outcome === "session_refreshed") {
    await setSessionCookies(
      result.access_token,
      result.refresh_token ?? "",
    );
    return NextResponse.next();
  }

  if (result.outcome === "two_factor_pending") {
    if (
      TWO_FACTOR_PATHS.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`),
      )
    ) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/verificacion-2fa", req.url));
  }

  return resolveSessionFailureResponse(
    req,
    isPrivatePath,
    clearSessionCookiesOnResponse,
  );
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|iniciar-sesion|registro|cambiar-contrasena|confirmar-correo|olvide-contrasena|verificacion-2fa|oauth-popup-complete|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
