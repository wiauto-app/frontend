"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export const ConfiguracionContent = () => {
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
    <div className="space-y-6 pb-20">
      
      {/* Idioma y región */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Idioma y región</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <Label className="mb-1.5 text-gray-500">Idioma</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 text-gray-500">Moneda</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 text-gray-500">Zona Horaria</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona" className="w-full"/>
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="gmt-5">GMT-5 (Lima, Bogotá)</SelectItem>
                <SelectItem value="gmt+1">GMT+1 (Madrid, París)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="w-full">
          Actualizar
        </Button>
      </div>

      {/* Visibilidad */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Visibilidad</h2>
        <div className="space-y-4">
          {visibilidad.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-white">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <Button 
                onClick={() => toggleVisibilidad(item.id)}
                variant="ghost"
                className={`relative h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent p-0 ${
                  item.active ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </Button>
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
              <Button 
                onClick={() => togglePrivacidad(item.id)}
                variant="ghost"
                className={`relative h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent p-0 ${
                  item.active ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </Button>
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
        <Button variant="destructive" className="mt-2">
          Eliminar cuenta
        </Button>
      </div>

    </div>
  );
}
