import { VentajasSection as VentajasSectionInterface } from "../interfaces/vender-vehiculo.interface";
import { Eye, FileText, ShieldCheck, Headphones } from "lucide-react";
import Image from "next/image";
import { resolveStrapiIconName } from "../../simulador-financiamiento/utils/resolveStrapiIconName";
import { IconContainer } from "@/components/ui/iconContainer";

interface Props {
  data: VentajasSectionInterface;
}

export function VentajasSection({ data }: Props) {
  // Función para asignar un icono dependiendo del título (fallback en caso de que no haya imagen en la API)
  const getIcon = (titulo: string) => {
    const t = titulo.toLowerCase();
    if (t.includes("visibilidad"))
      return <Eye className="w-8 h-8 text-blue-600" />;
    if (t.includes("trámite") || t.includes("tramite"))
      return <FileText className="w-8 h-8 text-blue-600" />;
    if (t.includes("segur"))
      return <ShieldCheck className="w-8 h-8 text-blue-600" />;
    if (t.includes("soporte") || t.includes("ayuda"))
      return <Headphones className="w-8 h-8 text-blue-600" />;
    return <ShieldCheck className="w-8 h-8 text-blue-600" />; // default
  };

  return (
    <div className="space-y-4">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-3xl font-bold  text-foreground">{data.titulo}</h2>
        {data.descripcion && (
          <p className="text-lg text-muted-foreground">{data.descripcion}</p>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
        {data.ventaja?.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center text-center gap-2"
          >
            {item.iconName && (
              <IconContainer
                size="lg"
                Icon={resolveStrapiIconName(item.iconName)}
              />
            )}
            <h3 className="text-base md:text-lg font-semibold text-foreground ">
              {item.titulo}
            </h3>
            <p className="text-muted-foreground ">{item.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
