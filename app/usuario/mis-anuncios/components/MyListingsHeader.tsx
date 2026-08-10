import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MyListingsHeader = () => {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Mis coches</h1>
        <p className="text-sm text-gray-500 max-w-xl">
          Gestiona tus anuncios, revisa el rendimiento y destaca los vehículos que
          quieras vender antes.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Button
          variant="outline"
          className="border-gray-200 text-gray-700"
          nativeButton={false}
          render={
            <Link href="#ayuda-mis-anuncios" aria-label="Ir a la guía rápida" />
          }
        >
          <BookOpen className="size-4" aria-hidden />
          Guía rápida
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          nativeButton={false}
          render={<Link href="/publicar" aria-label="Crear nuevo anuncio" />}
        >
          <Plus className="size-4" aria-hidden />
          Nuevo anuncio
        </Button>
      </div>
    </header>
  );
};
