import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { Panel } from "./components/panel";

export const metadata = createUserAreaMetadata(
  "Inicio",
  "Resumen de actividad, estadísticas y publicaciones recientes.",
);

export default function InicioPage() {
  return <Panel />;
}
