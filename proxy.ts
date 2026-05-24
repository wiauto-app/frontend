import { NextRequest, NextResponse } from "next/server";

import { cookiesConfig } from "@/config/cookies.config";
import {
  ensureValidSession,
  withSessionCookies,
  clearSessionCookiesOnResponse,
} from "@/lib/ensure-session.server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  const access_token = req.cookies.get(cookiesConfig.name)?.value ?? null;
  const cookie_header = req.headers.get("cookie") ?? "";

  const result = await ensureValidSession({ cookie_header, access_token });

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

const PUBLIC_PATHS = ['/', '/iniciar-sesion', '/registro', '/auth', '/api'];

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|iniciar-sesion|registro|auth|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
