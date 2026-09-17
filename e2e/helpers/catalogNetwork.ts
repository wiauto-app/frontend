import type { Page } from "@playwright/test";

/** Item mínimo devuelto por los endpoints de catálogo (`makes`, `models`, `provinces`). */
export interface CatalogNetworkItem {
  id: number | string;
  slug: string;
  name: string;
  make_id?: number | string;
}

interface CatalogEnvelope {
  data?: {
    data?: CatalogNetworkItem[];
  };
}

export interface CatalogNetworkStore {
  makes: CatalogNetworkItem[];
  provinces: CatalogNetworkItem[];
  models: CatalogNetworkItem[];
}

/**
 * Escucha las respuestas de los endpoints de catálogo (`/v1/catalog/makes`,
 * `/v1/catalog/models`, `/v1/provinces`) que dispara `HeroSearchForm` vía
 * react-query, y guarda los `slug` reales devueltos por el backend.
 *
 * Necesario porque la UI solo muestra `name` (texto visible), pero la URL de
 * búsqueda se construye con `slug` — sin esto tendríamos que adivinar el slug
 * a partir del nombre, lo cual es frágil (acentos, mayúsculas, etc).
 */
export const collectCatalogNetwork = (page: Page): CatalogNetworkStore => {
  const store: CatalogNetworkStore = {
    makes: [],
    provinces: [],
    models: [],
  };

  page.on("response", (response) => {
    const request = response.request();
    if (request.method() !== "GET") {
      return;
    }

    const url = response.url();
    const is_makes = url.includes("/v1/catalog/makes");
    const is_models = url.includes("/v1/catalog/models");
    const is_provinces = url.includes("/v1/provinces");

    if (!is_makes && !is_models && !is_provinces) {
      return;
    }

    response
      .json()
      .then((json: CatalogEnvelope) => {
        const items = json?.data?.data ?? [];
        if (items.length === 0) {
          return;
        }

        if (is_makes) {
          // Se pide paginado (100 por página); acumulamos en vez de sobreescribir
          // o una página posterior borra los ítems de la primera (p. ej. "ABARTH").
          const existing_ids = new Set(store.makes.map((item) => item.id));
          const new_items = items.filter((item) => !existing_ids.has(item.id));
          store.makes = [...store.makes, ...new_items];
        } else if (is_provinces) {
          store.provinces = items;
        } else if (is_models) {
          // Los modelos se piden por marca; acumulamos en vez de sobreescribir.
          const existing_ids = new Set(store.models.map((item) => item.id));
          const new_items = items.filter((item) => !existing_ids.has(item.id));
          store.models = [...store.models, ...new_items];
        }
      })
      .catch(() => {
        // Respuesta no-JSON (error, redirect, etc.) — ignorar.
      });
  });

  return store;
};

/** Busca un ítem de catálogo por `name` exacto entre los capturados por red. */
export const findCatalogItemByName = (
  items: CatalogNetworkItem[],
  name: string,
): CatalogNetworkItem | undefined =>
  items.find((item) => item.name.trim() === name.trim());
