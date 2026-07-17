import { getStrapiData } from "@/lib/strapi-api";
import { getStrapiMediaUrl } from "@/lib/strapi-media";
import qs from "qs";

import {
  SIMULADOR_CTA,
  SIMULADOR_PANEL_COPY,
  SIMULADOR_SEO_DEFAULTS,
} from "../constants/simulador-panel-copy";
import type {
  SimuladorBeneficioView,
  SimuladorCommentsStrapi,
  SimuladorPageStrapiData,
  SimuladorPageViewModel,
  SimuladorPasoView,
  SimuladorReasonsStrapi,
  SimuladorTestimonioView,
  StrapiMedia,
  StrapiSimuladorPageResponse,
} from "../interfaces/simulador-page.interface";

const SIMULADOR_POPULATE_QUERY = {
  populate: {
    header: true,
    financiar: {
      populate: {
        razones: {
          populate: {
            icon: true,
          },
        },
      },
    },
    facilidades: {
      populate: {
        razones: {
          populate: {
            icon: true,
          },
        },
      },
    },
    comentarios: {
      populate: {
        comentario: {
          populate: {
            usuario: {
              populate: {
                imagen: true,
              },
            },
          },
        },
      },
    },
  },
};

const resolveMedia = (
  media: StrapiMedia | null | undefined,
  fallbackAlt = "",
): { url: string | null; alt: string } => {
  const url =
    getStrapiMediaUrl(media?.formats?.medium?.url) ??
    getStrapiMediaUrl(media?.formats?.small?.url) ??
    getStrapiMediaUrl(media?.url);

  return {
    url,
    alt: media?.alternativeText?.trim() || fallbackAlt,
  };
};

const mapRazonesToBeneficios = (
  section: SimuladorReasonsStrapi | null | undefined,
): SimuladorBeneficioView[] => {
  const items = section?.razones;
  if (!items?.length) {
    return [];
  }

  return items.map((item, index) => {
    const titulo = item.label?.trim() || "";
    return {
      id: String(item.id ?? `ben-${index}`),
      titulo,
      descripcion: item.descripcion?.trim() || "",
      icon: resolveMedia(item.icon, titulo),
      iconName: item.iconName?.trim() || null,
    };
  });
};

const mapRazonesToPasos = (
  section: SimuladorReasonsStrapi | null | undefined,
): SimuladorPasoView[] => {
  const items = section?.razones;
  if (!items?.length) {
    return [];
  }

  return items.map((item, index) => {
    const titulo = item.label?.trim() || "";
    return {
      id: String(item.id ?? `paso-${index}`),
      orden: index + 1,
      titulo,
      descripcion: item.descripcion?.trim() || "",
      icon: resolveMedia(item.icon, titulo),
      iconName: item.iconName?.trim() || null,
    };
  });
};

const mapComentarios = (
  section: SimuladorCommentsStrapi | null | undefined,
): SimuladorTestimonioView[] => {
  const items = section?.comentario;
  if (!items?.length) {
    return [];
  }

  return items.map((item, index) => {
    const nombre = item.usuario?.nombre?.trim() || "";
    return {
      id: String(item.id ?? `test-${index}`),
      nombre,
      cita: item.comentario?.trim() || "",
      rating: Math.min(5, Math.max(0, item.rating ?? 5)),
      foto: resolveMedia(item.usuario?.imagen, nombre),
      rol: item.usuario?.descripcion?.trim() || "",
    };
  });
};

const mapToViewModel = (data: SimuladorPageStrapiData): SimuladorPageViewModel => {
  const headerTitulo = data.header?.titulo?.trim() || "";
  const headerDescripcion = data.header?.descripcion?.trim() || "";

  return {
    header: {
      titulo: headerTitulo,
      descripcion: headerDescripcion,
    },
    beneficiosTitulo: data.financiar?.titulo?.trim() || "",
    beneficios: mapRazonesToBeneficios(data.financiar),
    pasosTitulo: data.facilidades?.titulo?.trim() || "",
    pasos: mapRazonesToPasos(data.facilidades),
    testimoniosTitulo: data.comentarios?.titulo?.trim() || "",
    testimonios: mapComentarios(data.comentarios),
    ctaFinal: SIMULADOR_CTA,
    copyUi: SIMULADOR_PANEL_COPY,
    seoTitle: headerTitulo
      ? `${headerTitulo} | WiAuto`
      : SIMULADOR_SEO_DEFAULTS.title,
    seoDescription: headerDescripcion || SIMULADOR_SEO_DEFAULTS.description,
  };
};

/**
 * Contenido marketing del simulador desde Strapi.
 * Retorna `null` si no hay data; propaga errores de red/HTTP.
 */
export const getSimuladorPageData = async (): Promise<SimuladorPageViewModel | null> => {
  const query = qs.stringify(SIMULADOR_POPULATE_QUERY, {
    encodeValuesOnly: true,
  });

  const response = await getStrapiData<StrapiSimuladorPageResponse>(
    `/simulador?${query}`,
  );

  if (!response.data) {
    return null;
  }

  return mapToViewModel(response.data);
};
