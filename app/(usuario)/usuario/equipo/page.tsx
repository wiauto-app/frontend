import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { Suspense } from "react";
import { EquipoContent } from "./components/EquipoContent";
import { LoadingComponent } from "@/components/ui/loadingComponent";

export const metadata = createUserAreaMetadata(
  "Equipo",
  "Gestiona miembros, roles y permisos de tu equipo.",
);

export default function EquipoPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <EquipoContent />
    </Suspense>
  );
}
