import Link from 'next/link'
import React from 'react'


interface Insurer {
    id: number
    name: string
    tagline: string
    
}

export const InsurersCard = ({insurer}: {insurer: Insurer}) => {
  return (
    <div
                key={insurer.id}
                className="bg-white rounded-xl shadow-sm flex flex-col overflow-hidden border border-slate-100"
              >
                <div className="relative h-28 bg-white flex items-center justify-center overflow-hidden">
      
                  <div className="absolute top-0 left-0 w-12 h-full bg-blue-700" />
                  <div className="relative z-10 flex items-center gap-2 bg-white rounded-lg px-4 py-2  ml-10">
                    <div className="w-7 h-7 bg-blue-700 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs font-bold">W</span>
                    </div>
                    <span className="font-bold text-blue-700 text-lg">WiAuto</span>
                    <span className="text-slate-400 text-[9px] leading-tight hidden sm:block">
                      COMPRA VENDE FINANCIA
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-5 px-10 flex-1">
                  <p className="text-slate-600 text-lg">{insurer.tagline}</p>
                  <Link
                    href="#"
                    className="mt-auto w-full text-center bg-blue-700 hover:bg-blue-800 transition-colors text-white text-sm font-semibold py-2.5 rounded-lg"
                  >
                    Ver oferta
                  </Link>
                </div>
              </div>
  )
}
