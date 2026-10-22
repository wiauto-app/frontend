import { BlocksContent } from "@strapi/blocks-react-renderer";

export interface LegalPage {
  titulo: string;
  slug: string;
  contenido: BlocksContent;
}
