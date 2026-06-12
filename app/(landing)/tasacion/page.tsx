import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { InsurersCard } from './componets/insurersCard'

const insurers = [
  { id: 1, name: 'Mapfre', tagline: 'Cámbiate, te mejoramos el precio, directamente' },
  { id: 2, name: 'Allianz', tagline: 'Cámbiate, te mejoramos el precio, directamente' },
  { id: 3, name: 'AXA', tagline: 'Cámbiate, te mejoramos el precio, directamente' },
  { id: 4, name: 'Zurich', tagline: 'Cámbiate, te mejoramos el precio, directamente' },
  { id: 5, name: 'Generali', tagline: 'Cámbiate, te mejoramos el precio, directamente' },
  { id: 6, name: 'Mutua Madrileña', tagline: 'Cámbiate, te mejoramos el precio, directamente' },
]

const TasacionPage = () => {
  return (
    <>
      <div className="w-full bg-[#DBE6F8] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-start mb-4 flex items-center gap-3">
            <span className="text-black">Seguros de </span>
            <span className="text-blue-700"> coches</span>
          </h1>
          <div className="w-20 h-1 bg-blue-700 mt-4" />
        </div>
      </div>

      <div className="bg-[#F3F5F9] py-10 px-4 flex flex-col gap-8">
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-8">

          <div className="text-center flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-slate-900">
              Encuentra el seguro ideal para tu coche
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl mx-auto">
              Compara ofertas de las principales aseguradoras en un solo lugar. Analiza coberturas,
              precios y beneficios para elegir la opción que mejor se adapte a ti y a tu vehículo,
              de forma rápida y sencilla.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {insurers.map((insurer) => (
              <InsurersCard key={insurer.id} insurer={insurer}/>
            ))}
          </div>

          <div className="bg-[#0D1B3E] rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex flex-col gap-2">
              <h3 className="text-white text-xl font-bold">
                Asegura tu coche hoy mismo
              </h3>
              <p className="text-slate-400 text-sm max-w-md">
                Obtén las mejores ofertas personalizadas en minutos y conduce con total tranquilidad.
                Sin complicaciones, sin llamadas innecesarias.
              </p>
            </div>
            <Link
              href="#"
              className="shrink-0 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-semibold px-6 py-3 rounded-lg whitespace-nowrap"
            >
              Comparar seguros ahora
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}

export default TasacionPage