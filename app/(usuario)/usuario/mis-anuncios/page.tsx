import { Suspense } from "react";
import { createUserAreaMetadata } from "@/lib/metadata/create-user-area-metadata";
import { MyListing } from "./components/MyListing";

export const metadata = createUserAreaMetadata(
  "Mis anuncios",
  "Administra tus publicaciones, estadísticas y acciones de anuncio.",
);

export default function MisAnunciosPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando tus anuncios...</div>}>
      <MyListing />
    </Suspense>
  );
}
