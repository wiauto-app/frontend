

import { HousePlus } from "lucide-react";

export const Values = () => {

    const info=[
        {
            name:'Misión',
            description:'Conectar compradores y vendedores en un entorno transparente, seguro y eficiente.',
        },
        {
            name:'Visión',
            description:'Ser el marketplace automotor referente de Latinoamérica para 2030.',
        },
        {
            name:'Valores',
            description:'Confianza, simplicidad, innovación y obsesión por el usuario.',
         
        }
    ]
  return (
   <div className="flex flex-row my-10 justify-between gap-4">
    <div className="w-full max-w-3xl">
        <h4 className="text-2xl font-bold text-slate-900 mb-8 ml-4">Reinventando el mercado automotor de España</h4>
        <div className="flex flex-col gap-6">
            {info.map((item)=>{
                return(
                    <div key={item.name} className="flex bg-white  rounded-l-full rounded-r-md shadow-sm overflow-hidden items-center min-h-[100px]">
                        <div className="bg-blue-600 w-24  m-2 flex items-center justify-center self-stretch rounded-l-full">
                            <HousePlus className="text-white w-10 h-10" strokeWidth={2} />
                        </div>
                        <div className="flex flex-col px-8 py-4 justify-center">
                            <h4 className="text-lg font-bold text-gray-500 mb-2">{item.name}</h4>
                            <p className="text-sm text-gray-400 font-medium">{item.description}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
    <div className=" max-w-2/5">image</div>

    
</div>
   
  )
}