"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Check,
  Euro,
  EyeOff,
  Loader2,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { SignInDialog } from "@/components/auth/signInDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useVehicleEngagement } from "../hooks/useVehicleEngagement";

interface VehicleEngagementMenuProps {
  vehicleId: string;
  variant?: "ghost" | "outline";
  className?: string;
  /** Tras descartar con éxito (p. ej. quitar del grid con optimismo). */
  onDismissed?: (vehicleId: string) => void;
  /** Tras restaurar un descarte. */
  onRestored?: (vehicleId: string) => void;
}

export const VehicleEngagementMenu = ({
  vehicleId,
  variant = "ghost",
  className,
  onDismissed,
  onRestored,
}: VehicleEngagementMenuProps) => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthLoading } = useUser();
  const [open, setOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  const {
    status,
    isLoadingStatus,
    togglePriceWatch,
    toggleDismiss,
    isTogglingPriceWatch,
    isTogglingDismiss,
  } = useVehicleEngagement({
    vehicleId,
    enabled: open && isAuthenticated,
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && isAuthLoading) {
      return;
    }

    if (nextOpen && !isAuthenticated) {
      setSignInOpen(true);
      return;
    }

    setOpen(nextOpen);
  };

  const handleSignInSuccess = () => {
    setSignInOpen(false);
    setOpen(true);
  };

  const handleTogglePriceWatch = async () => {
    try {
      const wasWatching = status.isWatchingPrice;
      await togglePriceWatch();
      toast.success(
        wasWatching
          ? "Aviso de bajada desactivado"
          : "Te avisaremos si baja el precio",
      );
    } catch {
      toast.error("No se pudo actualizar el aviso de bajada");
    }
  };

  const handleToggleDismiss = async () => {
    try {
      const wasDismissed = status.isDismissed;
      await toggleDismiss();

      if (wasDismissed) {
        toast.success("Vehículo restaurado");
        onRestored?.(vehicleId);
        return;
      }

      toast.success("Vehículo descartado");
      onDismissed?.(vehicleId);
      setOpen(false);
    } catch {
      toast.error(
        status.isDismissed
          ? "No se pudo restaurar el vehículo"
          : "No se pudo descartar el vehículo",
      );
    }
  };

  const isBusy = isTogglingPriceWatch || isTogglingDismiss;

  return (
    <>
      <DropdownMenu open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger
          disabled={isAuthLoading}
          render={
            <Button
              type="button"
              size="icon"
              variant={variant}
              aria-label="Más opciones del vehículo"
              aria-haspopup="menu"
              className={cn(
                "rounded-full text-muted-foreground hover:bg-muted hover:text-foreground",
                variant === "outline" &&
                  "rounded-md border-2 border-muted-foreground/50",
                className,
              )}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <MoreVertical className="size-4" aria-hidden />
            </Button>
          }
        />
        <DropdownMenuContent
          align="end"
          className="w-56"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          {isLoadingStatus ? (
            <div className="flex items-center justify-center gap-2 px-2 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Cargando
            </div>
          ) : (
            <>
              <DropdownMenuItem
                disabled={isBusy}
                onClick={() => {
                  void handleTogglePriceWatch();
                }}
              >
                {status.isWatchingPrice ? (
                  <Check className="size-4 text-primary" aria-hidden />
                ) : (
                  <Euro className="size-4" aria-hidden />
                )}
                Avisarme si baja
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isBusy}
                variant={status.isDismissed ? "default" : "destructive"}
                onClick={() => {
                  void handleToggleDismiss();
                }}
              >
                <EyeOff className="size-4" aria-hidden />
                {status.isDismissed ? "Quitar descarte" : "Descartar"}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <SignInDialog
        open={signInOpen}
        onOpenChange={setSignInOpen}
        returnTo={pathname}
        onSuccess={handleSignInSuccess}
      />
    </>
  );
};
