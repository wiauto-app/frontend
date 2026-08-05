import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { SavedSearchesContent } from "./components/SavedSearchesContent";

export const metadata = createUserAreaMetadata(
  "Búsquedas guardadas",
  "Administra tus búsquedas y alertas de nuevos anuncios.",
);

export default function SavedSearchesPage() {
  return <SavedSearchesContent />;
}
