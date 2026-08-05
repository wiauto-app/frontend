import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { DescartadosContent } from "./components/DescartadosContent";

export const metadata = createUserAreaMetadata(
  "Descartados",
  "Gestiona los vehículos que has descartado del listado.",
);

export default function DescartadosPage() {
  return <DescartadosContent />;
}
