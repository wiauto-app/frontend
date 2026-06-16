import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { ReportesContent } from "./components/ReportesContent";

export const metadata = createUserAreaMetadata(
  "Reportes",
  "Consulta métricas, tráfico y rendimiento de tus anuncios.",
);

export default function ReportesPage() {
  return <ReportesContent />;
}
