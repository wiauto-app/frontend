import qs from "qs";

import { getStrapiData, type StrapiResponse } from "@/lib/strapi-api";
import type { StrapiAuthCompartido } from "@/interfaces/strapi-components.interface";
import { withStrapiFallback } from "@/lib/strapi-content";
import {
  LINK_POPULATE,
  SEO_POPULATE,
  TEXTO_ENLACE_POPULATE,
} from "@/lib/strapi-populate";

import { AUTENTICACION_FALLBACK } from "../content/autenticacion.fallback";
import type {
  AuthPantallaProps,
  StrapiAutenticacionPantalla,
  StrapiAutenticacionPantallaResponse,
  StrapiAutenticacionResponse,
} from "../types/strapi-autenticacion.types";

const AUTENTICACION_PANTALLAS_POPULATE = {
  registro: {
    populate: {
      seo: SEO_POPULATE,
      encabezado: true,
      aviso_invitacion: true,
      nombre: true,
      apellidos: true,
      email: true,
      telefono: true,
      contrasena: true,
      terminos: true,
      boton: true,
      pie: TEXTO_ENLACE_POPULATE,
      mensajes: true,
    },
  },
  login: {
    populate: {
      seo: SEO_POPULATE,
      encabezado: true,
      email: true,
      contrasena: true,
      recordar_sesion: true,
      boton: true,
      pie: TEXTO_ENLACE_POPULATE,
      enlace_olvide_contrasena: LINK_POPULATE,
      mensajes: true,
    },
  },
  olvide_contrasena: {
    populate: {
      seo: SEO_POPULATE,
      encabezado: true,
      encabezado_enviado: true,
      email: true,
      boton: true,
      enlace_volver: LINK_POPULATE,
      mensajes: true,
    },
  },
  cambiar_contrasena: {
    populate: {
      seo: SEO_POPULATE,
      encabezado: true,
      contrasena: true,
      confirmar_contrasena: true,
      boton: true,
      pie: TEXTO_ENLACE_POPULATE,
      mensajes: true,
      encabezado_enlace_invalido: true,
      boton_solicitar_enlace: LINK_POPULATE,
      enlace_volver: LINK_POPULATE,
    },
  },
  confirmar_correo: {
    populate: {
      seo: SEO_POPULATE,
      encabezado: true,
      boton: LINK_POPULATE,
      pie: TEXTO_ENLACE_POPULATE,
    },
  },
  verificacion_2fa: {
    populate: {
      seo: SEO_POPULATE,
      encabezado: true,
      codigo: true,
      boton_verificar: true,
      codigo_respaldo: true,
      boton_verificar_respaldo: true,
      mensajes: true,
      mensajes_respaldo: true,
    },
  },
} satisfies Record<StrapiAutenticacionPantalla, unknown>;

const fetchAutenticacion = async <T>(populate: object): Promise<T> => {
  const query = qs.stringify({ populate }, { encodeValuesOnly: true });
  const response = await getStrapiData<StrapiResponse<T>>(
    `/autenticacion?${query}`,
  );
  return response.data;
};

/** Single type completo: textos compartidos y todas las pantallas. */
export const getAutenticacionData =
  async (): Promise<StrapiAutenticacionResponse> =>
    fetchAutenticacion<StrapiAutenticacionResponse>({
      compartido: true,
      ...AUTENTICACION_PANTALLAS_POPULATE,
    });

/** Solo los textos compartidos y los de una pantalla (payload mínimo). */
export const getAutenticacionPantalla = async <
  K extends StrapiAutenticacionPantalla,
>(
  pantalla: K,
): Promise<StrapiAutenticacionPantallaResponse<K>> =>
  fetchAutenticacion<StrapiAutenticacionPantallaResponse<K>>({
    compartido: true,
    [pantalla]: AUTENTICACION_PANTALLAS_POPULATE[pantalla],
  });

/**
 * Textos de una pantalla con respaldo: si Strapi falla o deja campos vacíos,
 * se completan con `AUTENTICACION_FALLBACK`. Nunca lanza.
 */
export const getAutenticacionContenido = async <
  K extends StrapiAutenticacionPantalla,
>(
  pantalla: K,
): Promise<AuthPantallaProps<K>> => {
  const data = await getAutenticacionPantalla(pantalla).catch((error) => {
    console.error(`Strapi autenticacion.${pantalla}:`, error);
    return null;
  });
  const contenido = withStrapiFallback(
    data as StrapiAutenticacionResponse | null,
    AUTENTICACION_FALLBACK,
  );

  return {
    content: contenido[pantalla] as AuthPantallaProps<K>["content"],
    compartido: contenido.compartido as StrapiAuthCompartido,
  };
};

/** Solo los textos compartidos de auth, con respaldo. Nunca lanza. */
export const getAutenticacionCompartido =
  async (): Promise<StrapiAuthCompartido> => {
    const data = await fetchAutenticacion<
      Pick<StrapiAutenticacionResponse, "compartido">
    >({ compartido: true }).catch((error) => {
      console.error("Strapi autenticacion.compartido:", error);
      return null;
    });

    return withStrapiFallback<StrapiAuthCompartido>(
      data?.compartido,
      AUTENTICACION_FALLBACK.compartido ?? {},
    );
  };
