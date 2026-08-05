import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { DescartadosContent } from "./components/DescartadosContent";
import { Suspense } from "react";
import { LoadingComponent } from "@/components/ui/loadingComponent";

export const metadata = createUserAreaMetadata(
  "Descartados",
  "Gestiona los vehículos que has descartado del listado.",
);

export default function DescartadosPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <DescartadosContent />
    </Suspense>
  );
}
