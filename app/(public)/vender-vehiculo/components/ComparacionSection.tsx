import { ComparacionSection as ComparacionSectionInterface } from "../interfaces/vender-vehiculo.interface";
import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  data: ComparacionSectionInterface;
}

export function   ComparacionSection({ data }: Props) {
  // Asumimos que el primer plan tiene todas las características listadas para armar las filas
  const features = data.planes[0]?.caracteristicas.map((c) => c.titulo) || [];

  return (
    <section className="py-5 bg-white ">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-12 text-center">
          {data.titulo}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="pb-6 border-b border-slate-200 font-medium text-slate-500 w-1/2"></th>
                {data.planes.map((plan) => (
                  <th key={plan.id} className="pb-6 border-b border-slate-200 font-semibold text-center text-blue-600">
                    {plan.nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((featureTitle, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 border-b border-slate-100 text-slate-700 font-medium">
                    {featureTitle}
                  </td>
                  {data.planes.map((plan) => {
                    const feature = plan.caracteristicas.find((c) => c.titulo === featureTitle);
                    const included = feature?.incluido;

                    return (
                      <td key={plan.id} className="py-4 border-b border-slate-100 text-center">
                        {included ? (
                          <div className="flex justify-center">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          </div>
                        ) : included === false ? (
                          <div className="flex justify-center">
                            <XCircle className="w-6 h-6 text-red-500" />
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <span className="w-4 h-1 rounded-full bg-slate-300 block"></span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
