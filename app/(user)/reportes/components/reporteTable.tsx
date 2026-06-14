import React from 'react'
import { UserX} from "lucide-react";
import Link from "next/link";

interface Report {
    id: number;
    date: string;
    name: string;
    visits: number;
    messages: number;
    favorites: number;
    ctr: number;
}


export const ReporteTable = ({reports }: { reports: Report[] }) => {
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
                  Anuncio
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visitas
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mensajes
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Favoritos
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTR
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report:Report, index:number) => (
                <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                     <span className= "font-semibold text-gray-900">{new Date(report.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className= "font-semibold text-gray-900">{report.name}</span>
                 
                  </td>
                  <td className="px-6 py-4">
                    <span className= "font-semibold text-gray-900">{report.visits}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className= "font-semibold text-gray-900">{report.messages}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className= "font-semibold text-gray-900">{report.favorites}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className= {`font-semibold ${report.ctr > 0 ? "text-green-500" : report.ctr < 0 ? "text-red-500" : "text-blue-500"}`}>{report.ctr} %</span>
                  </td>
               
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      { reports.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reportes</h3>
          <p className="text-gray-500 mb-4">No hay reportes para mostrar</p>
        </div>
      )}
    </div>
  )
}
