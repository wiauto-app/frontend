"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ownerDashboardService } from "@/services/ownerDashboard/ownerDashboardService";

interface ExportDashboardParams {
  startDate: string;
  endDate: string;
}

const EXPORT_ERROR_BY_STATUS: Record<number, string> = {
  400: "El rango de fechas no es válido.",
  504: "La generación del PDF tardó demasiado. Prueba con un rango de fechas menor.",
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const useExportDashboard = () =>
  useMutation({
    mutationFn: async ({ startDate, endDate }: ExportDashboardParams) => {
      const response = await ownerDashboardService.exportDashboardPdf({
        startDate,
        endDate,
      });

      if (!response.ok || !response.data) {
        throw new Error(
          EXPORT_ERROR_BY_STATUS[response.status] ??
            "No se pudo exportar el PDF. Inténtalo de nuevo.",
        );
      }

      downloadBlob(response.data, `wiauto-resumen_${startDate}_${endDate}.pdf`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
