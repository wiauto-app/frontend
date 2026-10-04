import type { StrapiSeo } from "@/interfaces/strapi-components.interface";
import { JsonLdScript } from "@/lib/seo/json-ld-script";

interface StrapiStructuredDataProps {
  seo: StrapiSeo | null | undefined;
}

/** JSON-LD propio de la página (`shared.seo.structuredData`). */
export const StrapiStructuredData = ({ seo }: StrapiStructuredDataProps) =>
  seo?.structuredData ? <JsonLdScript data={seo.structuredData} /> : null;
