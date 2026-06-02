import { NextRequest, NextResponse } from "next/server";

import { cookiesConfig } from "@/config/cookies.config";
import {
  ensureValidSession,
  withSessionCookies,
  clearSessionCookiesOnResponse,
} from "@/lib/ensure-session.server";
import {
  buildVehicleListingHref,
  hasLegacyApiQueryParams,
  normalizeVehicleListingHref,
  parseVehicleListingUrl,
  VEHICLES_LISTING_BASE_PATH,
} from "@/lib/vehicles/listing-url";

const PUBLIC_PATHS = ['/', '/iniciar-sesion', '/registro', '/cambiar-contrasena', '/confirmar-correo', '/olvide-contrasena', '/api'];

const extractSlug = (pathname: string): string[] | undefined => {
  if (pathname === VEHICLES_LISTING_BASE_PATH || pathname === `${VEHICLES_LISTING_BASE_PATH}/`) {
    return undefined;
  }

  const prefix = `${VEHICLES_LISTING_BASE_PATH}/`;
  if (!pathname.startsWith(prefix)) {
    return undefined;
  }

  const segments = pathname.slice(prefix.length).split("/").filter(Boolean);
  return segments.length > 0 ? segments : undefined;
};

const resolveLegacyVehicleListingRedirect = (req: NextRequest): NextResponse | null => {
  const { pathname, searchParams } = req.nextUrl;

  if (!pathname.startsWith(VEHICLES_LISTING_BASE_PATH)) {
    return null;
  }

  if (!hasLegacyApiQueryParams(searchParams)) {
    return null;
  }

  const slug = extractSlug(pathname);
  const params = parseVehicleListingUrl(slug, searchParams);
  const target = buildVehicleListingHref(params);
  const current = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  if (target === current) {
    return null;
  }

  return NextResponse.redirect(new URL(target, req.url), 308);
};

const resolveOptionCVehicleListingRedirect = (
  req: NextRequest,
): NextResponse | null => {
  const { pathname, searchParams } = req.nextUrl;

  if (!pathname.startsWith(VEHICLES_LISTING_BASE_PATH)) {
    return null;
  }

  const slug = extractSlug(pathname);
  const target = normalizeVehicleListingHref(slug, searchParams);

  if (!target) {
    return null;
  }

  const current = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  if (target === current) {
    return null;
  }

  return NextResponse.redirect(new URL(target, req.url), 308);
};

export async function proxy(req: NextRequest) {
  const legacy_redirect = resolveLegacyVehicleListingRedirect(req);
  if (legacy_redirect) {
    return legacy_redirect;
  }

  const option_c_redirect = resolveOptionCVehicleListingRedirect(req);
  if (option_c_redirect) {
    return option_c_redirect;
  }

  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  const access_token = req.cookies.get(cookiesConfig.name)?.value ?? null;
  const cookie_header = req.headers.get("cookie") ?? "";

  if (access_token) {
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|iniciar-sesion|registro|cambiar-contrasena|confirmar-correo|olvide-contrasena|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
