'use client';
import React from 'react'
import { LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { ReportesGrid } from './reportesGrid';
import { ReportesMesGrid } from './reportesMesGrid';
import { ReporteTable } from './reporteTable';
import { TrafficChart } from './trafficChart';
import { RecomendationCard } from './recomendationCard';


export const ReportesContent = () => {
    const handleExportPDF = () => {
        console.log('Exportar pdf')
    }
    const handleLast30Days = () => {
        console.log('Ultimos 30 dias')
    }

    const reports = [
      {
        id: 1,
        name: 'Stock Activo',
        number:2481,
        percentage:21.01,
        chartData: [
          { month: "January",year:2022, desktop: 186, mobile: 80 },
  { month: "February",year:2023, desktop: 305, mobile: 200 },
  { month: "March",year:2024, desktop: 237, mobile: 120 },
  { month: "April",year:2025, desktop: 73, mobile: 190 },
  { month: "May",year:2026, desktop: 209, mobile: 130 },
  { month: "June",year:2027, desktop: 214, mobile: 140 },
        ],
      },
      {
        id: 2,
        name: 'Vistas',
        number:47,
        percentage:18.34,
        chartData: [
     { month: "January",year:2022, desktop: 186, mobile: 80 },
  { month: "February",year:2023, desktop: 305, mobile: 200 },
  { month: "March",year:2024, desktop: 237, mobile: 120 },
  { month: "April",year:2025, desktop: 73, mobile: 190 },
  { month: "May",year:2026, desktop: 209, mobile: 130 },
  { month: "June",year:2027, desktop: 214, mobile: 140 },
        ],
      },
      {
        id: 3,
        name: 'Leads',
        number:184,
        percentage:-7.69,
        chartData: [
     { month: "January",year:2022, desktop: 186, mobile: 80 },
  { month: "February",year:2023, desktop: 305, mobile: 200 },
  { month: "March",year:2024, desktop: 237, mobile: 120 },
  { month: "April",year:2025, desktop: 73, mobile: 190 },
  { month: "May",year:2026, desktop: 209, mobile: 130 },
  { month: "June",year:2027, desktop: 214, mobile: 140 },
        ],
      },
      {
        id: 4,
        name: 'Ventas',
        number:642000,
        percentage:21.01,
        chartData: [
          { month: "January", desktop: 186 },
          { month: "February", desktop: 305 },
          { month: "March", desktop: 237 },
          { month: "April", desktop: 73 },
          { month: "May", desktop: 209 },
          { month: "June", desktop: 214 },
        ],
      },
    ]
    const reports2 = [
      {
        id: 1,
        name: 'Stock Activo',
        number:2481,
        percentage:21.01,
        chartData: [
          { month: "January",year:2022, desktop: 186, mobile: 80 },
  { month: "February",year:2023, desktop: 305, mobile: 200 },
  { month: "March",year:2024, desktop: 237, mobile: 120 },
  { month: "April",year:2025, desktop: 73, mobile: 190 },
  { month: "May",year:2026, desktop: 209, mobile: 130 },
  { month: "June",year:2027, desktop: 214, mobile: 140 },
        ],
      },
      {
        id: 2,
        name: 'Vistas',
        number:47,
        percentage:18.34,
        chartData: [
     { month: "January",year:2022, desktop: 186, mobile: 80 },
  { month: "February",year:2023, desktop: 305, mobile: 200 },
  { month: "March",year:2024, desktop: 237, mobile: 120 },
  { month: "April",year:2025, desktop: 73, mobile: 190 },
  { month: "May",year:2026, desktop: 209, mobile: 130 },
  { month: "June",year:2027, desktop: 214, mobile: 140 },
        ],
      },
      {
        id: 3,
        name: 'Leads',
        number:184,
        percentage:-7.69,
        chartData: [
     { month: "January",year:2022, desktop: 186, mobile: 80 },
  { month: "February",year:2023, desktop: 305, mobile: 200 },
  { month: "March",year:2024, desktop: 237, mobile: 120 },
  { month: "April",year:2025, desktop: 73, mobile: 190 },
  { month: "May",year:2026, desktop: 209, mobile: 130 },
  { month: "June",year:2027, desktop: 214, mobile: 140 },
        ],
      },
      {
        id: 4,
        name: 'Ventas',
        number:642000,
        percentage:21.01,
        chartData: [
          { month: "January", desktop: 186 },
          { month: "February", desktop: 305 },
          { month: "March", desktop: 237 },
          { month: "April", desktop: 73 },
          { month: "May", desktop: 209 },
          { month: "June", desktop: 214 },
        ],
      },
    ]
    const reportsList=[
      {
        id: 1,
        date: "2022-01-01",
        name: "Stock Activo",
        visits: 2481,
        messages: 47,
        favorites: 184,
        ctr: 21.01,
      },
      {
        id: 2,
        date: "2022-01-02",
        name: "Vistas",
        visits: 2481,
        messages: 47,
        favorites: 184,
        ctr: 21.01,
      },
      {
        id: 3,
        date: "2022-01-03",
        name: "Leads",
        visits: 2481,
        messages: 47,
        favorites: 184,
        ctr: 21.01,
      },
      {
        id: 4,
        date: "2022-01-04",
        name: "Ventas",
        visits: 2481,
        messages: 47,
        favorites: 184,
        ctr: 21.01,
      },
    ]

    const trafficData={
        busquedaWiAuto: 70,
        busquedaGeneral: 60,
        compartido: 80,
        otros: 90,
    }


  return (
    <div className="space-y-6 pb-20">
     <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Reportes & analitics</h1>
        </div>

        <div className="flex items-center gap-2">
        <Button 
          onClick={() => handleLast30Days()} 
          variant="secondary"
          className='cursor-pointer bg-white text-black hover:bg-white/80 border border-gray-200'
        >
          Ultimos 30 dias
        </Button>
        <Button 
          onClick={() => handleExportPDF()} 
          variant="default"
        >
          Exportar pdf
        </Button>
        </div>
      </div>
    <ReportesGrid reports={reports}/>
    <ReportesMesGrid reports={reports2}/> 
    <ReporteTable reports={reportsList}/> 
    <div className='flex  flex-col lg:flex-row w-full justify-between gap-8'>
      <TrafficChart data={trafficData} />
      <RecomendationCard/>
      </div>  
    </div>
  )
}
