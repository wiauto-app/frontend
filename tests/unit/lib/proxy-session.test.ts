import { NextRequest, NextResponse } from "next/server";
import { describe, expect, it } from "vitest";

import { clearSessionCookiesOnResponse } from "@/lib/ensure-session.server";
import {
  buildLoginRedirectUrl,
  isPrivatePathname,
  resolvePublicSessionResponse,
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

describe("resolvePublicSessionResponse", () => {
  it("no redirige y expira cookies de sesión", () => {
    const res = resolvePublicSessionResponse(clearSessionCookiesOnResponse);

    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
    expect(res.cookies.get("access_token")?.value).toBe("");
    expect(res.cookies.get("refresh_token")?.value).toBe("");
  });
});

describe("resolveSessionFailureResponse", () => {
  it("en ruta pública con refresh inválido no redirige a login (cookies caducadas)", () => {
    const req = new NextRequest("http://localhost:3000/");
    const res = resolveSessionFailureResponse(
      req,
      false,
      clearSessionCookiesOnResponse,
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("en /usuario sí redirige a iniciar-sesion con return path", () => {
    const req = new NextRequest("http://localhost:3000/usuario/inicio");
    const res = resolveSessionFailureResponse(
      req,
      true,
      clearSessionCookiesOnResponse,
    );

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/iniciar-sesion?redirect=%2Fusuario%2Finicio",
    );
  });
});
