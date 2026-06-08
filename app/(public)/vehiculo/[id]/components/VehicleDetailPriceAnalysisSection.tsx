import type { VehicleDetailPriceAnalysis } from "../types/vehicle-detail.types";

type VehicleDetailPriceAnalysisSectionProps = {
  price_analysis: VehicleDetailPriceAnalysis;
};

export const VehicleDetailPriceAnalysisSection = ({
  price_analysis,
}: VehicleDetailPriceAnalysisSectionProps) => (
  <div className="rounded-xl border-l-4 border-red-500 bg-white p-6 shadow-sm">
    <h2 className="mb-2 text-lg font-semibold text-gray-900">Análisis del precio</h2>
    <p className="mb-3 font-medium text-red-600">{price_analysis.message}</p>
    <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
      {price_analysis.badge}
    </span>
    <p className="mt-4 text-xs text-gray-400">{price_analysis.disclaimer}</p>
  </div>
);
