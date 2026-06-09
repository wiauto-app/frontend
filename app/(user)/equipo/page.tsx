"use client";

import { useState, useEffect, useRef } from "react";
import { LayoutGrid, MoreVertical, TrendingUp, Mail, Phone, UserCheck, UserX, Check, Badge, Edit, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
//shiedl logo
import { Shield, ShieldCheck, ShieldHalf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TeamPage() {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

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


  const getStatusColor = (status: string) => {
    return status === "Activo" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case "Admin":
        return "bg-purple-100 text-purple-800";
      case "Supervisor":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
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

      

      {/* Team Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="w-5 h-5 text-blue-600 text-center" />
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Miembro
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leads
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ventas (mes)
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equipo.map((member, index) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-center">
                        <input type="checkbox" className="w-5 h-5 text-blue-600" />
                    </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{member.leads}</span>
                 
                  </td>
                  
                  <td className="px-6 py-4">
                       
                        <span className="font-semibold text-gray-900">{member.sales}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
               
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {equipo.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay miembros</h3>
          <p className="text-gray-500 mb-4">Comienza invitando a tu primer miembro al equipo</p>
          <Link 
            href="/invitar-miembro"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Invitar miembro
          </Link>
        </div>
      )}
       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Roles y permisos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => (
                   <Card key={role.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-blue-100">
            <CardContent className="px-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <ShieldHalf className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                  </div>
                </div>
               <div className="items-center">
                 <p className="text-sm text-gray-500">{role.numberOfMembers} Miembros</p>
               </div>
              </div>

              <div className="space-y-2 mb-6">
             
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-md text-sm text-gray-700"
                    >
                      <Check className="w-3 h-3 text-green-600" />
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
              </div>    
               <Button type="button" variant="link" className="text-lg">
         Editar permisos 
         <ArrowRight className="w-4 h-4 text-blue-600" />
        </Button>
            </CardContent>
          </Card>
                ))}
              </div>
            </div>
    </div>
  );
}