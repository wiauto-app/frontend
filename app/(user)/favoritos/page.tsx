"use client";

import { LayoutGrid, Folder, MoreHorizontal, Camera } from "lucide-react";

export default function FavoritosPage() {
  const folders = Array(4).fill({
    name: "Para comparar",
    count: "4 autos"
  });

  const favorites = Array(4).fill({
    brand: "NEW LAMBORGHINI",
    model: "Urus",
    tag: "Oportunidad",
    currentPrice: "$28,900",
    priceHistory: "-$1,400",
    publishedDate: "15 de Feb, 2025",
    confidenceScore: "Score confianza 92%",
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Favoritos</h1>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Nueva carpeta
        </button>
      </div>

      {/* Folders */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {folders.map((folder, index) => (
          <div 
            key={index} 
            className={`flex-shrink-0 w-56 p-4 rounded-xl border flex items-start justify-between cursor-pointer transition-colors ${
              index === 0 
                ? "bg-blue-50 border-blue-200" 
                : "bg-white border-gray-100 hover:border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${index === 0 ? "bg-blue-100 text-blue-600" : "bg-gray-50 text-gray-400"}`}>
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${index === 0 ? "text-gray-900" : "text-gray-700"}`}>
                  {folder.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{folder.count}</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Favorites List */}
      <div className="space-y-4">
        {favorites.map((car, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col md:flex-row gap-6">
            
            {/* Image Placeholder */}
            <div className="w-full md:w-64 h-48 bg-gray-200 rounded-lg overflow-hidden relative flex-shrink-0">
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                <Camera className="w-8 h-8 opacity-50" />
              </div>
              {/* Photo Icon Badge */}
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm p-1.5 rounded-md text-white">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-blue-600 font-bold text-xs tracking-wider uppercase">
                    {car.brand}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide">
                    {car.tag}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{car.model}</h2>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] text-gray-500 mb-1">Precio actual</p>
                    <p className="font-semibold text-green-600 text-sm sm:text-base">{car.currentPrice}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] text-gray-500 mb-1">Historia del precio</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{car.priceHistory}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] text-gray-500 mb-1">Publicado</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{car.publishedDate}</p>
                  </div>
                </div>
              </div>

              {/* Trust Score */}
              <div>
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {car.confidenceScore}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 md:w-32 justify-center">
              <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg transition-colors">
                Alertar precio
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 rounded-lg transition-colors">
                Recordar
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Contactar
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
