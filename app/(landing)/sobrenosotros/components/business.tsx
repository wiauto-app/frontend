import React from 'react'
import { FilePlus } from 'lucide-react'

const features = [
  {
    title: "Business Strategy",
    description:
      "Pore et dolore magna aliqua. strud exercitation laboris nisi uot aliq uip ex emattersa never",
  },
  {
    title: "Business Strategy",
    description:
      "Pore et dolore magna aliqua. strud exercitation laboris nisi uot aliq uip ex emattersa never",
  },
  {
    title: "Business Strategy",
    description:
      "Pore et dolore magna aliqua. strud exercitation laboris nisi uot aliq uip ex emattersa never",
  },
]

export const Business = () => {
  return (
    <div className="w-full bg-[#0b1d3a] rounded-2xl px-12 py-14 my-16 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-white mb-1">Loremp ipsum leo</h2>
      <h3 className="text-xl text-slate-300 font-light mb-10">
        loremp ipsm loremp ipsum loremp
      </h3>
      <p className="text-sm text-slate-400 text-center max-w-2xl mb-14 leading-relaxed">
        Diseñamos, instalamos y gestionamos el mantenimiento de salas blancas y
        áreas estériles.Diseñamos, instalamos y gestionamos el mantenimiento de
        salas blancas y áreas estériles. Diseñamos, instalamos y gestionamos el
        mantenimiento de salas blancas y áreas
        estériles.Diseñamos, instalamos y gestionamos el mantenimiento de salas
        blancas y áreas estériles.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-row items-start gap-4">
            <div className="relative w-14 h-14 flex-shrink-0">
              <div className="absolute inset-0 bg-white rounded-full opacity-10" />
              <div className="absolute inset-[6px] bg-blue-700 rounded-full" />
              <FilePlus
                className="absolute inset-0 m-auto w-7 h-7 text-blue-300"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-2">
                {feature.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
