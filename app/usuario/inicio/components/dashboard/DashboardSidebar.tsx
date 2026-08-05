import Link from "next/link";
import { Building2, Headphones, Phone, Star } from "lucide-react";
import type {
  OwnerDashboardDealership,
  OwnerDashboardSupport,
} from "@/interfaces/owner-dashboard.interface";
import { formatNumber, formatPhone } from "./dashboard.utils";

type DashboardSidebarProps = {
  dealership: OwnerDashboardDealership | null;
  support: OwnerDashboardSupport;
};

const RatingStars = ({ rating }: { rating: number | null }) => {
  if (rating === null) {
    return <p className="text-sm text-gray-500">Sin valoraciones</p>;
  }

  const rounded = Math.round(rating * 10) / 10;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 text-amber-500" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={`size-4 ${
              index < Math.round(rating) ? "fill-current" : "text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-900">{rounded}</span>
    </div>
  );
};

export const DashboardSidebar = ({
  dealership,
  support,
}: DashboardSidebarProps) => {
  const dealershipPhone = dealership
    ? formatPhone(dealership.phone_code, dealership.phone)
    : null;

  return (
    <aside className="space-y-4">
      {dealership ? (
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Building2 className="size-5" aria-hidden />
          </div>
          <h2 className="text-base font-semibold text-gray-900">
            Equipo comercial
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-800">{dealership.name}</p>

          {dealershipPhone ? (
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <Phone className="size-4 shrink-0" aria-hidden />
              {dealershipPhone}
            </p>
          ) : null}

          <div className="mt-4 border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Valoraciones
            </h3>
            <RatingStars rating={dealership.rating} />
            <p className="mt-1 text-xs text-gray-500">
              {dealership.reviews_count > 0
                ? `${formatNumber(dealership.reviews_count)} reseñas`
                : "Sin reseñas publicadas"}
            </p>
          </div>

          <Link
            href="/perfil?tab=dealership"
            className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Gestionar perfil de concesionaria
          </Link>
        </section>
      ) : null}

      <section className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
        <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Headphones className="size-5" aria-hidden />
        </div>
        <h2 className="text-base font-semibold text-gray-900">Soporte WiAuto</h2>
        <p className="mt-2 text-sm text-gray-600">
          ¿Necesitas ayuda con tus anuncios o tu cuenta profesional?
        </p>

        {support.phone ? (
          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-gray-800">
            <Phone className="size-4 shrink-0" aria-hidden />
            {support.phone}
          </p>
        ) : null}

        {support.faq_url ? (
          <a
            href={support.faq_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Ver preguntas frecuentes
          </a>
        ) : null}
      </section>
    </aside>
  );
};
