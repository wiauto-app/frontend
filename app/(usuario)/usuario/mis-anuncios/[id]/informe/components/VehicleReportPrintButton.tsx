"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export const VehicleReportPrintButton = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      type="button"
      onClick={handlePrint}
      className="print:hidden bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Printer className="size-4" aria-hidden />
      Descargar PDF
    </Button>
  );
};
