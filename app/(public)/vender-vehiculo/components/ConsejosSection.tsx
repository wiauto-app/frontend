import { ConsejosSection as ConsejosSectionInterface } from "../interfaces/vender-vehiculo.interface";
import Image from "next/image";

interface Props {
  data: ConsejosSectionInterface;
}

export function ConsejosSection({ data }: Props) {
  return (
      <div className="space-y-4">
        <div className="">
          <h2 className="text-xl md:text-3xl font-bold  text-foreground">
            {data.titulo}
          </h2>
          {data.descripcion && (
            <p className="text-muted-foreground">
              {data.descripcion}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.consejo.map((item) => (
            <div key={item.id} className=" bg-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col sm:flex-row h-full">
              {/* Imagen */}
              <div className="w-full sm:w-2/5 shrink-0 h-48 sm:h-64 overflow-hidden bg-slate-100 relative">
                {item.imagen ? (
                  <Image
                    src={item.imagen.url}
                    alt={item.titulo}
                    fill
                    sizes="300px"
                    className="object-cover"
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
              
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
