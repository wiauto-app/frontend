import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { FavoritosContent } from "./components/FavoritosContent";

export const metadata = createUserAreaMetadata(
  "Favoritos",
  "Gestiona tus vehículos guardados y carpetas de favoritos.",
);

export default function FavoritosPage() {
  return <FavoritosContent />;
}
