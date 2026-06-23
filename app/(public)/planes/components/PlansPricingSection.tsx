import { CheckCircle2, XCircle } from "lucide-react";

import type { BillingCatalogPlan } from "@/interfaces/billing.interface";

import { buildPlansComparisonMatrix } from "../utils/buildPlansComparisonMatrix";
import { PlansPricingCta } from "./PlansPricingCta";

type PlansPricingSectionProps = {
  plans: BillingCatalogPlan[];
  catalogError?: boolean;
};

const formatEuros = (amount_cents: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount_cents / 100);

const getMonthlyPrice = (plan: BillingCatalogPlan) =>
  plan.prices.find((price) => price.interval === "month") ?? plan.prices[0] ?? null;

export const PlansPricingSection = ({
  plans,
  catalogError = false,
}: PlansPricingSectionProps) => {
  const matrix = buildPlansComparisonMatrix(plans);

  return (
    <section className="bg-[#001B3D] py-16 lg:py-20 text-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Elige el pack que impulsa tu negocio
          </h2>
        </div>

        {catalogError ? (
          <div className="mb-8 rounded-xl border border-white/20 bg-white/10 p-4 text-center text-sm text-slate-200">
            No pudimos cargar los planes en este momento. Inténtalo de nuevo más tarde o accede a
            monetización desde tu cuenta.
          </div>
        ) : null}

        {!matrix.plans.length ? (
          <div className="rounded-xl border border-white/20 bg-white/10 p-8 text-center text-slate-200">
            No hay planes de suscripción disponibles en este momento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr>
                  <th className="pb-6 border-b border-white/20 font-medium text-slate-300 w-1/3" />
                  {matrix.plans.map((plan) => {
                    const monthly_price = getMonthlyPrice(plan);

                    return (
                      <th
                        key={plan.id}
                        className={`pb-6 border-b border-white/20 px-4 text-center align-bottom ${
                          plan.is_featured ? "bg-white/10 rounded-t-xl" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          {plan.is_featured ? (
                            <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                              Más popular
                            </span>
                          ) : null}
                          <span className="text-lg font-semibold text-white">{plan.name}</span>
                          {monthly_price ? (
                            <p className="text-blue-300">
                              <span className="text-3xl font-bold text-white">
                                {formatEuros(monthly_price.amount_cents)}
                              </span>
                              <span className="text-sm text-slate-300"> / mes</span>
                            </p>
                          ) : null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {matrix.rows.map((label) => (
                  <tr key={label} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 border-b border-white/10 text-slate-200 font-medium pr-4">
                      {label}
                    </td>
                    {matrix.plans.map((plan) => {
                      const cell = matrix.cells[plan.id]?.[label];
                      const description = cell?.description?.trim();

                      return (
                        <td
                          key={`${plan.id}-${label}`}
                          className={`py-4 border-b border-white/10 px-4 text-center ${
                            plan.is_featured ? "bg-white/5" : ""
                          }`}
                        >
                          {description ? (
                            <span className="text-sm text-slate-100">{description}</span>
                          ) : cell?.included ? (
                            <div className="flex justify-center">
                              <CheckCircle2 className="h-6 w-6 text-green-400" aria-hidden />
                              <span className="sr-only">Incluido</span>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <XCircle className="h-6 w-6 text-red-400" aria-hidden />
                              <span className="sr-only">No incluido</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="pt-6" />
                  {matrix.plans.map((plan) => {
                    const monthly_price = getMonthlyPrice(plan);

                    return (
                    <td
                      key={`cta-${plan.id}`}
                      className={`pt-6 px-4 pb-2 ${plan.is_featured ? "bg-white/10 rounded-b-xl" : ""}`}
                    >
                      <PlansPricingCta
                        plan_name={plan.name}
                        plan_price_id={monthly_price?.id ?? null}
                      />
                    </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};
