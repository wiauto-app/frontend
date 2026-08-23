"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DeleteAccountSection } from "@/app/usuario/perfil/components/DeleteAccountSection";

export const ConfiguracionContent = () => {
  const [visibilidad, setVisibilidad] = useState([
    { id: 1, label: "Mostrar badge de verificación", active: true },
    { id: 2, label: "Mostrar antigüedad de la cuenta", active: true },
    { id: 3, label: "Permitir reseñas en mi perfil", active: true },
  ]);

  const [privacidad, setPrivacidad] = useState([
    { id: 1, label: "Mostrar mi número en anuncios", active: true },
    { id: 2, label: "Permitir mensajes sin login", active: true },
    { id: 3, label: "Aparecer en perfiles públicos", active: true },
    { id: 4, label: "Compartir estadísticas con vendedores similares", active: true },
    { id: 5, label: "Compartir estadísticas con vendedores similares", active: true },
    { id: 6, label: "Compartir estadísticas con vendedores similares", active: true },
  ]);

  const toggleVisibilidad = (id: number) => {
    setVisibilidad(
      visibilidad.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  };

  const togglePrivacidad = (id: number) => {
    setPrivacidad(
      privacidad.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item,
      ),
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-lg font-bold text-gray-900">Visibilidad</h2>
        <div className="space-y-4">
          {visibilidad.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4"
            >
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
              <Button
                onClick={() => toggleVisibilidad(item.id)}
                variant="ghost"
                className={`relative h-6 w-11 shrink-0 rounded-full border-2 border-transparent p-0 ${
                  item.active ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.active ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-lg font-bold text-gray-900">Privacidad</h2>
        <div className="space-y-4">
          {privacidad.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4"
            >
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
              <Button
                onClick={() => togglePrivacidad(item.id)}
                variant="ghost"
                className={`relative h-6 w-11 shrink-0 rounded-full border-2 border-transparent p-0 ${
                  item.active ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.active ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <DeleteAccountSection />
    </div>
  );
};
