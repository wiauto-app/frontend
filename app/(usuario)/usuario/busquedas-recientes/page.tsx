import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { RecentSearchesContent } from "./components/RecentSearchesContent";

export const metadata = createUserAreaMetadata(
  "Búsquedas recientes",
  "Retoma tus últimas búsquedas de vehículos en un clic.",
);

export default function RecentSearchesPage() {
  return <RecentSearchesContent />;
}
