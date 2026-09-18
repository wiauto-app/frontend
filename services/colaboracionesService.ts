import { getStrapiData } from "@/lib/strapi-api";
import {
  mapStrapiColaboracionToInternal,
  mapStrapiListItemsToInternal,
  type ColaboracionLanding,
  type ColaboracionListItem,
  type StrapiColaboracionListItem,
  type StrapiColaboracionResponse,
  type StrapiColaboracionSingleResponse,
} from "@/interfaces/landings-colaboracion.interface";
import { HERO_POPULATE, ADVANTAGES_POPULATE } from "@/lib/strapi-populate";
import qs from "qs";

const COLABORACION_POPULATE = {
  populate: {
    hero: HERO_POPULATE,
    caracteristicas: ADVANTAGES_POPULATE,
    contenido: HERO_POPULATE,
    contenido_dinamico: {
      populate: {
        acciones: true,
        imagen: true,
        caracteristicas: {
          populate: {
            icon: true,
          },
        },
        header: true,
      },
    },
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
          nombre: {
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
      `/landings-colaboracion?${query}`,
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
 * Fetch todas las colaboraciones para navbar/lista.
 * Retorna solo id, nombre y publishedAt (minimal data).
 */
export const getAllColaboraciones = async (): Promise<ColaboracionListItem[]> => {
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
      },
      {
        encodeValuesOnly: true,
      },
    );

    const response = await getStrapiData<{
      data: StrapiColaboracionListItem[];
    }>(`/landings-colaboracion?${query}`, {
      revalidate: 1800, // 30 minutes
    });

    return mapStrapiListItemsToInternal(response.data ?? []);
  } catch (error) {
    console.error(`[colaboracionesService] Error fetching all colaboraciones:`, error);
    throw error;
  }
};
