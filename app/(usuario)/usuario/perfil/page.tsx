import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { PerfilContent } from "./components/PerfilContent";

export const metadata = createUserAreaMetadata(
  "Perfil",
  "Actualiza tu información personal y preferencias de cuenta.",
);

export default function PerfilPage() {
  return <PerfilContent />;
}
