"use client";

import { LayoutGrid, Search, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";

export default function BusquedasGuardadasPage() {
  const [alertas, setAlertas] = useState([
    { id: 1, active: true },
    { id: 2, active: true },
    { id: 3, active: true },
    { id: 4, active: true },
    { id: 5, active: true },
    { id: 6, active: true },
  ]);

  const toggleAlerta = (id: number) => {
    setAlertas(alertas.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const searches = Array(3).fill({
    title: "SUV híbrido < $30k",
    tags: ["SUV", "Híbrido", "$0 - $30,000", "2016+", "Diesel", "Pickup"],
    newMatches: 12
  });

  return (
    <div className="space-y-6 pb-20 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Búsquedas guardadas</h1>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Nueva búsqueda
        </button>
      </div>

      {/* Lista de Búsquedas Guardadas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-4">
        {searches.map((search, idx) => (
          <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors gap-4">
            <div className="flex-1 space-y-3">
              <h3 className="font-semibold text-gray-900">{search.title}</h3>
              <div className="flex flex-wrap gap-2">
                {search.tags.map((tag: string, tagIdx: number) => (
                  <span key={tagIdx} className="bg-gray-50 text-gray-500 border border-gray-100 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto">
              <div className="text-center md:text-right">
                <p className="text-xs text-gray-500 mb-0.5">Nuevos</p>
                <p className="font-bold text-gray-900 text-lg">{search.newMatches}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 rounded-md transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-500 hover:text-red-700 border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-md transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tipos de alerta activas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Tipos de alerta activas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertas.map((alerta) => (
            <div key={alerta.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-white">
              <div>
                <p className="text-sm font-semibold text-gray-900">Nuevos anuncios que coinciden</p>
                <p className="text-xs text-gray-500 mt-1">Te avisamos al instante</p>
              </div>
              
              {/* Toggle Switch */}
              <button 
                onClick={() => toggleAlerta(alerta.id)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  alerta.active ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    alerta.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
