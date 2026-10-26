import Link from "next/link";
import { ChevronRight, Inbox } from "lucide-react";
import { formatNumber } from "./dashboard.utils";
import { Card, CardContent } from "@/components/ui/card";

type DashboardOpportunitiesCardProps = {
  unreadMessages: number;
};

export const DashboardOpportunitiesCard = ({
  unreadMessages,
}: DashboardOpportunitiesCardProps) => {
  return (
    <Card size="sm">
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Oportunidades
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Conversaciones pendientes de revisar.
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Inbox className="size-5" aria-hidden />
          </div>
        </div>

        {unreadMessages === 0 ? (
          <p className="mt-5 text-sm text-gray-500">
            No tienes mensajes sin revisar. ¡Buen trabajo!
          </p>
        ) : (
          <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-blue-100 bg-blue-50/40 p-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(unreadMessages)}
              </p>
              <p className="text-sm text-gray-600">
                {unreadMessages === 1
                  ? "mensaje sin revisar"
                  : "mensajes sin revisar"}
              </p>
            </div>
            <Link
              href="/usuario/mensajes"
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Ir a mensajes
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
