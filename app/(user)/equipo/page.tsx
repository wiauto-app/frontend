import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { EquipoContent } from "./components/EquipoContent";

export const metadata = createUserAreaMetadata(
  "Equipo",
  "Gestiona miembros, roles y permisos de tu equipo.",
);

export default function EquipoPage() {
  return <EquipoContent />;
}
