"use client";

import {
  Calculator,
  CheckCircle2,
  Info,
  Lock,
  Percent,
  CalendarDays,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  FinancingSimulatorConfigDto,
  SimulateFinancingResultDto,
} from "@/interfaces/financing-simulator.interface";
import { financingSimulatorService } from "@/services/financingSimulatorService";
// import { cn } from "@/lib/utils";

import {
  formatCurrency,
  formatPercent,
  formatScheduleDate,
} from "../utils/format";
import { SimulatorBreakdownChart } from "./SimulatorBreakdownChart";
import { SimulatorSlider } from "./SimulatorSlider";

const DEFAULT_CONFIG: FinancingSimulatorConfigDto = {
  currency: "USD",
  vehicle_price: { min: 5000, max: 150000, step: 100, default: 18990 },
  down_payment_percent: { min: 10, max: 70, step: 1, default: 30 },
  term_months: { min: 12, max: 84, step: 12, default: 60 },
  annual_interest_rate: { min: 5, max: 20, step: 0.1, default: 9.5 },
  insurance_options: [
    { id: "basic", label: "Seguro básico", monthly_amount: 35 },
    { id: "standard", label: "Seguro estándar", monthly_amount: 55 },
    { id: "premium", label: "Seguro premium", monthly_amount: 75 },
  ],
};

const pickPreviewRows = (schedule: SimulateFinancingResultDto["schedule"]) => {
  if (!schedule.length) {
    return [];
  }

  if (schedule.length <= 4) {
    return schedule.map((row) => ({ ...row, isEllipsis: false as const }));
  }

  return [
    { ...schedule[0], isEllipsis: false as const },
    { ...schedule[1], isEllipsis: false as const },
    { ...schedule[2], isEllipsis: false as const },
    { installment: -1, date: "", payment: 0, remaining_balance: 0, isEllipsis: true as const },
    { ...schedule[schedule.length - 1], isEllipsis: false as const },
  ];
};

