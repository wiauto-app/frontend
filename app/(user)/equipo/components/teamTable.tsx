import React from 'react'
import { UserX} from "lucide-react";
import Link from "next/link";

interface Miembro {
    id: number;
    name: string;
    email: string;
    phone: string;
    leads: number;
    sales: number;
    role: string;
    status: string;
}

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
  const getStatusColor = (status: string) => {
    return status === "Activo" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };
 const teamTable = ({ equipo }: { equipo: Miembro[] }) => {
  return (
    <div>
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
              {equipo.map((member:Miembro) => (                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
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
    </div>
  )
}

export default teamTable;
