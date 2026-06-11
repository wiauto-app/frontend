import React from 'react'
import { Slider } from "@/components/ui/slider"

interface TrafficChartProps {
  data: {
    busquedaWiAuto: number,
    busquedaGeneral: number,
    compartido: number,
    otros: number,    
  }
}

export const TrafficChart = ({data}: TrafficChartProps) => {
  return (
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Procendencia del trafico</h2>
              
              <div className='flex flex-col gap-2'>
              <div className='space-y-4'> 
                  <div className='flex flex-row justify-between'>
                    Busqueda wiAuto
                  <div className='flex flex-row gap-2'>
                    <p>312</p>
                    <p>100%</p>
                  </div>
                     </div>
                     
                <Slider
                    value={[data.busquedaWiAuto||0]} 
                    min={0}
                    max={100}
                    className="w-full"
                  />
               
              </div>
              <div className='space-y-4'> 
                  <div className='flex flex-row justify-between'>
                    Busqueda wiAuto
                  <div className='flex flex-row gap-2'>
                    <p>312</p>
                    <p>100%</p>
                  </div>
                     </div>
                     
                <Slider
                    value={[data.busquedaGeneral||0]} 
                    min={0}
                    max={100}
                    className="w-full"
                  />
               
              </div>
              <div className='space-y-4'> 
                  <div className='flex flex-row justify-between'>
                    Compartido
                  <div className='flex flex-row gap-2'>
                    <p>312</p>
                    <p>100%</p>
                  </div>
                     </div>
                     
                <Slider
                    value={[data.compartido]} 
                    min={0}
                    max={100}
                    className="w-full"
                  />
               
              </div>
              <div className='space-y-4'> 
                  <div className='flex flex-row justify-between'>
                    Otros
                  <div className='flex flex-row gap-2'>
                    <p>312</p>
                    <p>100%</p>
                  </div>
                     </div>
                     
                <Slider
                    value={[data.otros||0]} 
                    min={0}
                    max={100}
                    className="w-full"
                  />
               
              </div>
              </div>
    </div>
  )
}
