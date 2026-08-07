import { NextRequest, NextResponse } from "next/server";

import { cookiesConfig } from "@/config/cookies.config";
import {
  ensureValidSession,
  withSessionCookies,
  clearSessionCookiesOnResponse,
} from "@/lib/ensure-session.server";


const TWO_FACTOR_PATHS = ["/verificacion-2fa", "/oauth-popup-complete"];

/**
 * En rutas protegidas: refresca sesión al navegar (UX).
 * El cliente usa POST /api/auth/refresh con single-flight; Nest mitiga rotación concurrente.
 * Ante refresh_unavailable / me_not_ok no borramos cookies (el cliente puede reintentar).
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPrivatePath = pathname.startsWith("/usuario");
  if (!isPrivatePath) {
    return NextResponse.next();
  }

  const access_token = req.cookies.get(cookiesConfig.accessToken.name)?.value ?? null;
  const refresh_token = req.cookies.get(cookiesConfig.refreshToken.name)?.value ?? null;
  if (!access_token || !refresh_token) {
    return NextResponse.redirect(new URL("/iniciar-sesion", req.url));
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
    const res = NextResponse.next();
    return withSessionCookies(
      res,
      result.access_token,
      result.refresh_token_hash,
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

  const redirect_res = NextResponse.redirect(
    new URL("/iniciar-sesion", req.url),
  );
  return clearSessionCookiesOnResponse(redirect_res);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|iniciar-sesion|registro|cambiar-contrasena|confirmar-correo|olvide-contrasena|verificacion-2fa|oauth-popup-complete|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
