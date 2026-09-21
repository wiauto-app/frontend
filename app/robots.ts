import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/absolute-url";

/**
 * Rutas privadas o de flujo (sesión, panel, API). Las páginas `noindex`
 * (seguros, garantía, etc.) NO van aquí: el crawler debe poder leer su meta robots.
 */
const PRIVATE_PATHS = [
  "/usuario",
  "/publicar",
  "/editar-vehiculo",
  "/billing-plan",
  "/asistente",
  "/api/",
  "/auth/",
  "/iniciar-sesion",
  "/registro",
  "/cambiar-contrasena",
  "/confirmar-correo",
  "/olvide-contrasena",
  "/verificacion-2fa",
  "/oauth-popup-complete",
  "/invitacion/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: PRIVATE_PATHS,
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
