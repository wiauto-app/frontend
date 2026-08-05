import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { EstadisticasContent } from "./components/EstadisticasContent";

export const metadata = createUserAreaMetadata(
  "Estadísticas",
  "Alcance e interacción de tus anuncios: impresiones, visitas, contactos y más.",
);

export default function EstadisticasPage() {
  return <EstadisticasContent />;
}
