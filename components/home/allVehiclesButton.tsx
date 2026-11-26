import { PiCarProfileBold } from "react-icons/pi";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const AllVehiclesButton = () => {
  return (
    <div className="bg-primary/10 rounded-lg p-4 grid lg:grid-cols-2 gap-5  lg:divide-x-2 divide-primary/30">
      <div className="flex justify-center lg:justify-end gap-3 px-10">
        <div className="flex items-center gap-3">
          <PiCarProfileBold className="text-primary size-10" />
          <div>
            <h3 className="text-lg font-bold">¿Buscas algo especial?</h3>
            <p className="text-sm text-muted-foreground">
              Explora en nuestro catalogo de vehículos
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center lg:justify-start px-10">
        <Link href="/vehiculos">
          <Button
            className="border border-primary text-primary font-semibold bg-white rounded-full px-5 hover:bg-primary/10"
            size="xl"
          >
            Ver todos los vehículos <ChevronRight />
          </Button>
        </Link>
      </div>
    </div>
  );
};
