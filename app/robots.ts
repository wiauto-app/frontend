import type { MetadataRoute } from "next";

/**
 * Temporal: bloquea indexación mientras el entorno de develop
 * no esté listo para producción. Restaurar allow + sitemaps al lanzar.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
