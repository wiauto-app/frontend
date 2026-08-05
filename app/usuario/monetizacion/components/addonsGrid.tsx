import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldHalf } from "lucide-react";
import type { BillingCatalogPlan } from "@/interfaces/billing.interface";

type AddonsGridProps = {
  addons: BillingCatalogPlan[];
  loading?: boolean;
  onSelectAddon: (plan: BillingCatalogPlan, price_id: string) => void;
  formatPrice: (amount_cents: number) => string;
};

const AddonsGrid = ({
  addons,
  loading = false,
  onSelectAddon,
  formatPrice,
}: AddonsGridProps) => {
  if (!addons.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Add-ons & boosters</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {addons.map((addon) => {
          const price = addon.prices[0];
          return (
            <Card
              key={addon.id}
              className="overflow-hidden hover:shadow-lg transition-shadow bg-blue-100"
            >
              <CardContent className="px-6 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <ShieldHalf className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-md lg:text-lg font-bold text-gray-900">
                        {addon.name}
                      </h3>
                      {price ? (
                        <p className="text-sm text-gray-600">{formatPrice(price.amount_cents)}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">{addon.description}</p>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="mt-4 inline-block text-sm text-blue-600 p-0 h-auto"
                  disabled={loading || !price}
                  onClick={() => price && onSelectAddon(addon, price.id)}
                >
                  Activar →
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AddonsGrid;
