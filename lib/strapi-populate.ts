
export const HERO_POPULATE = {
  populate: {
    acciones: {
      populate: {
        imagen: true,
      },
    },
    imagen: true,
    caracteristicas: {
      populate: {
        icon: true,
      },
    },
    card: {
      populate: {
        boton: {
          populate: {
            imagen: true,
          },
        },
        imagen: true,
      },
    },
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
