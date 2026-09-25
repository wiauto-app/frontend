"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useVehicleInsights } from "../hooks/useVehicleInsights";
import { VehicleInsightsAccessError } from "../services/vehicleInsightsService";
import { buildEditHref } from "../utils/buildEditHref";
import { buildDefaultCheckHref } from "./ListingDiagnosisChecklist";
import {
  ListingDiagnosisContent,
  ListingDiagnosisSkeleton,
} from "./ListingDiagnosisContent";

interface ListingDiagnosticSheetProps {
  vehicleId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ListingDiagnosticSheet = ({
  vehicleId,
  open,
  onOpenChange,
}: ListingDiagnosticSheetProps) => {
  const insightsQuery = useVehicleInsights(vehicleId, { enabled: open });
  const insights = insightsQuery.data;
  const closeSheet = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto data-[side=right]:sm:max-w-lg"
      >
        <SheetHeader className="pr-12">
          <SheetTitle>Diagnóstico del anuncio</SheetTitle>
          <SheetDescription>
            {insights?.display_name ??
              "Cómo está tu anuncio y qué puedes mejorar para vender antes."}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 pb-6">
          {insightsQuery.isPending ? (
            <ListingDiagnosisSkeleton variant="sheet" />
          ) : insightsQuery.error instanceof VehicleInsightsAccessError ? (
            <p className="text-sm text-muted-foreground">
              Tu plan no incluye el diagnóstico de anuncios.
            </p>
          ) : insightsQuery.isError || !insights ? (
            <div
              role="alert"
              className="space-y-3 rounded-lg border border-border p-4 text-sm text-muted-foreground"
            >
              <p>No se pudo cargar el diagnóstico. Inténtalo de nuevo.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void insightsQuery.refetch()}
                disabled={insightsQuery.isFetching}
              >
                <RefreshCw aria-hidden />
                Reintentar
              </Button>
            </div>
          ) : (
            <ListingDiagnosisContent
              variant="sheet"
              insights={insights}
              resolveHref={buildDefaultCheckHref(insights.vehicle_id)}
              adjustPriceHref={buildEditHref(insights.vehicle_id, "price")}
              onNavigate={closeSheet}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
