import type { SearchVehiclesInput } from "@/interfaces/search-vehicles.interface";
import type { VehicleListItem } from "@/interfaces/vehicle.interface";

export interface ClarifyingOption {
  id: string;
  label: string;
  filter_patch?: Partial<SearchVehiclesInput>;
}

export interface ClarifyingQuestion {
  id: string;
  prompt: string;
  multi: boolean;
  options: ClarifyingOption[];
}

export interface AskClarifyingQuestionsOutput {
  reason?: string;
  questions: ClarifyingQuestion[];
}

export interface SearchVehiclesToolOutput {
  total: number;
  vehicles: VehicleListItem[];
  appliedFilters: Record<string, unknown>;
}

export interface CompareVehicleRow {
  id: string;
  ref?: number;
  title: string;
  price?: number;
  year?: number | null;
  mileage?: number;
  fuel?: string | null;
  transmission?: string | null;
  power?: number | null;
  location?: string | null;
  make?: string | null;
  model?: string | null;
}

export interface CompareVehiclesCriterion {
  key: string;
  label: string;
  values: Record<string, string | number | null>;
}

export interface CompareVehiclesOutput {
  vehicles: CompareVehicleRow[];
  criteria: CompareVehiclesCriterion[];
  highlights: string[];
}

export type AnalyzeListingVerdict = "recomendable" | "riesgosa";

export type AnalyzeChecklistStatus = "ok" | "warning" | "fail" | "unknown" | "warn" | "missing";

export interface AnalyzeChecklistItem {
  id?: string;
  label: string;
  status?: AnalyzeChecklistStatus;
  detail?: string;
}

export interface AnalyzeListingRiskItem {
  id?: string;
  label: string;
  severity?: "low" | "medium" | "high";
  detail?: string;
}

export interface AnalyzeListingOutput {
  vehicle_id: string;
  ref?: number;
  verdict: AnalyzeListingVerdict;
  checklist: AnalyzeChecklistItem[];
  risks: Array<string | AnalyzeListingRiskItem>;
  summary: string;
}

export type SellerContactChannelType =
  | "wiauto_chat"
  | "whatsapp"
  | "phone"
  | "email"
  | string;

export interface SellerContactChannel {
  type: SellerContactChannelType;
  label: string;
  value: string;
  href?: string;
  publisher_profile_id?: string;
  vehicle_id?: string;
  vehicle_ref?: number;
}

export interface SellerContactVehicleSummary {
  id: string;
  ref?: number;
  title: string;
  price: number;
  mileage: number;
  year: number | null;
}

export interface PrepareSellerContactOutput {
  channels: SellerContactChannel[];
  suggested_message: string;
  recommended_questions: string[];
  vehicle_summary: SellerContactVehicleSummary;
}

export interface NegotiationOfferRange {
  min: number;
  max: number;
  currency?: string;
}

export interface PrepareNegotiationOutput {
  talking_points: string[];
  offer_range?: NegotiationOfferRange;
  caveats?: string[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const isAskClarifyingQuestionsOutput = (
  output: unknown,
): output is AskClarifyingQuestionsOutput => {
  if (!isRecord(output) || !Array.isArray(output.questions)) {
    return false;
  }

  return output.questions.every((question) => {
    if (!isRecord(question)) {
      return false;
    }

    return (
      typeof question.id === "string" &&
      typeof question.prompt === "string" &&
      typeof question.multi === "boolean" &&
      Array.isArray(question.options)
    );
  });
};

export const isSearchVehiclesOutput = (
  output: unknown,
): output is SearchVehiclesToolOutput => {
  if (!isRecord(output)) {
    return false;
  }

  return (
    Array.isArray(output.vehicles) && typeof output.total === "number"
  );
};

export const isCompareVehiclesOutput = (
  output: unknown,
): output is CompareVehiclesOutput => {
  if (
    !isRecord(output) ||
    !Array.isArray(output.vehicles) ||
    !Array.isArray(output.criteria) ||
    !Array.isArray(output.highlights)
  ) {
    return false;
  }

  const vehiclesOk = output.vehicles.every((vehicle) => {
    if (!isRecord(vehicle)) {
      return false;
    }

    return typeof vehicle.id === "string" && typeof vehicle.title === "string";
  });

  if (!vehiclesOk) {
    return false;
  }

  return output.criteria.every((criterion) => {
    if (!isRecord(criterion)) {
      return false;
    }

    return (
      typeof criterion.key === "string" &&
      typeof criterion.label === "string" &&
      isRecord(criterion.values)
    );
  });
};

export const isAnalyzeListingOutput = (
  output: unknown,
): output is AnalyzeListingOutput => {
  if (!isRecord(output)) {
    return false;
  }

  return (
    typeof output.vehicle_id === "string" &&
    (output.verdict === "recomendable" || output.verdict === "riesgosa") &&
    Array.isArray(output.checklist) &&
    Array.isArray(output.risks) &&
    typeof output.summary === "string"
  );
};

export const getAnalyzeRiskLabel = (
  risk: string | AnalyzeListingRiskItem,
): string => (typeof risk === "string" ? risk : risk.label);

export const isPrepareSellerContactOutput = (
  output: unknown,
): output is PrepareSellerContactOutput => {
  if (!isRecord(output)) {
    return false;
  }

  if (
    !Array.isArray(output.channels) ||
    typeof output.suggested_message !== "string" ||
    !Array.isArray(output.recommended_questions) ||
    !isRecord(output.vehicle_summary)
  ) {
    return false;
  }

  const summary = output.vehicle_summary;

  if (
    typeof summary.id !== "string" ||
    typeof summary.title !== "string" ||
    typeof summary.price !== "number" ||
    typeof summary.mileage !== "number"
  ) {
    return false;
  }

  return output.channels.every((channel) => {
    if (!isRecord(channel)) {
      return false;
    }

    return (
      typeof channel.type === "string" &&
      typeof channel.label === "string" &&
      typeof channel.value === "string"
    );
  });
};

export const isPrepareNegotiationOutput = (
  output: unknown,
): output is PrepareNegotiationOutput => {
  if (!isRecord(output)) {
    return false;
  }

  return Array.isArray(output.talking_points);
};
