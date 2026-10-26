import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { NewsletterPreferencesContent } from "./components/NewsletterPreferencesContent";

export const metadata = createUserAreaMetadata(
  "Newsletter",
  "Configura canales y categorías de alertas de noticias de tu cuenta.",
);

export default function NewsletterPage() {
  return <NewsletterPreferencesContent />;
}
