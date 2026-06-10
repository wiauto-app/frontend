"use client";

import { useState, useEffect, useRef } from "react";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import RolesGrid from "./components/rolesGrid";
import  TeamTable  from "./components/teamTable";

export default function TeamPage() {
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

  const equipo = [
    {
      id: 1,
      avatar: "",
      name: "Andres Gutierrez",
      email: "andres@wiauto.es",
      phone: "+34 612 345 678",
      leads: 24,
      sales: 12,
      role: "Admin",
      status: "Activo"
    },
    {
      id: 2,
      avatar: "",
      name: "Maria Rodriguez",
      email: "maria@wiauto.es",
      phone: "+34 623 456 789",
      leads: 18,
      sales: 9,
      role: "Vendedor",
      status: "Activo",
    },
    {
      id: 3,
      avatar: "",
      name: "Carlos Lopez",
      email: "carlos@wiauto.es",
      phone: "+34 634 567 890",
      leads: 32,
      sales: 15,
      role: "Vendedor",
      status: "Inactivo"
    },
    {
      id: 4,
      avatar: "",
      name: "Laura Fernandez",
      email: "laura@wiauto.es",
      phone: "+34 645 678 901",
      leads: 41,
      sales: 28,
      role: "Supervisor",
      status: "Activo",
    }
  ];

  const roles = [
    { id: 1, name: "Admin", permissions:["Acceso total","facturación","equipo"], numberOfMembers:1 },
    { id: 2, name: "Vendedor", permissions: ["leads"], numberOfMembers:2 },
    { id: 3, name: "Supervisor", permissions: ["leads", "sales"], numberOfMembers:1 }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Equipo</h1>
        </div>
        <Link 
          href="/invitar-miembro" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Invitar miembro
        </Link>
      </div>

     <TeamTable equipo={equipo} />
      <RolesGrid roles={roles}/>
    </div>
  );
}