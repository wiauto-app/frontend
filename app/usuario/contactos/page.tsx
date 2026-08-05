import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { ContactosContent } from "./components/ContactosContent";
import { Suspense } from "react";
import { LoadingComponent } from "@/components/ui/loadingComponent";

export const metadata = createUserAreaMetadata(
  "Contactos / Leads",
  "Consulta los leads y solicitudes de contacto de tus anuncios.",
);

export default function ContactosPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ContactosContent />
    </Suspense>
  );
}
