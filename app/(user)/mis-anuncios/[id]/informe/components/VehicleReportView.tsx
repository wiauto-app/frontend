import Image from "next/image";
import { Car, Eye, Heart, MessageCircle, Phone, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
import { get_vehicle_status_label } from "@/components/vehicles/constants/vehicle-status.constants";
import { VEHICLE_CONDITION_OPTIONS } from "@/components/vehicles/constants/vehicle-enums.constants";
import type { VehicleReport } from "@/interfaces/vehicle-report.interface";
import { VehicleReportPrintButton } from "./VehicleReportPrintButton";

interface VehicleReportViewProps {
  report: VehicleReport;
}

const formatPrice = (price: number): string =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);

const formatMileage = (mileage: number): string =>
  `${new Intl.NumberFormat("es-ES").format(mileage)} km`;

const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatDateTime = (value: string): string =>
  new Date(value).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getConditionLabel = (condition: string): string =>
  VEHICLE_CONDITION_OPTIONS.find((option) => option.value === condition)?.label ??
  condition;

const priceStatusLabel: Record<string, string> = {
  active: "Actual",
  inactive: "Histórico",
};

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye;
  label: string;
  value: number;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 text-center break-inside-avoid">
    <Icon className="mx-auto size-5 text-blue-600" aria-hidden />
    <p className="mt-2 text-2xl font-bold text-gray-900">
      {new Intl.NumberFormat("es-ES").format(value)}
    </p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

export const VehicleReportView = ({ report }: VehicleReportViewProps) => {
  const coverImage = report.images[0]?.url ? getImageUrl(report.images[0].url) : null;
  const generatedAt = formatDateTime(new Date().toISOString());

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 print:max-w-none print:p-0">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-xl font-bold text-gray-900">Informe de anuncio</h1>
        <VehicleReportPrintButton />
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm print:mt-0 print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <header className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-blue-600">WiAuto</p>
            <p className="text-xs text-gray-500">Informe de anuncio · Generado {generatedAt}</p>
          </div>
          <Badge variant="outline" className="text-sm">
            {get_vehicle_status_label(report.status)}
          </Badge>
        </header>

        <section className="mt-6 flex flex-col gap-6 sm:flex-row">
          <div className="relative h-56 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-72">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={report.display_name}
                fill
                className="object-cover"
                sizes="288px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300">
                <Car className="size-12" aria-hidden />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{report.display_name}</h2>
            <p className="text-3xl font-extrabold text-blue-600">
              {formatPrice(report.price)}
            </p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-600">
              <div className="flex justify-between sm:block">
                <dt className="text-gray-400">Kilometraje</dt>
                <dd className="font-medium text-gray-800">
                  {formatMileage(report.mileage)}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-gray-400">Estado del vehículo</dt>
                <dd className="font-medium text-gray-800">
                  {getConditionLabel(report.condition)}
                </dd>
              </div>
              <div className="flex justify-between sm:block">
                <dt className="text-gray-400">Publicado</dt>
                <dd className="font-medium text-gray-800">
                  {formatDate(report.created_at)}
                </dd>
              </div>
              {report.renewed_at ? (
                <div className="flex justify-between sm:block">
                  <dt className="text-gray-400">Última renovación</dt>
                  <dd className="font-medium text-gray-800">
                    {formatDate(report.renewed_at)}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-base font-semibold text-gray-900">
            Histórico de precios
          </h3>
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-500">Fecha</th>
                  <th className="px-4 py-2 font-medium text-gray-500">Precio</th>
                  <th className="px-4 py-2 font-medium text-gray-500">Situación</th>
                </tr>
              </thead>
              <tbody>
                {report.price_history.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100">
                    <td className="px-4 py-2 text-gray-700">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {priceStatusLabel[item.status] ?? item.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8">
          <h3 className="text-base font-semibold text-gray-900">
            Rendimiento del anuncio
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard icon={Eye} label="Visitas" value={report.stats.views} />
            <StatCard icon={MessageCircle} label="Contactos" value={report.stats.leads} />
            <StatCard icon={Heart} label="Favoritos" value={report.stats.favorites} />
            <StatCard icon={Share2} label="Compartidos" value={report.stats.shares} />
            <StatCard icon={Phone} label="Clics a teléfono" value={report.stats.phone_clicks} />
            <StatCard
              icon={MessageCircle}
              label="Clics a WhatsApp"
              value={report.stats.whatsapp_clicks}
            />
          </div>
        </section>

        <footer className="mt-10 border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
          Informe generado automáticamente por WiAuto · wiauto.es
        </footer>
      </div>
    </div>
  );
};
