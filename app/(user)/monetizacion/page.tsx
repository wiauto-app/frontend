"use client";

import { useState, useEffect, useRef } from "react";
import { LayoutGrid } from "lucide-react";
import BillTable from "./components/billTable";
import AddonsGrid from "./components/addonsGrid";
import PlanesGrid from "./components/planesGrid";

export default function MonetizacionPage() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  const plans = [
    {
      id: 1,
      name: "Starter",
      monthlyPrice: 10,
      annualPrice: 100,
      features: ["Feature 1", "Feature 2"],
      notFeatures: ["Feature 3", "Feature 4"],
      buttonText: "Comprar",
      active: true,
    },
    {
      id: 2,
      name: "Pro",
      monthlyPrice: 20,
      annualPrice: 200,
      features: ["Feature 1", "Feature 2", "Feature 3"],
      notFeatures: ["Feature 4"],
      buttonText: "Comprar",
      active: false,
    },
    {
      id: 3,
      name: "Enterprise",
      monthlyPrice: 30,
      annualPrice: 300,
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      notFeatures: [],
      buttonText: "Comprar",
      active: false,
    }
  ];

  const bills = [
    {
      id: 1,
      date: "2022-01-01",
      description: "Plan Basic",
      amount: 100,
      status: "Activo"
    },
    {
      id: 2,
      date: "2022-01-02",
      description: "Plan Pro",
      amount: 200,
      status: "Pagado"
    },
    {
      id: 3,
      date: "2022-01-03",
      description: "Plan Enterprise",
      amount: 300,
      status: "Pendiente"
    }
    
 
  ];

  const addons = [
    { id: 1, name: "Anuncios destacados", description: "Aparece arriba en búsquedas"},
    { id: 2, name: "Leads exclusivos", description: "Compradores cualificados con tu match"},
    { id: 3, name: "Escaparate de marca", description: "Página dedicada con tu logo, banner y stock"},{
      id:4, name: "Boost campañas", description: "Empuje algoritmo + email a búsquedas guardadas"
    },{
      id:5, name: "Integraciones premium", description: "DMS, CRM externo, webhooks dedicados"
    }
  ];


  

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Planes y palancas premium</h1>
        </div>
       
      </div>
      <PlanesGrid plans={plans}/>
      <AddonsGrid addons={addons}/>
      <BillTable bills={bills} />
    </div>
  );
}