import { ConsejosSection as ConsejosSectionInterface } from "../interfaces/vender-vehiculo.interface";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface Props {
  data: ConsejosSectionInterface;
}

export function ConsejosSection({ data }: Props) {
  return (
    <section className="py-5 bg-white">
      <div className="container mx-auto px-4 md:px-0 max-w-6xl">
        <div className="mb-12">
          <h2 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            {data.titulo}
          </h2>
          {data.descripcion && (
            <p className="text-base md:text-lg text-slate-600">
              {data.descripcion}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.consejo.map((item) => (
            <a key={item.id} href={item.boton?.url || "#"} className="group bg-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col sm:flex-row h-full">
              {/* Imagen */}
              <div className="w-full sm:w-2/5 shrink-0 h-48 sm:h-64 overflow-hidden bg-slate-100">
                {item.imagen ? (
                  <Image
                    src={item.imagen.url}
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width={50}
                    height={50}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-6 flex flex-col justify-center w-full relative">
                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
                  {item.titulo}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-3 mb-1 md:mb-4">
                  {item.descripcion}
                </p>
                <div className="mt-auto self-end text-blue-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
