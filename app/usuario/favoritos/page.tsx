import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { FavoritosContent } from "./components/FavoritosContent";
import { Suspense } from "react";
import { LoadingComponent } from "@/components/ui/loadingComponent";

export const metadata = createUserAreaMetadata(
  "Favoritos",
  "Gestiona tus vehículos guardados y carpetas de favoritos.",
);

export default function FavoritosPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <FavoritosContent />
    </Suspense>
  );
}
