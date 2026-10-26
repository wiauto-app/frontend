import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { ConfiguracionContent } from "./components/ConfiguracionContent";
import { Suspense } from "react";
import { LoadingComponent } from "@/components/ui/loadingComponent";

export const metadata = createUserAreaMetadata(
  "Configuración",
  "Ajusta idioma, región, visibilidad y privacidad de tu cuenta.",
);

export default function ConfiguracionPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ConfiguracionContent />
    </Suspense>
  );
}
