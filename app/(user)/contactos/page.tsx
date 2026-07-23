import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { ContactosContent } from "./components/ContactosContent";

export const metadata = createUserAreaMetadata(
  "Contactos / Leads",
  "Consulta los leads y solicitudes de contacto de tus anuncios.",
);

export default function ContactosPage() {
  return <ContactosContent />;
}
