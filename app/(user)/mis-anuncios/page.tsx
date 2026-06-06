"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, MoreVertical, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function MisAnunciosPage() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownElement = document.querySelector('[data-dropdown-menu]');
      if (openDropdown !== null && dropdownElement && !dropdownElement.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  const anuncios = Array(5).fill({
    title: "Toyota Song PLus",
    details: "$28,900 - 12,500 Km",
    views: 159,
    viewsTrend: "+8.5% mes anterior",
    chats: 16,
    chatsTrend: "+8.5% mes anterior",
    status: "Activo",
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Mis anuncios</h1>
        </div>
        <Link 
          href="/crear-vehiculo" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Nuevo anuncio
        </Link>
      </div>

      {/* Lista de Anuncios */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {anuncios.map((anuncio, index) => (
            <div key={index} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
              
              {/* Info de Vehículo */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden relative flex-shrink-0">
                  {/* Imagen placeholder */}
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <path d="M9 17h6" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{anuncio.title}</h3>
                  <p className="text-sm text-gray-500">{anuncio.details}</p>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="flex items-center gap-8 md:gap-16">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Vistas</p>
                  <p className="font-semibold text-gray-900">{anuncio.views}</p>
                  <p className="text-[10px] text-yellow-600 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> {anuncio.viewsTrend}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Chat</p>
                  <p className="font-semibold text-gray-900">{anuncio.chats}</p>
                  <p className="text-[10px] text-yellow-600 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> {anuncio.chatsTrend}
                  </p>
                </div>
              </div>

              {/* Estado y Acciones */}
              <div className="flex items-center gap-4 relative">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  {anuncio.status}
                </span>
                
                <Button 
                  onClick={() => toggleDropdown(index)}
                  variant="ghost"
                  size="icon"
                  className="text-blue-500 hover:bg-blue-50"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>

                {/* Menú Desplegable de Acciones */}
                {openDropdown === index && (
                  <div data-dropdown-menu className="absolute right-0 top-10 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10 flex flex-col">
                    <Button variant="ghost" className="w-full justify-start rounded-none px-4 py-2 text-sm text-gray-700">
                      Editar
                    </Button>
                    <Button variant="ghost" className="w-full justify-start rounded-none px-4 py-2 text-sm text-gray-700">
                      Duplicar
                    </Button>
                    <Button variant="ghost" className="w-full justify-start rounded-none px-4 py-2 text-sm text-gray-700">
                      Programar
                    </Button>
                    <Button variant="ghost" className="w-full justify-start rounded-none px-4 py-2 text-sm text-gray-700">
                      Eliminar
                    </Button>
                    <Button variant="ghost" className="w-full justify-start rounded-none px-4 py-2 text-sm text-gray-700">
                      Inactivar
                    </Button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
