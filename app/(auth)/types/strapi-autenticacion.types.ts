import type {
  StrapiAuthCambiarContrasena,
  StrapiAuthCompartido,
  StrapiAuthConfirmarCorreo,
  StrapiAuthLogin,
  StrapiAuthOlvideContrasena,
  StrapiAuthRegistro,
  StrapiAuthVerificacion2fa,
} from "@/interfaces/strapi-components.interface";

/** Single type Strapi `autenticacion` (respuesta `data`). */
export interface StrapiAutenticacionResponse {
  id: number;
  documentId: string;
  compartido: StrapiAuthCompartido | null;
  registro: StrapiAuthRegistro | null;
  login: StrapiAuthLogin | null;
  olvide_contrasena: StrapiAuthOlvideContrasena | null;
  cambiar_contrasena: StrapiAuthCambiarContrasena | null;
  confirmar_correo: StrapiAuthConfirmarCorreo | null;
  verificacion_2fa: StrapiAuthVerificacion2fa | null;
}

/** Pantallas del single type `autenticacion` (todo menos `compartido`). */
export type StrapiAutenticacionPantalla = Exclude<
  keyof StrapiAutenticacionResponse,
  "id" | "documentId" | "compartido"
>;

/** Respuesta de una pantalla: sus textos más los compartidos. */
export type StrapiAutenticacionPantallaResponse<
  K extends StrapiAutenticacionPantalla,
> = Pick<StrapiAutenticacionResponse, "id" | "documentId" | "compartido" | K>;

/** Props de una pantalla de auth: sus textos y los compartidos, ya con respaldo. */
export interface AuthPantallaProps<K extends StrapiAutenticacionPantalla> {
  content: NonNullable<StrapiAutenticacionResponse[K]>;
  compartido: StrapiAuthCompartido;
}
