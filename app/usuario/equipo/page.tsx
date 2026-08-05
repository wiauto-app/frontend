import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { Suspense } from "react";
import { EquipoContent } from "./components/EquipoContent";

export const metadata = createUserAreaMetadata(
  "Equipo",
  "Gestiona miembros, roles y permisos de tu equipo.",
);

export default function EquipoPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 pb-20">
          <div className="h-10 w-48 animate-pulse rounded-md bg-gray-200" />
          <div className="h-64 w-full animate-pulse rounded-md bg-gray-200" />
        </div>
      }
    >
      <EquipoContent />
    </Suspense>
  );
}
