const isProd = process.env.NODE_ENV === "production";

export const cookiesConfig = {
  redirectUrl: {
    name: "redirect_url",
    options: {
      httpOnly: true,
      secure: isProd,
      sameSite: (isProd ? "none" : "lax") as "none" | "lax",
      domain: isProd ? ".wiauto.es" : undefined,
      maxAge: 60 * 15,
      path: "/",
    },
  },
  accessToken: {
    name: "access_token",
    options: {
      httpOnly: true,
      secure: isProd,
      sameSite: (isProd ? "none" : "lax") as "none" | "lax",
      // ¡ESTA LÍNEA ES CRUCIAL PARA PRODUCCIÓN!
      domain: isProd ? ".wiauto.es" : undefined, 
      maxAge: 60 * 15,
      path: "/",
    },
  },
  refreshToken: {
    name: "refresh_token",
    options: {
      httpOnly: true,
      secure: isProd,
      sameSite: (isProd ? "none" : "lax") as "none" | "lax",
      // ¡ESTA LÍNEA ES CRUCIAL PARA PRODUCCIÓN!
      domain: isProd ? ".wiauto.es" : undefined, 
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    },
  },
};