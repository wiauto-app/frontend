import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { BusquedasGuardadasContent } from "./components/BusquedasGuardadasContent";

export const metadata = createUserAreaMetadata(
  "Búsquedas guardadas",
  "Administra tus búsquedas y alertas de nuevos anuncios.",
);

export default function BusquedasGuardadasPage() {
  return <BusquedasGuardadasContent />;
}
