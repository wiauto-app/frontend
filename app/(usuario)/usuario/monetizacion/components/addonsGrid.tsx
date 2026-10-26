import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldHalf, Sparkles, Star } from "lucide-react";
import type { MonetizacionAddon } from "@/interfaces/billing.interface";

interface AddonsGridProps {
  addons: MonetizacionAddon[];
  loading?: boolean;
  onSelectAddon: (addon: MonetizacionAddon) => void;
  formatPrice: (amount_cents: number) => string;
}

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
      <h2 className="text-lg font-bold text-gray-900 mb-6">Complementos y impulsos</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {addons.map((addon) => {
          const Icon =
            addon.kind === "assistant_credits"
              ? Sparkles
              : addon.kind === "featured_listing"
                ? Star
                : ShieldHalf;

          return (
            <Card
              key={`${addon.kind}-${addon.id}`}
              className="overflow-hidden hover:shadow-lg transition-shadow bg-blue-100"
            >
              <CardContent className="px-6 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Icon className="w-6 h-6 text-blue-600" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-md lg:text-lg font-bold text-gray-900">
                        {addon.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatPrice(addon.amount_cents)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {addon.detail_label ? (
                    <p className="text-sm font-medium text-gray-800">
                      {addon.detail_label}
                    </p>
                  ) : null}
                  {addon.description ? (
                    <p className="text-sm text-gray-700">{addon.description}</p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="mt-4 inline-block text-sm text-blue-600 p-0 h-auto"
                  disabled={loading}
                  onClick={() => onSelectAddon(addon)}
                  aria-label={`Activar ${addon.title}`}
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
