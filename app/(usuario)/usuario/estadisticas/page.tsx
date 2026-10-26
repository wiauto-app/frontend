import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { EstadisticasContent } from "./components/EstadisticasContent";
import { Suspense } from "react";
import { LoadingComponent } from "@/components/ui/loadingComponent";

export const metadata = createUserAreaMetadata(
  "Estadísticas",
  "Alcance e interacción de tus anuncios: impresiones, visitas, contactos y más.",
);

export default function EstadisticasPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <EstadisticasContent />
    </Suspense>
  );
}
