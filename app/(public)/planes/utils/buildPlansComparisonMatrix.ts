import type { BillingCatalogPlan } from "@/interfaces/billing.interface";

export type PlanComparisonCell = {
  included: boolean;
  description: string | null;
};

export type PlansComparisonMatrix = {
  plans: BillingCatalogPlan[];
  rows: string[];
  cells: Record<string, Record<string, PlanComparisonCell>>;
};

export const buildPlansComparisonMatrix = (
  plans: BillingCatalogPlan[],
): PlansComparisonMatrix => {
  const sorted_plans = [...plans].sort((left, right) => left.sort_order - right.sort_order);
  const row_labels: string[] = [];
  const row_set = new Set<string>();

  for (const plan of sorted_plans) {
    for (const feature of plan.features) {
      if (row_set.has(feature.label)) {
        continue;
      }

      row_set.add(feature.label);
      row_labels.push(feature.label);
    }
  }

  const cells: Record<string, Record<string, PlanComparisonCell>> = {};

  for (const plan of sorted_plans) {
    cells[plan.id] = {};

    for (const label of row_labels) {
      const feature = plan.features.find((item) => item.label === label);

      cells[plan.id][label] = {
        included: feature?.included ?? false,
        description: feature?.description ?? null,
      };
    }
  }

  return {
    plans: sorted_plans,
    rows: row_labels,
    cells,
  };
};
