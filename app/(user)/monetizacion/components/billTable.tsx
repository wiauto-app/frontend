import React from 'react'
import { UserX} from "lucide-react";
import Link from "next/link";

interface Bill {
    id: number;
    date: string;
    description: string;
    amount: number;
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
const billTable = ({bills }: { bills: Bill[] }) => {
  return (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Historial de facturación</h2>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
               
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concepto
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bills.map((bill:Bill, index:number) => (
                <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className= "font-semibold text-gray-900">{bill.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className= "font-semibold text-gray-900">{bill.description}</span>
                 
                  </td>
                  <td className="px-6 py-4">
                    <span className= "font-semibold text-gray-900">{bill.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </td>
               
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {bills.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay facturas</h3>
          <p className="text-gray-500 mb-4">No hay facturas para mostrar</p>
        </div>
      )}
    </div>
  )
}

export default billTable