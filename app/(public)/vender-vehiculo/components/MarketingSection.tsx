import { Card as CardInterface } from "../interfaces/vender-vehiculo.interface";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Props {
  data: CardInterface;
}

export function MarketingSection({ data }: Props) {
  return (
    <section className="py-5 px-4 max-w-6xl mx-auto">
      <div className="bg-[#0f172a] rounded-2xl overflow-hidden flex flex-col md:flex-row relative">
        <div className="md:w-1/2 relative min-h-[250px] md:min-h-full">
          {data.imagen ? (
            <Image
              src={data.imagen.url}
              alt={data.titulo}
              className="absolute inset-0 w-full h-full object-cover"
              width={50}
              height={50}
            />
          ) : (
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-500">
              Imagen promocional
            </div>
          )}
        </div>

        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative z-10 text-white">
          <h3 className="text-1xl md:text-3xl font-bold mb-4">
            {data.titulo}
          </h3>
          <p className="text-slate-300 mb-8 md:text-lg">
            {data.descripcion}
          </p>
          {data.boton && (
            <Button className="w-fit bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-3 md:py-6 rounded-lg">
              {data.boton.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
