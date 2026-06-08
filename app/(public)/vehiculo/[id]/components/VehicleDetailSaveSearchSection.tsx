import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import Image from "next/image";

export const VehicleDetailSaveSearchSection = () => (
  <Card className="bg-primary/10">
    <CardContent className=" flex flex-row items-center gap-4 justify-between">
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
      <Button className="mt-4">
        <Bell /> Guardar búsqueda
      </Button>
    </CardContent>
  </Card>
);
