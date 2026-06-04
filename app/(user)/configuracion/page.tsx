"use client";

import { AlertCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ConfiguracionPage() {
  const [visibilidad, setVisibilidad] = useState([
    { id: 1, label: 'Mostrar badge de verificación', active: true },
    { id: 2, label: 'Mostrar antigüedad de la cuenta', active: true },
    { id: 3, label: 'Permitir reseñas en mi perfil', active: true },
  ]);

  const [privacidad, setPrivacidad] = useState([
    { id: 1, label: 'Mostrar mi número en anuncios', active: true },
    { id: 2, label: 'Permitir mensajes sin login', active: true },
    { id: 3, label: 'Aparecer en perfiles públicos', active: true },
    { id: 4, label: 'Compartir estadísticas con vendedores similares', active: true },
    { id: 5, label: 'Compartir estadísticas con vendedores similares', active: true },
    { id: 6, label: 'Compartir estadísticas con vendedores similares', active: true },
  ]);

  const toggleVisibilidad = (id: number) => {
    setVisibilidad(visibilidad.map(v => v.id === id ? { ...v, active: !v.active } : v));
  };

  const togglePrivacidad = (id: number) => {
    setPrivacidad(privacidad.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl">
      
      {/* Idioma y región */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Idioma y región</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="relative border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
            <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">Idioma</label>
            <select className="block w-full border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm outline-none appearance-none bg-transparent cursor-pointer">
              <option>Selecciona</option>
              <option>Español</option>
              <option>English</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
            <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">Moneda</label>
            <select className="block w-full border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm outline-none appearance-none bg-transparent cursor-pointer">
              <option>Selecciona</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
            <label className="absolute -top-2.5 left-2 bg-white px-1 text-xs text-gray-500">Zona Horaria</label>
            <select className="block w-full border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm outline-none appearance-none bg-transparent cursor-pointer">
              <option>Selecciona</option>
              <option>GMT-5 (Lima, Bogotá)</option>
              <option>GMT+1 (Madrid, París)</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
          Actualizar
        </button>
      </div>

      {/* Visibilidad */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Visibilidad</h2>
        <div className="space-y-4">
          {visibilidad.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-white">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <button 
                onClick={() => toggleVisibilidad(item.id)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  item.active ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacidad */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Privacidad</h2>
        <div className="space-y-4">
          {privacidad.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-white">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <button 
                onClick={() => togglePrivacidad(item.id)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  item.active ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Zona Peligrosa */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-red-100 rounded-full text-red-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-600 mb-1">Zona peligrosa</h2>
            <p className="text-sm text-gray-600">Pausa o elimina tu cuenta. Esta acción es irreversible.</p>
          </div>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors mt-2">
          Eliminar cuenta
        </button>
      </div>

    </div>
  );
}
