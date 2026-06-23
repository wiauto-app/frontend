import { Eye, MessageSquare } from "lucide-react";
import { formatNumber } from "./dashboard.utils";

type DashboardWeeklyStatsCardProps = {
  visits: number;
  messagesReceived: number;
};

export const DashboardWeeklyStatsCard = ({
  visits,
  messagesReceived,
}: DashboardWeeklyStatsCardProps) => {
  const stats = [
    {
      label: "Visitas (7 días)",
      value: formatNumber(visits),
      icon: Eye,
    },
    {
      label: "Mensajes recibidos (7 días)",
      value: formatNumber(messagesReceived),
      icon: MessageSquare,
    },
  ];

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        Actividad semanal
      </h2>
      <p className="text-sm text-gray-500 mb-5">
        Resumen de los últimos 7 días en tu cuenta.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-lg border border-gray-100 bg-gray-50/60 p-4"
            >
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Icon className="size-4" aria-hidden />
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
