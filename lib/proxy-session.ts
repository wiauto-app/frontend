import { NextRequest, NextResponse } from "next/server";

export const PRIVATE_PATH_PREFIXES = ["/usuario"];

export const isPrivatePathname = (pathname: string): boolean =>
  PRIVATE_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

export const buildLoginRedirectUrl = (req: NextRequest): URL => {
  const loginUrl = new URL("/iniciar-sesion", req.url);
  const returnPath = `${req.nextUrl.pathname}${req.nextUrl.search}`;
  if (returnPath.startsWith("/") && !returnPath.startsWith("//")) {
    loginUrl.searchParams.set("redirect", returnPath);
  }
  return loginUrl;
};

/**
 * Rutas públicas: nunca redirigir a login ni 2FA por sesión rota; limpiar cookies y seguir.
 * Evita quedar atrapado en `/iniciar-sesion?redirect=%2F` al navegar con refresh inválido.
 */
export const resolvePublicSessionResponse = (
  clearSessionCookiesOnResponse: (response: NextResponse) => NextResponse,
): NextResponse =>
  clearSessionCookiesOnResponse(NextResponse.next());

/**
 * Sesión inválida (refresh 401): en rutas privadas → login; en públicas → limpiar cookies y continuar anónimo.
 */
export const resolveSessionFailureResponse = (
  req: NextRequest,
  isPrivatePath: boolean,
  clearSessionCookiesOnResponse: (response: NextResponse) => NextResponse,
): NextResponse => {
  if (!isPrivatePath) {
    return clearSessionCookiesOnResponse(NextResponse.next());
  }

  return clearSessionCookiesOnResponse(
    NextResponse.redirect(buildLoginRedirectUrl(req)),
  );
};
