import type {
  StrapiCard,
  StrapiHero,
  StrapiIconFeature,
  StrapiPlanesCaracteristicas,
  StrapiSeo,
  StrapiTasadorFormulario,
  StrapiTasadorOfertas,
  StrapiTasadorOpciones,
  StrapiTasadorResultado,
} from "@/interfaces/strapi-components.interface";

/** Single type Strapi `pagina-tasador` (respuesta `data`). */
export interface StrapiPaginaTasadorResponse {
  id: number;
  documentId: string;
  seo: StrapiSeo | null;
  hero: StrapiHero | null;
  formulario: StrapiTasadorFormulario | null;
  aviso_privacidad: StrapiCard | null;
  como_funciona: StrapiPlanesCaracteristicas | null;
  resultado: StrapiTasadorResultado | null;
  opciones: StrapiTasadorOpciones | null;
  ofertas: StrapiTasadorOfertas | null;
  confianza: StrapiIconFeature[] | null;
}
