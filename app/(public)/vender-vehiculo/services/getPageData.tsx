import { getStrapiData, StrapiResponse } from "@/lib/strapi-api";
import qs from "qs";
import { VenderVehiculoResponse } from "../interfaces/vender-vehiculo.interface";



export const getPageData = async () => {
  const query = qs.stringify(
    {
      populate: {
        imagen: true,
  
        profesional: {
          populate: {
            boton: true,
            imagen: true,
          },
        },
  
        particular: {
          populate: {
            boton: true,
            imagen: true,
          },
        },
  
        ventajas: {
          populate: {
            ventaja: {
              populate: {
                boton: true,
                imagen: true,
              },
            },
          },
        },
  
        comparacion: {
          populate: {
            planes: {
              populate: {
                caracteristicas: true,
              },
            },
          },
        },
  
        marketingCard: {
          populate: {
            boton: true,
            imagen: true,
          },
        },
  
        consejos: {
          populate: {
            consejo: {
              populate: {
                boton: true,
                imagen: true,
              },
            },
          },
        },
  
        preguntas: {
          populate: {
            pregunta: {
              populate: {
                imagen: true,
              },
            },
          },
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const response = await getStrapiData<StrapiResponse<VenderVehiculoResponse>>(`/vender-vehiculo?${query}`);
  return response.data
}