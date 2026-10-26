import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { ConcesionarioContent } from "./components/ConcesionarioContent";

export const metadata = createUserAreaMetadata(
  "Concesionario",
  "Gestiona la información pública y el horario de tu concesionario.",
);

export default function ConcesionarioPage() {
  return <ConcesionarioContent />;
}
