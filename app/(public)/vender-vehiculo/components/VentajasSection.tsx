import { VentajasSection as VentajasSectionInterface } from "../interfaces/vender-vehiculo.interface";
import { Eye, FileText, ShieldCheck, Headphones } from "lucide-react";
import Image from "next/image";

interface Props {
  data: VentajasSectionInterface;
}

export function VentajasSection({ data }: Props) {
  // Función para asignar un icono dependiendo del título (fallback en caso de que no haya imagen en la API)
  const getIcon = (titulo: string) => {
    const t = titulo.toLowerCase();
    if (t.includes("visibilidad")) return <Eye className="w-8 h-8 text-blue-600" />;
    if (t.includes("trámite") || t.includes("tramite")) return <FileText className="w-8 h-8 text-blue-600" />;
    if (t.includes("segur")) return <ShieldCheck className="w-8 h-8 text-blue-600" />;
    if (t.includes("soporte") || t.includes("ayuda")) return <Headphones className="w-8 h-8 text-blue-600" />;
    return <ShieldCheck className="w-8 h-8 text-blue-600" />; // default
  };

  return (
    <section className="py-5 bg-white max-w-6xl mx-auto">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
            {data.titulo}
          </h2>
          {data.descripcion && (
            <p className="text-lg text-slate-600">
              {data.descripcion}  
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
          {data.ventaja?.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                {/* Asumimos fallback de iconos locales si no hay imagen definida */}
                {item.imagen ? (
                  <Image src={item.imagen.url} alt={item.titulo} className="w-8 h-8 object-contain" width={50} height={50} />
                ) : (
                  getIcon(item.titulo)
                )}
              </div>
              <h3 className="text-md md:text-xl font-semibold text-slate-900 mb-3">{item.titulo}</h3>
              <p className="text-slate-600 leading-relaxed">
                {item.descripcion}
              </p>
            </div>
          ))}
        </div>  
      </div>
    </section>
  );
}
