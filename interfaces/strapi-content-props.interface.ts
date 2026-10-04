import type {
  StrapiFormularioCampo,
  StrapiFormularioCampoTelefono,
} from "@/interfaces/strapi-components.interface";

/** Props base de un componente que pinta un componente de Strapi. */
export interface StrapiComponentProps<T> {
  content: T;
  className?: string;
}

/** Mensajes de validación de un `formulario.campo`. */
export type StrapiCampoMensajes = Pick<
  StrapiFormularioCampo,
  "mensaje_requerido" | "mensaje_invalido"
>;

/** Mensajes de validación de un `formulario.campo-telefono`. */
export type StrapiCampoTelefonoMensajes = Pick<
  StrapiFormularioCampoTelefono,
  | "mensaje_requerido"
  | "mensaje_invalido"
  | "mensaje_longitud"
  | "mensaje_prefijo_requerido"
>;
