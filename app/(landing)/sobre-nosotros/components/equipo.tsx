import Image from "next/image";
import { StrapiAboutUsEntry } from "../types/strapi-about-us.types";

export const Equipo = ({ data }: { data: StrapiAboutUsEntry }) => {
  return (
    <div className="flex flex-col items-center my-16 w-full">
      <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">
        NUESTROS ALIADOS NOS PREFIEREN
      </h3>
      <h2 className="text-3xl font-bold text-slate-900 mb-12">El equipo</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 w-full">
        {data.equipo?.persona?.map((miembro, index) => (
          <div key={index} className="flex flex-col">
            <div className="relative w-full aspect-[4/3] mb-4">
              <Image
                src={miembro.imagen?.url ?? ""}
                alt={miembro.nombre}
                fill
                className="object-cover rounded-2xl"
              />
            </div>
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">
              {miembro.descripcion}
            </p>
            <h3 className="text-lg font-bold text-slate-900">
              {miembro.nombre}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};
