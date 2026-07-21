import { CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { BRAND_BLUE } from "../constants";
import type { SegurosFeaturesSection } from "../interfaces/seguros.interface";

interface SegurosCoverageSectionProps {
  data: SegurosFeaturesSection | null;
}

export const SegurosCoverageSection = ({
  data,
}: SegurosCoverageSectionProps) => {
  if (!data) {
    return null;
  }

  const items = data.feature?.filter((item) => item.label?.trim()) ?? [];

  return (
    <section className="bg-white sm:py-6">
      <div className="container-custom mx-auto bg-gray-50 rounded-2xl pt-8 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {data.title ? (
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-4xl">
              {data.title}
            </h2>
          ) : null}
          {data.description ? (
            <p className="mt-3 text-slate-500">{data.description}</p>
          ) : null}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
            {items.map((item) => (
              <Card
                key={item.id}
                className="rounded-2xl border-0 bg-transparent shadow-none ring-0"
              >
                <CardContent className="flex items-center gap-3 p-5">
                  <CheckCircle2
                    className="size-5 shrink-0"
                    style={{ color: BRAND_BLUE }}
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {item.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};
