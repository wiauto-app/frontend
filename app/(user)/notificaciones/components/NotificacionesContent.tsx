"use client";

import { LayoutGrid, Smartphone, Mail, Monitor, Bell, Bookmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export const NotificacionesContent = () => {
  const [canales, setCanales] = useState([
    { id: 'push', label: 'Push móvil', icon: Smartphone, active: true },
    { id: 'email', label: 'Email', icon: Mail, active: true },
    { id: 'inapp', label: 'In-app', icon: Monitor, active: true },
  ]);

  const [alertas, setAlertas] = useState([
    { id: 1, label: 'Nuevos anuncios en búsquedas guardadas', active: true },
    { id: 2, label: 'Nuevos anuncios en búsquedas guardadas', active: true },
    { id: 3, label: 'Cambio de estado: reservado, vendido, actualizado', active: true },
    { id: 4, label: 'Nuevo mensaje en chat', active: true },
    { id: 5, label: 'Citas y pruebas agendadas', active: true },
    { id: 6, label: 'Recordatorios comerciales', active: true },
  ]);

  const toggleCanal = (id: string) => {
    setCanales(canales.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const toggleAlerta = (id: number) => {
    setAlertas(alertas.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const recientes = [
    {
      id: 1,
      type: 'price_drop',
      title: 'Bajada de precio: Tesla Model 3',
      description: '$47,900 → $45,500 en uno de tus favoritos',
      time: 'HACE 5 MIN',
      unread: true,
      icon: Smartphone
    },
    {
      id: 2,
      type: 'message',
      title: 'Nuevo mensaje de Carlos M.',
      description: '"¿Sigue disponible el BYD?"',
      time: 'HACE 18 MIN',
      unread: false,
      isAvatar: true,
      avatarInitial: 'C'
    },
    {
      id: 3,
      type: 'search',
      title: '3 nuevos anuncios coinciden con SUV híbrido < $30k',
      description: 'Búsqueda guardada actualizada',
      time: 'HACE 1 HORA',
      unread: true,
      icon: Bell
    },
    {
      id: 4,
      type: 'status',
      title: 'Tu anuncio Mercedes Clase E fue marcado como Reservado',
      description: 'Cambio de estado automático',
      time: 'HACE 5 MIN',
      unread: true,
      icon: Bookmark
    },
    {
      id: 5,
      type: 'price_drop',
      title: 'Bajada de precio: Tesla Model 3',
      description: '$47,900 → $45,500 en uno de tus favoritos',
      time: 'HACE 5 MIN',
      unread: true,
      icon: Smartphone
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
        </div>
        <Button>
          Nueva búsqueda
        </Button>
      </div>

      {/* Canales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Canales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
          {canales.map((canal) => {
            const Icon = canal.icon;
            return (
              <div key={canal.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3 text-gray-700">
                  <Icon className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">{canal.label}</span>
                </div>
                {/* Toggle */}
                <Button 
                  onClick={() => toggleCanal(canal.id)}
                  variant="ghost"
                  className={`relative h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent p-0 ${
                    canal.active ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      canal.active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Recientes</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recientes.map((item) => (
            <div key={item.id} className="p-6 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
              {/* Icon / Avatar */}
              {item.isAvatar ? (
                <div className="w-10 h-10 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold flex-shrink-0">
                  {item.avatarInitial}
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  {item.icon && <item.icon className="w-5 h-5" />}
                </div>
              )}

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                <p className="text-[10px] font-semibold text-gray-400 mt-2 tracking-wide">
                  {item.time}
                </p>
              </div>

              {/* Status / Action */}
              <div className="flex flex-col items-end gap-2">
                {item.unread ? (
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1"></div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mt-1 mb-2"></div>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tipos de alertas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Tipos de alertas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alertas.map((alerta) => (
            <div key={alerta.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
              <span className=" text-[8px] md:text-sm text-gray-700">{alerta.label}</span>
              {/* Toggle */}
              <Button 
                onClick={() => toggleAlerta(alerta.id)}
                variant="ghost"
                className={`relative h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent p-0 ${
                  alerta.active ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    alerta.active ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
