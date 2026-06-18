import { NextRequest, NextResponse } from "next/server";

import { cookiesConfig } from "@/config/cookies.config";
import {
  ensureValidSession,
  withSessionCookies,
  clearSessionCookiesOnResponse,
} from "@/lib/ensure-session.server";


const PUBLIC_PATHS = ['/', '/iniciar-sesion', '/registro', '/cambiar-contrasena', '/confirmar-correo', '/olvide-contrasena', '/api'];

export async function proxy(req: NextRequest) {
  console.log("req.nextUrl.pathname", req.nextUrl.pathname);
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  const access_token = req.cookies.get(cookiesConfig.accessToken.name)?.value ?? null;
  const refresh_token = req.cookies.get(cookiesConfig.refreshToken.name)?.value ?? null;
  if (refresh_token) {
    const result = await ensureValidSession({ refresh_token, access_token });
    if (result.outcome === "session_valid" || result.outcome === "me_not_ok") {
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

    const redirect_res = NextResponse.redirect(
      new URL("/iniciar-sesion", req.url),
    );
    return clearSessionCookiesOnResponse(redirect_res);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|iniciar-sesion|registro|cambiar-contrasena|confirmar-correo|olvide-contrasena|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};