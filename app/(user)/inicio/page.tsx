"use client";

import { LayoutGrid, TrendingUp, TrendingDown, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function UserDashboard() {
  const stats = [
    { label: "Mensual Vistas", value: "2,481", change: "+21.01%", positive: true },
    { label: "Mensual Mensajes", value: "47", change: "+18.34%", positive: true },
    { label: "Mensual Favoritos", value: "184", change: "-3.69%", positive: false },
    { label: "Mensual Conversión", value: "3.4%", change: "+21.01%", positive: true },
  ];

  const activePublications = Array(4).fill({
    title: "Toyota Song PLus",
    location: "AutoPlaza Lima",
    price: "$29 k",
    image: "/images/car-placeholder.jpg" // We'll assume there is an image, or use a gray box
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <LayoutGrid className="w-6 h-6 text-gray-700" />
        <h1 className="text-2xl font-bold text-gray-900">Inicio</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.label}</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-xs font-medium flex items-center gap-1 mt-1 ${stat.positive ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.change} {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                </p>
              </div>
              {/* Fake Sparkline */}
              <div className="w-16 h-8 flex items-end opacity-60">
                <svg viewBox="0 0 100 30" className={`w-full h-full ${stat.positive ? 'stroke-blue-500' : 'stroke-red-400'}`} fill="none" strokeWidth="2">
                  <path d={stat.positive ? "M0 30 L20 20 L40 25 L60 10 L80 15 L100 0" : "M0 0 L20 15 L40 10 L60 25 L80 20 L100 30"} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Publications */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Tus publicaciones activas</h2>
          <Link href="/mis-anuncios" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Ver Todas <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {activePublications.map((pub, i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden relative">
                  {/* Fallback image if actual not available */}
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                     <Car className="text-gray-400 w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{pub.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    {/* Location icon could go here */}
                    {pub.location}
                  </p>
                </div>
              </div>
              <div className="font-semibold text-gray-900">
                {pub.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips / Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Sube fotos a la luz del día</h3>
          <p className="text-sm text-gray-600 mb-4">Las publicaciones con fotos al exterior tienen 3x más vistas.</p>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Verifica tu identidad</h3>
          <p className="text-sm text-gray-600 mb-4">Los vendedores verificados venden 40% más rápido.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Verificar
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline Car icon just for the fallback
function Car(props: any) {
  return (
    <svg
      {...props}
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
  )
}
