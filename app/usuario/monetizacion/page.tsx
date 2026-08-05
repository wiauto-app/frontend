import { Suspense } from "react";
import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { MonetizacionContent } from "./components/MonetizacionContent";

export const metadata = createUserAreaMetadata(
  "Monetización",
  "Consulta planes, complementos y facturación de tu cuenta.",
);

export default function MonetizacionPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando monetización...</div>}>
      <MonetizacionContent />
    </Suspense>
  );
}
