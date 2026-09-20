import { getStrapiData } from "@/lib/strapi-api";
import {
  mapStrapiColaboracionToInternal,
  StrapiColaboracionLanding,
  type ColaboracionLanding,
  type StrapiColaboracionResponse,
} from "@/interfaces/landings-colaboracion.interface";
import { HERO_POPULATE, ADVANTAGES_POPULATE } from "@/lib/strapi-populate";
import qs from "qs";

const COLABORACION_POPULATE = {
  populate: {
    hero: HERO_POPULATE,
    caracteristicas: ADVANTAGES_POPULATE,
    contenido: HERO_POPULATE,
    // contenido_dinamico: {
    //   populate: {
    //     acciones: true,
    //     imagen: true,
    //     caracteristicas: {
    //       populate: {
    //         icon: true,
    //       },
    //     },
    //     header: true,
    //   },
    // },
    contenido_extra: HERO_POPULATE,
  },
};

/**
 * Fetch colaboración landing por slug desde Strapi.
 * Retorna tipos mapeados limpios (NO raw Strapi).
 */
export const getColaboracionBySlug = async (
  slug: string,
): Promise<ColaboracionLanding | null> => {
  try {
    const query = qs.stringify(
      {
        filters: {
          slug: {
            $eq: slug,
          },
        },
        ...COLABORACION_POPULATE,
      },
      {
        encodeValuesOnly: true,
      },
    );
    const response = await getStrapiData<StrapiColaboracionResponse>(
      `/landings-colaboracions?${query}`,
      { revalidate: 3600 }, // 1 hour
    );

    const collaboration = response.data?.[0];
    if (!collaboration) {
      return null;
    }

    return mapStrapiColaboracionToInternal(collaboration);
  } catch (error) {
    console.error(`[colaboracionesService] Error fetching colaboracion:`, error);
    throw error;
  }
};

/**
 * Fetch todas las colaboraciones publicadas (navbar + detalle vehículo).
 * Incluye hero.imagen como logo para la tarjeta de listado.
 */
export const getAllColaboraciones = async (): Promise<StrapiColaboracionLanding[]> => {
  try {
    const query = qs.stringify(
      {
        filters: {
          publishedAt: {
            $notNull: true,
          },
        },
        pagination: {
          limit: 100,
        },
        populate: {
          hero: HERO_POPULATE,
        },
      },
      {
        encodeValuesOnly: true,
      },
    );

    const response = await getStrapiData<StrapiColaboracionResponse>(
      `/landings-colaboracions?${query}`,
      { revalidate: 1800 },
    );

    return response.data ?? [];
  } catch (error) {
    console.error(`[colaboracionesService] Error fetching all colaboraciones:`, error);
    throw error;
  }
};
