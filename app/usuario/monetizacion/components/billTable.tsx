import { EllipsisVertical, FileText, Printer, UserX } from "lucide-react";
import type { BillingInvoice } from "@/interfaces/billing.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
    <Card>
      <CardHeader>
        <CardTitle>Historial de facturación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto border rounded-lg">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => {
                const invoiceUrl = getInvoiceUrl(bill);

                return (
                  <TableRow
                    key={bill.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <span className="font-semibold text-gray-900">
                        {new Date(
                          bill.paid_at ?? bill.created_at,
                        ).toLocaleDateString("es-ES")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-gray-900">
                        Factura {bill.stripe_invoice_id.slice(-8)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(bill.amount_paid_cents)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}
                      >
                        {getStatusLabel(bill.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {invoiceUrl ? (
                        <div className="flex flex-wrap items-center gap-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button variant="ghost" size="icon">
                                  <EllipsisVertical className="w-4 h-4" />
                                </Button>
                              }
                            ></DropdownMenuTrigger>
                            <DropdownMenuContent align="start" side="right">
                              <a
                                href={invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Ver factura ${bill.stripe_invoice_id.slice(-8)}`}
                              >
                                <DropdownMenuItem>
                                  <FileText className="w-4 h-4" />
                                  Ver factura
                                </DropdownMenuItem>
                              </a>
                              <a
                                href={invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Imprimir factura ${bill.stripe_invoice_id.slice(-8)}`}
                              >
                                <DropdownMenuItem>
                                  <Printer className="w-4 h-4" />
                                  Imprimir
                                </DropdownMenuItem>
                              </a>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400" aria-hidden>
                          —
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {!loading && bills.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay facturas
          </h3>
          <p className="text-gray-500 mb-4">No hay facturas para mostrar</p>
        </div>
      ) : null}
    </Card>
  );
};

export default BillTable;
