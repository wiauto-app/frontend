import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it } from "vitest";

import { cookiesConfig } from "@/config/cookies.config";
import {
  buildLoginRedirectUrl,
  isPrivatePathname,
  resolveSessionFailureResponse,
} from "@/lib/proxy-session";

describe("isPrivatePathname", () => {
  it("marca /usuario como privada", () => {
    expect(isPrivatePathname("/usuario")).toBe(true);
    expect(isPrivatePathname("/usuario/inicio")).toBe(true);
  });

  it("no marca la home como privada", () => {
    expect(isPrivatePathname("/")).toBe(false);
  });
});

describe("buildLoginRedirectUrl", () => {
  it("codifica redirect=%2F en la home", () => {
    const req = new NextRequest("http://localhost:3000/");
    const url = buildLoginRedirectUrl(req);

    expect(url.pathname).toBe("/iniciar-sesion");
    expect(url.searchParams.get("redirect")).toBe("/");
  });
});

describe("resolveSessionFailureResponse", () => {
  const clearCookies = (response: NextResponse): NextResponse => {
    response.cookies.delete(cookiesConfig.accessToken.name);
    response.cookies.delete(cookiesConfig.refreshToken.name);
    return response;
  };

  it("en ruta pública con refresh inválido no redirige a login (cookies caducadas)", () => {
    const req = new NextRequest("http://localhost:3000/");
    const res = resolveSessionFailureResponse(req, false, clearCookies);

    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("en /usuario sí redirige a iniciar-sesion con return path", () => {
    const req = new NextRequest("http://localhost:3000/usuario/inicio");
    const res = resolveSessionFailureResponse(req, true, clearCookies);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/iniciar-sesion?redirect=%2Fusuario%2Finicio",
    );
  });
});
