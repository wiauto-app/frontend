import { Suspense } from "react";
import { MonetizacionContent } from "./components/MonetizacionContent";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Monetización",
  description: "Consulta planes, complementos y facturación de tu cuenta.",
}

export default function MonetizacionPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando monetización...</div>}>
      <MonetizacionContent />
    </Suspense>
  );
}
