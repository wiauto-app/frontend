import { Card, CardContent } from "@/components/ui/card";

import { DISCOVERY_FEATURES } from "../constants";

export const HistoryCards = () => {
  return (
    <section className="py-4 lg:py-10">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Todo lo que puedes descubrir
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {DISCOVERY_FEATURES.map((feature) => {
          const Icon = feature.icon;

          return (
            <Card
              key={feature.title}
              className="h-full border-0 py-0 shadow-[0_2px_12px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition-shadow hover:shadow-md"
            >
              <CardContent className="flex h-full flex-col items-center p-4 text-center sm:p-5">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6 stroke-[1.75]" aria-hidden />
                </div>
                <h3 className="mt-3 text-xs font-bold leading-snug text-slate-900 sm:text-sm">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500 sm:text-xs">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
