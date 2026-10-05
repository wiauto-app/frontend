import qs from "qs";

import { getStrapiData, type StrapiResponse } from "@/lib/strapi-api";
import { withStrapiFallback } from "@/lib/strapi-content";
import {
  ADVANTAGES_POPULATE,
  CARD_POPULATE,
  HERO_POPULATE,
  ICON_FEATURES_POPULATE,
  LINK_POPULATE,
  SEO_POPULATE,
} from "@/lib/strapi-populate";

import { TASADOR_FALLBACK } from "../content/tasador.fallback";
import type { StrapiPaginaTasadorResponse } from "../types/strapi-tasador.types";

const OPCION_POPULATE = {
  populate: {
    puntos: ICON_FEATURES_POPULATE,
    boton: LINK_POPULATE,
  },
};

const TASADOR_POPULATE = {
  seo: SEO_POPULATE,
  hero: HERO_POPULATE,
  formulario: {
    populate: {
      encabezado_vehiculo: true,
      marca: true,
      modelo: true,
      anio: true,
      version: true,
      transmision: true,
      kilometraje: true,
      combustible: true,
      potencia: true,
      matricula: true,
      encabezado_contacto: true,
      nombre: true,
      apellidos: true,
      email: true,
      telefono: true,
      boton: true,
      mensajes: true,
    },
  },
  aviso_privacidad: CARD_POPULATE,
  como_funciona: ADVANTAGES_POPULATE,
  resultado: {
    populate: {
      encabezado: true,
      aviso_ia: true,
    },
  },
  opciones: {
    populate: {
      encabezado: true,
      publicar: OPCION_POPULATE,
      recibir_ofertas: OPCION_POPULATE,
    },
  },
  ofertas: {
    populate: {
      encabezado_enviado: true,
      enlace_ver_ofertas: LINK_POPULATE,
      encabezado_ofertas: true,
      mensajes: true,
    },
  },
  confianza: ICON_FEATURES_POPULATE,
};

/**
 * Contenido de `pagina-tasador` con respaldo: si Strapi falla o deja campos vacíos,
 * se completan con `TASADOR_FALLBACK`. Nunca lanza.
 */
export const getTasadorContent = async (): Promise<StrapiPaginaTasadorResponse> => {
  const query = qs.stringify({ populate: TASADOR_POPULATE }, { encodeValuesOnly: true });
  const data = await getStrapiData<StrapiResponse<StrapiPaginaTasadorResponse>>(
    `/pagina-tasador?${query}`,
  )
    .then((response) => response.data)
    .catch((error) => {
      console.error("Strapi pagina-tasador:", error);
      return null;
    });

  return withStrapiFallback(data, TASADOR_FALLBACK);
};
