"use client";

import { useState } from "react";
import { SimulatorTopBar } from "./SimulatorTopBar";
import { Camera, Info, Wallet, CalendarDays, Percent, CarFront } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/home/VehicleCard";
import { ControlCard } from "./ControlCard";

export const SimuladorContent = () => {
const [vehiclePrice, setVehiclePrice] = useState(150000);
  const [initialPercent, setInitialPercent] = useState(20);
  const [termMonths, setTermMonths] = useState(48);
  const [interestRate, setInterestRate] = useState(12.0);

  const initialPayment = vehiclePrice * (initialPercent / 100);
  const financedAmount = vehiclePrice - initialPayment;

  let monthlyPayment = 0;
  if (interestRate === 0) {
    monthlyPayment = financedAmount / termMonths;
  } else {
    const r = (interestRate / 100) / 12;
    const n = termMonths;
    monthlyPayment = financedAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const totalInterest = Math.max(0, (monthlyPayment * termMonths) - financedAmount);
  const totalToPay = initialPayment + (monthlyPayment * termMonths);

  const formatCurrency = (val: number) => `$${Math.round(val).toLocaleString('en-US')}`;

    return (
        <div className="min-h-screen bg-[#f1f5f9]">
              <SimulatorTopBar />
              <section className="py-8 container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column */}
                  <div className="lg:col-span-8 flex flex-col gap-4">
                    
                    {/* Top Car Info Card */}
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-[0_2px_10px_rgba(15,23,42,0.04)] flex flex-col md:flex-row gap-6">
                      <div className="relative w-full md:w-64 h-48 md:h-auto bg-slate-100 rounded-lg overflow-hidden shrink-0">
                         <Image 
                           src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800" 
                           alt="Trailblazer" 
                           fill 
                           className="object-cover" 
                         />
                         <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded bg-black/50 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                           <Camera className="size-3" />
                           3
                         </span>
                         <div className="absolute bottom-0 left-0 h-1 w-full bg-slate-200">
                            <div className="h-full bg-blue-600" style={{ width: `${(initialPercent / 70) * 100}%` }} />
                         </div>
                      </div>
                      
                      <div className="flex flex-col flex-1 justify-center">
                         <div>
                            <p className="text-[11px] font-bold uppercase tracking-wide text-blue-600 mb-1">NEW CHEVROLET</p>
                            <h2 className="text-2xl font-bold text-slate-900">Trailblazer</h2>
                         </div>
                         
                         <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 mt-5">
                            <div>
                              <p className="text-xs text-slate-500 font-medium mb-1">Precio justo</p>
                              <p className="text-2xl font-bold text-red-600">{formatCurrency(vehiclePrice)}</p>
                              <p className="text-xs text-slate-500 mt-1">Garantía 1 año - IGIC incluido</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-medium mb-1">Precio financiado: {formatCurrency(financedAmount)}</p>
                              <p className="text-2xl font-bold text-slate-900">{formatCurrency(monthlyPayment)}/mes*</p>
                            </div>
                         </div>
        
                         <div className="flex gap-2 mt-5">
                            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">Reservable</span>
                            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">Profesional</span>
                         </div>
                      </div>
                    </div>
        
                    {/* Sliders */}
                    <ControlCard 
                      icon={<CarFront className="h-5 w-5 text-blue-600" />}
                      title="Precio del vehículo"
                      valueStr={formatCurrency(vehiclePrice)}
                      minStr="$5,000"
                      maxStr="$150,000"
                      sliderValue={[vehiclePrice]}
                      sliderMin={5000}
                      sliderMax={150000}
                      step={1000}
                      onValueChange={(val) => setVehiclePrice(val[0])}
                    />
                    <ControlCard 
                      icon={<Wallet className="h-5 w-5 text-blue-600" />}
                      title="Cuota inicial"
                      valueStr={`${initialPercent}% · ${formatCurrency(initialPayment)}`}
                      minStr="0% · $0"
                      maxStr={`70% · ${formatCurrency(vehiclePrice * 0.7)}`}
                      sliderValue={[initialPercent]}
                      sliderMin={0}
                      sliderMax={70}
                      step={1}
                      onValueChange={(val) => setInitialPercent(val[0])}
                    />
                    <ControlCard 
                      icon={<CalendarDays className="h-5 w-5 text-blue-600" />}
                      title="Plaza"
                      valueStr={`${termMonths} meses (${(termMonths/12).toFixed(1)} años)`}
                      minStr="12 meses (1.0 años)"
                      maxStr="84 meses (7.0 años)"
                      sliderValue={[termMonths]}
                      sliderMin={12}
                      sliderMax={84}
                      step={12}
                      onValueChange={(val) => setTermMonths(val[0])}
                    />
                    <ControlCard 
                      icon={<Percent className="h-5 w-5 text-blue-600" />}
                      title="Tasa de interés anual"
                      valueStr={`${interestRate.toFixed(1)}% anual`}
                      minStr="0.0% anual"
                      maxStr="25.0% anual"
                      sliderValue={[interestRate]}
                      sliderMin={0}
                      sliderMax={25}
                      step={0.5}
                      onValueChange={(val) => setInterestRate(val[0])}
                    />
        
                    {/* Warning */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 mt-2 shadow-sm">
                       <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                       <div>
                         <p className="text-sm font-semibold text-slate-900">Aviso</p>
                         <p className="text-xs text-slate-500 mt-1 leading-relaxed">Esta es una simulación referencial. Los valores reales pueden variar según el banco, perfil crediticio y seguros aplicables.</p>
                       </div>
                    </div>
        
                  </div>
        
                  {/* Right Column - Summary */}
                  <div className="lg:col-span-4">
                     <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(15,23,42,0.08)] overflow-hidden sticky top-8">
                        {/* Header */}
                        <div className="bg-[#0b1c3c] p-6 text-white"> 
                           <p className="text-xs font-semibold tracking-wide uppercase text-blue-200">Cuota mensual estimada</p>
                           <p className="text-4xl font-bold mt-2">{formatCurrency(monthlyPayment)}</p>
                           <p className="text-[11px] text-blue-400 mt-1.5 font-medium">durante {termMonths} meses</p>
                        </div>
                        
                        {/* Body */}
                        <div className="p-6">
                           <div className="flex flex-col gap-4 text-sm">
                             <div className="flex justify-between border-b border-slate-100 pb-4">
                                <span className="text-slate-500">Cuota inicial</span>
                                <span className="font-semibold text-slate-900">{formatCurrency(initialPayment)}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-4">
                                <span className="text-slate-500">Monto a financiar</span>
                                <span className="font-semibold text-slate-900">{formatCurrency(financedAmount)}</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-4">
                                <span className="text-slate-500">Porcentaje de interés</span>
                                <span className="font-semibold text-slate-900">{interestRate.toFixed(1)}%</span>
                             </div>
                             <div className="flex justify-between border-b border-slate-100 pb-4">
                                <span className="text-slate-500">Interés total</span>
                                <span className="font-semibold text-slate-900">{formatCurrency(totalInterest)}</span>
                             </div>
                             <div className="flex justify-between pt-2 items-center">
                                <span className="text-slate-500">Total a pagar</span>
                                <span className="font-bold text-xl text-slate-900">{formatCurrency(totalToPay)}</span>
                             </div>
                           </div>
        
                           <div className="mt-8 flex flex-col gap-3">
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 text-[13px] font-semibold transition-colors shadow-sm">
                                 Solicitar Pre-Aprobación
                              </Button>
                              <Button variant="outline" className="w-full rounded-lg h-12 text-[13px] font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                 Comparar bancos aliados
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
        
                </div>
        
                {/* Bottom Section */}
                <div className="mt-24 mb-12 text-center">
                   <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">
                      Te puede <span className="text-blue-600">interesar</span>
                   </h2>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
                      {[1, 2, 3, 4].map((i) => (
                        <VehicleCard
                          key={i}
                          id={`car-${i}`}
                          badge="NEW CHEVROLET"
                          title="Trailblazer"
                          price="19,000 €"
                          imageSrc={`https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800`}
                          photoCount={3}
                          progress={0.2}
                        />
                      ))}
                   </div>
                </div>
              </section>
            </div>
    )
}

