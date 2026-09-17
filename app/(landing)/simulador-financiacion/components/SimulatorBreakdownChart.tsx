"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import type {
  FinancingCurrency,
  SimulateFinancingResultDto,
} from "@/interfaces/financing-simulator.interface";

import { formatCurrency, formatPercent } from "../utils/format";

interface SimulatorBreakdownChartProps {
  result: SimulateFinancingResultDto;
  currency: FinancingCurrency;
}

const COLORS = {
  financed: "#2563eb",
  interest: "#22c55e",
  insurance: "#eab308",
} as const;

export const SimulatorBreakdownChart = ({
  result,
  currency,
}: SimulatorBreakdownChartProps) => {
  const financedAmount = result.financed_amount;
  const interestAmount = result.total_interest;
  const insuranceAmount = result.total_insurance;

  const chartData = [
    { key: "financed", name: "Monto a financiar", value: financedAmount, color: COLORS.financed },
    { key: "interest", name: "Intereses", value: interestAmount, color: COLORS.interest },
    { key: "insurance", name: "Seguros y cargos", value: insuranceAmount, color: COLORS.insurance },
  ].filter((item) => item.value > 0);

  const legend = [
    {
      label: "Monto a financiar",
      amount: financedAmount,
      percent: result.breakdown.financed_percent,
      color: COLORS.financed,
    },
    {
      label: "Intereses",
      amount: interestAmount,
      percent: result.breakdown.interest_percent,
      color: COLORS.interest,
    },
    {
      label: "Seguros y cargos",
      amount: insuranceAmount,
      percent: result.breakdown.insurance_percent,
      color: COLORS.insurance,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center">
      <div className="relative mx-auto h-44 w-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={72}
              strokeWidth={0}
              paddingAngle={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Total a pagar
          </span>
          <span className="text-sm font-bold text-slate-900">
            {formatCurrency(result.total_to_pay, currency)}
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {legend.map((item) => (
          <li key={item.label} className="flex items-start gap-2.5 text-sm">
            <span
              className="mt-1 size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-500">
                {formatCurrency(item.amount, currency)} ({formatPercent(item.percent, 1)})
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
