import { HousePlus } from "lucide-react";
import { StrapiAboutUsEntry } from "../interfaces/aboutUs.interface";
import Image from "next/image";
export const Values = ({ data }: { data: StrapiAboutUsEntry }) => {

  return (
    <div className="flex flex-row my-10 justify-between gap-4">
      <div className="w-full max-w-3xl">
        <h4 className="text-2xl font-bold text-slate-900 mb-8 ml-4">
          {data.titulo}
        </h4>
        <div className="flex flex-col gap-6">
          {data.caracteristicas?.map((item) => {
            return (
              <div
                key={item.id}
                className="flex bg-white  rounded-l-full rounded-r-md shadow-sm overflow-hidden items-center min-h-[100px]"
              >
                <div className="bg-blue-600 w-24  m-2 flex items-center justify-center self-stretch rounded-l-full">
                  <HousePlus className="text-white w-10 h-10" strokeWidth={2} />
                </div>
                <div className="flex flex-col px-8 py-4 justify-center">
                  <h4 className="text-lg font-bold text-gray-500 mb-2">
                    {item.label}
                  </h4>
                  <p className="text-sm text-gray-400 font-medium">
                    {item.descripcion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className=" max-w-2/5">
        <Image src={data.imagen?.url ?? ""} alt={data.titulo} width={500} height={500} />
      </div>
    </div>
  );
};
