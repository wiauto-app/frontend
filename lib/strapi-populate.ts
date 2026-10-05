/** Populate de `shared.link` (media anidada). */
export const LINK_POPULATE = {
  populate: {
    imagen: true,
  },
};

/** Populate de `shared.header` (`shared.text-field` anidado). */
export const HEADER_POPULATE = {
  populate: {
    busqueda: true,
  },
};

/** Populate de `shared.marcas` (header + enlaces repetibles). */
export const MARCAS_POPULATE = {
  populate: {
    header: HEADER_POPULATE,
    marcas: LINK_POPULATE,
  },
};

/** Populate de `shared.carta-ventaja` (card). */
export const CARD_POPULATE = {
  populate: {
    boton: LINK_POPULATE,
    boton_secundario: LINK_POPULATE,
    imagen: true,
  },
};

export const HERO_POPULATE = {
  populate: {
    acciones: LINK_POPULATE,
    imagen: true,
    caracteristicas: {
      populate: {
        icon: true,
      },
    },
    card: CARD_POPULATE,
  },
};

export const ADVANTAGES_POPULATE = {
  populate: {
    header: HEADER_POPULATE,
    caracteristicas: {
      populate: {
        icon: true,
      },
    },
  },
};

export const STEPS_POPULATE = {
  populate: {
    header: true,
    steps: {
      populate: {
        icon: true,
      },
    },
  },
};

/** Populate de `shared.seo` (media anidada). */
export const SEO_POPULATE = {
  populate: {
    shareImage: true,
  },
};

/** Populate de `ui.texto-enlace` (`shared.link` anidado). */
export const TEXTO_ENLACE_POPULATE = {
  populate: {
    enlace: LINK_POPULATE,
  },
};

/** Populate de un `shared.icon-feature[]` (media anidada). */
export const ICON_FEATURES_POPULATE = {
  populate: {
    icon: true,
  },
};
