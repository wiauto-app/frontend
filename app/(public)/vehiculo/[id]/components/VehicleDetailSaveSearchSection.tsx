"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { useUser } from "@/app/contexts/auth/useUser";
import { SignInDialog } from "@/components/auth/signInDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { alertService } from "@/services/alertService";

type VehicleDetailSaveSearchSectionProps = {
  vehicle_id: string;
};

export const VehicleDetailSaveSearchSection = ({
  vehicle_id,
}: VehicleDetailSaveSearchSectionProps) => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useUser();
  const [signInOpen, setSignInOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSearch = async () => {
    if (isLoading || isSaving) {
      return;
    }

    if (!isAuthenticated) {
      setSignInOpen(true);
      return;
    }

    setIsSaving(true);

    try {
      const response = await alertService.createFromVehicle(vehicle_id);

      if (!response.ok) {
        toast.error(response.message || "No se pudo guardar la búsqueda");
        return;
      }

      toast.success("Búsqueda guardada. Te avisaremos por correo.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la búsqueda",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignInSuccess = () => {
    setSignInOpen(false);
    void handleSaveSearch();
  };

  return (
    <>
      <Card className="bg-primary/5" size="sm">
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src="/icons/alertBell.svg"
              alt="Alert Bell"
              width={50}
              height={50}
            />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Guarda tus búsquedas favoritas
              </h2>
              <p className="text-sm text-gray-600">
                Recibe alertas de anuncios similares por email
              </p>
            </div>
          </div>
          <Button
            type="button"
            disabled={isLoading || isSaving}
            aria-label="Guardar búsqueda"
            onClick={() => {
              void handleSaveSearch();
            }}
          >
            <Bell aria-hidden />
            {isSaving ? "Guardando..." : "Guardar búsqueda"}
          </Button>
        </CardContent>
      </Card>

      <SignInDialog
        open={signInOpen}
        onOpenChange={setSignInOpen}
        returnTo={pathname}
        onSuccess={handleSignInSuccess}
      />
    </>
  );
};
