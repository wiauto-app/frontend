"use client";

import { HelpCircle, Star, RefreshCw, BarChart3 } from "lucide-react";

const helpItems = [
  {
    icon: BarChart3,
    title: "Rendimiento de tus anuncios",
    description:
      "Las métricas muestran visitas, contactos y favoritos de los últimos 30 días comparados con el periodo anterior.",
  },
  {
    icon: Star,
    title: "Destacar un vehículo",
    description:
      "El destacado es un servicio premium de pago único. Tu anuncio aparecerá primero en los listados durante 30 días.",
  },
  {
    icon: RefreshCw,
    title: "Renovar gratis",
    description:
      "La renovación gratuita actualiza la fecha de publicación y mejora la posición en búsqueda. Tiene un intervalo mínimo de 7 días.",
  },
  {
    icon: HelpCircle,
    title: "Estados del anuncio",
    description:
      "Un anuncio activo es visible para compradores. Puedes pausarlo, programar su publicación o eliminarlo desde el menú de acciones.",
  },
];

export const MyListingsHelpSection = () => {
  return (
    <section
      id="ayuda-mis-anuncios"
      className="scroll-mt-24 rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-900">Guía rápida</h2>
      <p className="mt-1 text-sm text-gray-500">
        Todo lo que necesitas saber para sacar el máximo partido a tus publicaciones.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {helpItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                <Icon className="size-4" aria-hidden />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
