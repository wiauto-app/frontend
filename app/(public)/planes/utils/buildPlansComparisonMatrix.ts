import type { BillingCatalogPlan } from "@/interfaces/billing.interface";
import {
  formatCatalogEntitlement,
  getEntitlementFeatureLabel,
  listCatalogEntitlementDisplays,
} from "@/lib/billing/entitlements";

export interface PlanComparisonCell {
  included: boolean;
  description: string | null;
  valueLabel: string | null;
}

export interface PlansComparisonMatrix {
  plans: BillingCatalogPlan[];
  rows: string[];
  cells: Record<string, Record<string, PlanComparisonCell>>;
}

export const buildPlansComparisonMatrix = (
  plans: BillingCatalogPlan[],
): PlansComparisonMatrix => {
  const sortedPlans = [...plans].sort((left, right) => left.sort_order - right.sort_order);
  const rowLabels: string[] = [];
  const rowSet = new Set<string>();

  for (const plan of sortedPlans) {
    for (const item of listCatalogEntitlementDisplays(plan.entitlements)) {
      const rowKey = getEntitlementFeatureLabel(item.feature);
      if (rowSet.has(rowKey)) {
        continue;
      }
      rowSet.add(rowKey);
      rowLabels.push(rowKey);
    }

    for (const feature of plan.features ?? []) {
      if (rowSet.has(feature.label)) {
        continue;
      }
      rowSet.add(feature.label);
      rowLabels.push(feature.label);
    }
  }

  const cells: Record<string, Record<string, PlanComparisonCell>> = {};

  for (const plan of sortedPlans) {
    cells[plan.id] = {};
    const entitlementsByLabel = new Map(
      (plan.entitlements ?? []).map((entitlement) => {
        const display = formatCatalogEntitlement(entitlement);
        return [getEntitlementFeatureLabel(entitlement.feature), display] as const;
      }),
    );

    for (const label of rowLabels) {
      const entitlementDisplay = entitlementsByLabel.get(label);
      if (entitlementDisplay) {
        cells[plan.id][label] = {
          included: entitlementDisplay.included,
          description: null,
          valueLabel: entitlementDisplay.valueLabel,
        };
        continue;
      }

      const feature = (plan.features ?? []).find((item) => item.label === label);
      cells[plan.id][label] = {
        included: feature?.included ?? false,
        description: feature?.description ?? null,
        valueLabel: feature?.included ? feature.label : null,
      };
    }
  }

  return {
    plans: sortedPlans,
    rows: rowLabels,
    cells,
  };
};
