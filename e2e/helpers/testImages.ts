import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

/** Directorio por defecto con fotos de prueba (2 webp + 1 JPG). */
export const DEFAULT_E2E_IMAGE_DIR =
  "/Users/irvinpincay/Downloads/wiauto-test";

const IMAGE_EXTENSIONS = /\.(webp|jpe?g|png|avif)$/i;

/**
 * Resuelve rutas absolutas de imágenes para el E2E de publicar.
 * Usa `E2E_IMAGE_DIR` o el directorio por defecto; exige al menos 3 archivos.
 */
export const getE2eTestImagePaths = (minCount = 3): string[] => {
  const dir = process.env.E2E_IMAGE_DIR ?? DEFAULT_E2E_IMAGE_DIR;

  if (!existsSync(dir)) {
    throw new Error(
      `E2E_IMAGE_DIR no existe: ${dir}. Crea la carpeta o define la variable en \`.env.e2e\`.`,
    );
  }

  const paths = readdirSync(dir)
    .filter((name) => IMAGE_EXTENSIONS.test(name))
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((name) => path.join(dir, name));

  if (paths.length < minCount) {
    throw new Error(
      `Se necesitan al menos ${minCount} imágenes en ${dir} (hay ${paths.length}).`,
    );
  }

  return paths.slice(0, minCount);
};
