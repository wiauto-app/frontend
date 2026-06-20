"use client";

import { Slider } from "@/components/ui/slider"




export const ControlCard = ({ icon, title, valueStr, minStr, maxStr, sliderValue, sliderMin = 0, sliderMax = 100, step = 1, onValueChange }: any) => {
  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)] flex flex-col gap-5">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
               {icon}
            </div>
            <span className="font-semibold text-[15px] text-slate-800">{title}</span>
         </div>
         <span className="font-bold text-lg text-slate-900">{valueStr}</span>
      </div>
      <div className="px-1 mt-2">
         <Slider 
            value={sliderValue} 
            min={sliderMin} 
            max={sliderMax} 
            step={step} 
            onValueChange={onValueChange} 
            className="mb-3" 
         />
         <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>{minStr}</span>
            <span>{maxStr}</span>
         </div>
      </div>
    </div>
  )
}