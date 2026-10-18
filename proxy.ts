import { NextRequest, NextResponse } from "next/server";

import { cookiesConfig } from "@/config/cookies.config";
import {
  buildLoginRedirectUrl,
  isPrivatePathname,
  resolvePublicSessionResponse,
  resolveSessionFailureResponse,
} from "@/lib/proxy-session";
import {
  ensureValidSession,
  setSessionCookiesOnResponse,
  clearSessionCookiesOnResponse,
} from "@/lib/ensure-session.server";

const TWO_FACTOR_PATHS = ["/verificacion-2fa", "/oauth-popup-complete"];

/**
 * Refresca sesión al navegar si hay refresh_token.
 * Rutas públicas: nunca mandan a login por sesión inválida (limpian cookies y continúan).
 * Rutas `/usuario/*`: exigen sesión válida o redirigen a iniciar-sesion / 2FA.
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

  if (!isPrivatePath) {
    if (result.outcome === "session_refreshed") {
      const res = NextResponse.next();
      return setSessionCookiesOnResponse(
        res,
        result.access_token,
        result.refresh_token ?? "",
      );
    }

    if (
      result.outcome === "session_valid" ||
      result.outcome === "me_not_ok" ||
      result.outcome === "refresh_unavailable"
    ) {
      return NextResponse.next();
    }

    return resolvePublicSessionResponse(clearSessionCookiesOnResponse);
  }

  if (
    result.outcome === "session_valid" ||
    result.outcome === "me_not_ok" ||
    result.outcome === "refresh_unavailable"
  ) {
    return NextResponse.next();
  }

  if (result.outcome === "session_refreshed") {
    const res = NextResponse.next();
    return setSessionCookiesOnResponse(
      res,
      result.access_token,
      result.refresh_token ?? "",
    );
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
    true,
    clearSessionCookiesOnResponse,
  );
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|iniciar-sesion|registro|cambiar-contrasena|confirmar-correo|olvide-contrasena|verificacion-2fa|oauth-popup-complete|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
