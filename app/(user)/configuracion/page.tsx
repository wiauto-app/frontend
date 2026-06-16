import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { ConfiguracionContent } from "./components/ConfiguracionContent";

export const metadata = createUserAreaMetadata(
  "Configuración",
  "Ajusta idioma, región, visibilidad y privacidad de tu cuenta.",
);

export default function ConfiguracionPage() {
  return <ConfiguracionContent />;
}
