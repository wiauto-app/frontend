/** Populate de `shared.link` (media anidada). */
export const LINK_POPULATE = {
  populate: {
    imagen: true,
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
    header: true,
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
