import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { DashboardContent } from "./components/dashboard/DashboardContent";

export const metadata = createUserAreaMetadata(
  "Inicio",
  "Resumen y analytics de tu actividad, inventario y oportunidades.",
);

export default function InicioPage() {
  return <DashboardContent />;
}
