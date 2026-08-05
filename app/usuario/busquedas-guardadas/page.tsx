import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { SavedSearchesContent } from "./components/SavedSearchesContent";
import { Suspense } from "react";
import { LoadingComponent } from "@/components/ui/loadingComponent";

export const metadata = createUserAreaMetadata(
  "Búsquedas guardadas",
  "Administra tus búsquedas y alertas de nuevos anuncios.",
);

export default function SavedSearchesPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <SavedSearchesContent />
    </Suspense>
  );
}
