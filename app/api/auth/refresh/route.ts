import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { cookiesConfig } from "@/config/cookies.config";
import {
  clearSessionCookiesOnResponse,
  resolveSessionRefresh,
  withSessionCookies,
} from "@/lib/ensure-session.server";

interface RefreshRouteBody {
  ok: boolean;
  refreshed: boolean;
}

export const POST = async () => {
  const cookieStore = await cookies();
  const access_token =
    cookieStore.get(cookiesConfig.accessToken.name)?.value ?? null;
  const refresh_token =
    cookieStore.get(cookiesConfig.refreshToken.name)?.value ?? null;

  const result = await resolveSessionRefresh({ access_token, refresh_token });

  if (result.clearCookies) {
    const response = NextResponse.json<RefreshRouteBody>(
      { ok: false, refreshed: false },
      { status: 401 },
    );
    return clearSessionCookiesOnResponse(response);
  }

  if (result.status >= 500) {
    return NextResponse.json<RefreshRouteBody>(
      { ok: false, refreshed: false },
      { status: result.status },
    );
  }

  const response = NextResponse.json<RefreshRouteBody>(
    { ok: true, refreshed: result.refreshed },
    { status: 200 },
  );

  if (result.tokens) {
    return withSessionCookies(
      response,
      result.tokens.access_token,
      result.tokens.refresh_token_hash,
    );
  }

  return response;
};