export const SimulatorPanel = () => {
  const [config, setConfig] = useState<FinancingSimulatorConfigDto>(DEFAULT_CONFIG);
  const [vehiclePrice, setVehiclePrice] = useState(DEFAULT_CONFIG.vehicle_price.default);
  const [downPaymentPercent, setDownPaymentPercent] = useState(
    DEFAULT_CONFIG.down_payment_percent.default,
  );
  const [termMonths, setTermMonths] = useState(DEFAULT_CONFIG.term_months.default);
  const [interestRate, setInterestRate] = useState(
    DEFAULT_CONFIG.annual_interest_rate.default,
  );
  const [insuranceOptionId, setInsuranceOptionId] = useState<string | null>(
    DEFAULT_CONFIG.insurance_options.find((o) => o.id === "standard")?.id ??
      DEFAULT_CONFIG.insurance_options[0]?.id ??
      null,
  );
  const [result, setResult] = useState<SimulateFinancingResultDto | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [priceInput, setPriceInput] = useState(
    String(DEFAULT_CONFIG.vehicle_price.default),
  );

  useEffect(() => {
    let cancelled = false;

    const loadConfig = async () => {
      const response = await financingSimulatorService.getConfig();
      if (cancelled) {
        return;
      }

      if (!response.ok || !response.data) {
        setConfigError(
          response.message || "No se pudo cargar la configuración. Usando valores por defecto.",
        );
        return;
      }

      const nextConfig = response.data;
      setConfig(nextConfig);
      setVehiclePrice(nextConfig.vehicle_price.default);
      setPriceInput(String(nextConfig.vehicle_price.default));
      setDownPaymentPercent(nextConfig.down_payment_percent.default);
      setTermMonths(nextConfig.term_months.default);
      setInterestRate(nextConfig.annual_interest_rate.default);
      setInsuranceOptionId(
        nextConfig.insurance_options.find((option) => option.id === "standard")?.id ??
          nextConfig.insurance_options[0]?.id ??
          null,
      );
      setConfigError(null);
    };

    void loadConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  const downPaymentPreview = vehiclePrice * (downPaymentPercent / 100);
  const currency = config.currency;

  const handleCalculate = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await financingSimulatorService.simulate({
        vehicle_price: vehiclePrice,
        down_payment_percent: downPaymentPercent,
        term_months: termMonths,
        annual_interest_rate: interestRate,
        insurance_option_id: insuranceOptionId,
      });

      if (!response.ok || !response.data) {
        setErrorMessage(
          response.message || "No se pudo calcular la simulación. Inténtalo de nuevo.",
        );
        setResult(null);
        setHasCalculated(true);
        return;
      }

      setResult(response.data);
      setHasCalculated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, "");
    setPriceInput(digits);

    if (!digits) {
      return;
    }

    const next = Number(digits);
    if (!Number.isFinite(next)) {
      return;
    }

    const clamped = Math.min(
      config.vehicle_price.max,
      Math.max(config.vehicle_price.min, next),
    );
    setVehiclePrice(clamped);
  };

  const handlePriceBlur = () => {
    const clamped = Math.min(
      config.vehicle_price.max,
      Math.max(config.vehicle_price.min, vehiclePrice || config.vehicle_price.min),
    );
    setVehiclePrice(clamped);
    setPriceInput(String(clamped));
  };

  const scheduleRows = result ? pickPreviewRows(result.schedule) : [];
  const firstPaymentDate = result?.schedule[0]?.date;

  return (
    <section
      id="simulador"
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
      aria-label="Simulador de financiación"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Config */}
        <div className="flex flex-col gap-6 border-b border-slate-100 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            1. Configura tu financiación
          </h2>

          {configError ? (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800" role="status">
              {configError}
            </p>
          ) : null}

          <div className="flex flex-col gap-2">
            <label htmlFor="vehicle-price" className="text-sm font-medium text-slate-700">
              Precio del vehículo
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-slate-400"
                aria-hidden
              >
                $
              </span>
              <Input
                id="vehicle-price"
                inputMode="numeric"
                value={priceInput}
                onChange={(event) => handlePriceChange(event.target.value)}
                onBlur={handlePriceBlur}
                aria-label="Precio del vehículo"
                className="h-11 pl-7 text-base font-semibold"
              />
            </div>
          </div>

          <SimulatorSlider
            label="Entrada inicial"
            valueStr={`${downPaymentPercent}% (${formatCurrency(downPaymentPreview, currency)})`}
            minStr={`${config.down_payment_percent.min}%`}
            maxStr={`${config.down_payment_percent.max}%`}
            sliderValue={downPaymentPercent}
            sliderMin={config.down_payment_percent.min}
            sliderMax={config.down_payment_percent.max}
            step={config.down_payment_percent.step}
            onValueChange={setDownPaymentPercent}
          />

          <SimulatorSlider
            label="Meses del financiamiento"
            valueStr={`${termMonths} meses`}
            minStr={`${config.term_months.min} meses`}
            maxStr={`${config.term_months.max} meses`}
            sliderValue={termMonths}
            sliderMin={config.term_months.min}
            sliderMax={config.term_months.max}
            step={config.term_months.step}
            onValueChange={setTermMonths}
          />

          {/* Tasa de interés: se usa el default de config en simulate, sin UI editable */}

          {/* Seguro: UI comentada temporalmente; se sigue enviando el id default (standard) al API
          {config.insurance_options.length > 0 ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-slate-700">Tipo de seguro (opcional)</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {config.insurance_options.map((option) => {
                  const selected = insuranceOptionId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setInsuranceOptionId(option.id)}
                      aria-pressed={selected}
                      aria-label={`${option.label}, ${formatCurrency(option.monthly_amount, currency)} al mes`}
                      className={cn(
                        "rounded-xl border px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                        selected
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 bg-white hover:border-slate-300",
                      )}
                    >
                      <span className="block text-xs font-semibold text-slate-800">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-sm font-bold text-blue-700">
                        {formatCurrency(option.monthly_amount, currency)}/mes
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          */}

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="button"
              size="lg"
              className="h-12 w-full bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
              onClick={handleCalculate}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              <Calculator className="size-4" aria-hidden />
              {isLoading ? "Calculando..." : "Calcular financiamiento"}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <Lock className="size-3.5" aria-hidden />
              Tus datos están seguros con nosotros
            </p>
            {errorMessage ? (
              <p className="text-center text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-5 bg-slate-50/60 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              2. Resultados de tu simulación
            </h2>
            {result ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="size-3.5" aria-hidden />
                ¡Aprobación estimada!
              </span>
            ) : null}
          </div>

          {!hasCalculated || !result ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-6 text-center">
              <Calculator className="mb-3 size-10 text-slate-300" aria-hidden />
              <p className="text-sm font-medium text-slate-600">
                Ajusta los parámetros y pulsa &quot;Calcular financiamiento&quot; para ver
                tus resultados.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-xl bg-blue-600 px-5 py-5 text-white shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-100">
                  Cuota mensual estimada
                </p>
                <p className="mt-1 text-4xl font-bold tracking-tight">
                  {formatCurrency(result.monthly_total, currency)}
                </p>
                <p className="mt-1 text-xs text-blue-100">
                  Crédito {formatCurrency(result.monthly_payment, currency)}
                  {result.monthly_insurance > 0
                    ? ` + seguro ${formatCurrency(result.monthly_insurance, currency)}`
                    : ""}{" "}
                  · {termMonths} meses
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-medium text-slate-500">Monto a financiar</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {formatCurrency(result.financed_amount, currency)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-medium text-slate-500">Total a pagar</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {formatCurrency(result.total_to_pay, currency)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-[11px] font-medium text-slate-500">Costo del crédito</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {formatCurrency(result.credit_cost, currency)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <SimulatorBreakdownChart result={result} currency={currency} />
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">
                    Tabla de pagos (ejemplo)
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[320px] text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-2 font-medium">#</th>
                        <th className="px-4 py-2 font-medium">Fecha</th>
                        <th className="px-4 py-2 font-medium">Cuota</th>
                        <th className="px-4 py-2 font-medium">Saldo restante</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleRows.map((row, index) =>
                        row.isEllipsis ? (
                          <tr key={`ellipsis-${index}`}>
                            <td
                              colSpan={4}
                              className="px-4 py-2 text-center text-slate-400"
                            >
                              ···
                            </td>
                          </tr>
                        ) : (
                          <tr key={row.installment} className="border-t border-slate-100">
                            <td className="px-4 py-2 font-medium text-slate-700">
                              {row.installment}
                            </td>
                            <td className="px-4 py-2 text-slate-600">
                              {formatScheduleDate(row.date)}
                            </td>
                            <td className="px-4 py-2 text-slate-700">
                              {formatCurrency(row.payment, currency)}
                            </td>
                            <td className="px-4 py-2 text-slate-700">
                              {formatCurrency(row.remaining_balance, currency)}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3">
                <Info className="mt-0.5 size-4 shrink-0 text-blue-600" aria-hidden />
                <p className="text-xs leading-relaxed text-slate-600">
                  Esta simulación es referencial. Las condiciones finales pueden variar según
                  el banco, tu perfil crediticio y los seguros aplicables.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-start gap-2.5">
                  <CalendarDays className="mt-0.5 size-4 text-blue-600" aria-hidden />
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">Primera cuota</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {firstPaymentDate
                        ? formatScheduleDate(firstPaymentDate)
                        : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Percent className="mt-0.5 size-4 text-blue-600" aria-hidden />
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">
                      Tasa efectiva anual
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {formatPercent(result.effective_annual_rate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Wallet className="mt-0.5 size-4 text-blue-600" aria-hidden />
                  <div>
                    <p className="text-[11px] font-medium text-slate-500">
                      Costo total del crédito
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {formatCurrency(result.credit_cost, currency)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
