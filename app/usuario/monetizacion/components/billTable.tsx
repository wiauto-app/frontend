import { UserX } from "lucide-react";
import type { BillingInvoice } from "@/interfaces/billing.interface";

interface BillTableProps {
  bills: BillingInvoice[];
  loading?: boolean;
  formatPrice: (amount_cents: number) => string;
}

const getStatusColor = (status: string) => {
  if (status === "paid") {
    return "bg-green-100 text-green-800";
  }
  if (status === "open") {
    return "bg-yellow-100 text-yellow-800";
  }
  return "bg-red-100 text-red-800";
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "paid":
      return "Pagado";
    case "open":
      return "Pendiente";
    case "void":
      return "Anulado";
    default:
      return status;
  }
};

const getInvoiceUrl = (bill: BillingInvoice): string | null =>
  bill.invoice_pdf_url || bill.hosted_invoice_url || null;

const BillTable = ({ bills, loading = false, formatPrice }: BillTableProps) => {
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
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bills.map((bill) => {
                const invoiceUrl = getInvoiceUrl(bill);

                return (
                  <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {new Date(bill.paid_at ?? bill.created_at).toLocaleDateString("es-ES")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        Factura {bill.stripe_invoice_id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {formatPrice(bill.amount_paid_cents)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}
                      >
                        {getStatusLabel(bill.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {invoiceUrl ? (
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:underline"
                            aria-label={`Ver factura ${bill.stripe_invoice_id.slice(-8)}`}
                          >
                            Ver factura
                          </a>
                          <a
                            href={invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:underline"
                            aria-label={`Imprimir factura ${bill.stripe_invoice_id.slice(-8)}`}
                          >
                            Imprimir
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400" aria-hidden>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && bills.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay facturas</h3>
          <p className="text-gray-500 mb-4">No hay facturas para mostrar</p>
        </div>
      ) : null}
    </div>
  );
};

export default BillTable;
